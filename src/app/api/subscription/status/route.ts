import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        profile: {
          select: {
            firstName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPremium = user.subscriptionTier === "PREMIUM" && user.subscriptionStatus === "active";

    return NextResponse.json({
      success: true,
      subscription: {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        isPremium,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        firstName: user.profile?.firstName || "",
      },
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 }
    );
  }
}
