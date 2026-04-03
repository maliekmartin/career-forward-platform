import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { z } from "zod";

// Schema for submitting a success story
const submitStorySchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  hourlyWage: z.number().optional(),
  hoursPerWeek: z.number().optional(),
  startDate: z.string().optional(),
  story: z.string().min(10, "Please share more about your journey"),
  showFullName: z.boolean().optional().default(false),
});

// POST - Submit a new success story
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = submitStorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Get user's name for display
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });

    // Create display name (e.g., "Marcus R." or full name)
    let displayName = "Anonymous";
    if (user?.profile?.firstName) {
      if (data.showFullName && user.profile.lastName) {
        displayName = `${user.profile.firstName} ${user.profile.lastName}`;
      } else {
        displayName = `${user.profile.firstName} ${user.profile.lastName?.[0] || ""}.`.trim();
      }
    }

    const story = await prisma.successStory.create({
      data: {
        userId: session.userId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        hourlyWage: data.hourlyWage,
        hoursPerWeek: data.hoursPerWeek,
        startDate: data.startDate ? new Date(data.startDate) : null,
        story: data.story,
        displayName,
        showFullName: data.showFullName || false,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        status: story.status,
      },
      message: "Thank you for sharing your success story! It will be reviewed and may be featured on our platform.",
    });
  } catch (error) {
    console.error("Error submitting success story:", error);
    return NextResponse.json(
      { error: "Failed to submit success story" },
      { status: 500 }
    );
  }
}

// GET - Fetch approved success stories (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");

    const stories = await prisma.successStory.findMany({
      where: {
        status: "APPROVED",
        ...(featured && { featured: true }),
      },
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        story: true,
        displayName: true,
        featured: true,
        createdAt: true,
      },
      orderBy: [
        { featured: "desc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch success stories" },
      { status: 500 }
    );
  }
}
