import { NextResponse } from "next/server";
import { getJobStats } from "@/lib/services/job-sync";

/**
 * GET /api/jobs/stats
 * Get job listing statistics for dashboard
 * Public endpoint (no authentication required)
 */
export async function GET() {
  try {
    const stats = await getJobStats();

    return NextResponse.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("[API] Job stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job statistics",
        totalJobs: 0,
        activeJobs: 0,
        jobsByType: {},
        jobsByWorkMode: {},
        jobsBySource: {},
        lastSyncTime: null,
      },
      { status: 500 }
    );
  }
}
