import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

/**
 * GET - Fetch waitlist stats and recent entries for admin dashboard
 */
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Calculate date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    // Fetch stats and recent entries in parallel
    const [total, today, thisWeek, recent] = await Promise.all([
      prisma.waitlistEntry.count(),
      prisma.waitlistEntry.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.waitlistEntry.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.waitlistEntry.findMany({
        select: {
          firstName: true,
          email: true,
          region: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      stats: { total, today, thisWeek },
      recent,
    });
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist data" },
      { status: 500 }
    );
  }
}
