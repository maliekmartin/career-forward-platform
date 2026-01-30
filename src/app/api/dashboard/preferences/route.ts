import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
  DashboardPreferences,
  getDefaultDashboardPreferences,
  validateMetricSelection,
  MAX_METRICS,
  COACH_SECTIONS,
  JOB_SEEKER_SECTIONS,
} from "@/lib/types/dashboard";

// ==================== GET: Fetch Dashboard Preferences ====================

export async function GET() {
  try {
    // Check authentication
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", code: "UNAUTHORIZED" },
        { status: 404 }
      );
    }

    // Get profile separately
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    const isPremium = user.subscriptionTier === "PREMIUM";
    const userRole = user.role === "COACH" ? "coach" : "job_seeker";

    // Get preferences from profile or return defaults
    let preferences: DashboardPreferences;

    if (profile?.dashboardPreferences) {
      // Parse existing preferences (cast through unknown for type safety)
      preferences = profile.dashboardPreferences as unknown as DashboardPreferences;
    } else {
      // Return default preferences based on role
      preferences = getDefaultDashboardPreferences(userRole);
    }

    return NextResponse.json({
      success: true,
      preferences,
      isPremium,
    });
  } catch (error) {
    console.error("Error fetching dashboard preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

// ==================== PUT: Update Dashboard Preferences ====================

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", code: "UNAUTHORIZED" },
        { status: 404 }
      );
    }

    // Check if user has PREMIUM subscription
    if (user.subscriptionTier !== "PREMIUM") {
      return NextResponse.json(
        {
          error: "Dashboard customization is only available for PREMIUM users",
          code: "NOT_PREMIUM",
        },
        { status: 403 }
      );
    }

    // Get profile separately
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    // Parse request body
    const body = await request.json();
    const { metrics, sections, metricsLayout, themeOverride } = body;

    // Validate request
    if (!metrics || !Array.isArray(metrics)) {
      return NextResponse.json(
        { error: "Invalid metrics array" },
        { status: 400 }
      );
    }

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: "Invalid sections array" },
        { status: 400 }
      );
    }

    // Determine user role
    const userRole = user.role === "COACH" ? "coach" : "job_seeker";

    // Validate metrics
    if (metrics.length > MAX_METRICS) {
      return NextResponse.json(
        {
          error: `Maximum of ${MAX_METRICS} metrics allowed`,
          code: "INVALID_METRICS",
        },
        { status: 400 }
      );
    }

    const metricValidation = validateMetricSelection(metrics, userRole);
    if (!metricValidation.valid) {
      return NextResponse.json(
        {
          error: metricValidation.errors.join(", "),
          code: "INVALID_METRICS",
        },
        { status: 400 }
      );
    }

    // Validate sections
    const validSections = userRole === "coach"
      ? Object.keys(COACH_SECTIONS)
      : Object.keys(JOB_SEEKER_SECTIONS);

    const invalidSections = sections
      .map((s: { id: string }) => s.id)
      .filter((id: string) => !validSections.includes(id));

    if (invalidSections.length > 0) {
      return NextResponse.json(
        { error: `Invalid sections: ${invalidSections.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate sections structure
    for (const section of sections) {
      if (
        typeof section.id !== "string" ||
        typeof section.visible !== "boolean" ||
        typeof section.order !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid section structure" },
          { status: 400 }
        );
      }
    }

    // Validate metricsLayout
    if (metricsLayout && !["3x2", "2x3"].includes(metricsLayout)) {
      return NextResponse.json(
        { error: "Invalid metrics layout" },
        { status: 400 }
      );
    }

    // Validate themeOverride
    if (themeOverride && !["light", "dark", null].includes(themeOverride)) {
      return NextResponse.json(
        { error: "Invalid theme override" },
        { status: 400 }
      );
    }

    // Create updated preferences object
    const updatedPreferences: DashboardPreferences = {
      metrics,
      sections,
      metricsLayout: metricsLayout || "3x2",
      themeOverride: themeOverride === undefined ? null : themeOverride,
      updatedAt: new Date().toISOString(),
    };

    // Ensure profile exists
    if (!profile) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          dashboardPreferences: updatedPreferences as unknown as Prisma.InputJsonValue,
        },
      });
    } else {
      // Update profile with new preferences
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          dashboardPreferences: updatedPreferences as unknown as Prisma.InputJsonValue,
        },
      });
    }

    return NextResponse.json({
      success: true,
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error("Error updating dashboard preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
