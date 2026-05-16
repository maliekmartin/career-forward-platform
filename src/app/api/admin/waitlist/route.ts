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
      console.log("[ADMIN WAITLIST] Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true, email: true },
    });

    if (user?.role !== "ADMIN") {
      console.log(`[ADMIN WAITLIST] Forbidden access attempt by user: ${user?.email || session.userId}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log(`[ADMIN WAITLIST] Admin ${user.email} fetching waitlist data`);

    // Calculate date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    // Fetch stats and recent entries in parallel with retry logic
    let retries = 0;
    const maxRetries = 3;
    let result;

    while (retries < maxRetries) {
      try {
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

        result = {
          stats: { total, today, thisWeek },
          recent,
        };

        console.log(`[ADMIN WAITLIST] ✅ Successfully fetched data: Total=${total}, Today=${today}, Week=${thisWeek}`);
        break;
      } catch (dbError: any) {
        retries++;
        console.error(`[ADMIN WAITLIST] Database error on attempt ${retries}/${maxRetries}:`, dbError);

        if (retries >= maxRetries) {
          throw dbError;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries)));
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[ADMIN WAITLIST] ❌ Error fetching waitlist data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch waitlist data",
        message: "We're experiencing technical difficulties. Please refresh the page or try again later.",
      },
      { status: 500 }
    );
  }
}
