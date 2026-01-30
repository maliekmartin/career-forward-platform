import { NextRequest, NextResponse } from "next/server";
import { syncJobs } from "@/lib/services/job-sync";

/**
 * POST /api/jobs/sync
 * Trigger background job synchronization from external APIs
 *
 * Authentication: Requires CRON_SECRET in Authorization header or admin user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { success: false, error: "CRON_SECRET not configured" },
        { status: 500 }
      );
    }

    // Check if request is from Vercel Cron or has valid secret
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      request.headers.get("x-vercel-cron") === "1";

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const source = body.source || "all";
    const force = body.force || false;

    console.log(`[API] Starting job sync for source: ${source}, force: ${force}`);

    // Execute sync
    const result = await syncJobs({ source, force });

    // Return results
    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Successfully synced ${result.jobsSaved} jobs`
        : "Sync completed with errors",
      ...result,
    });
  } catch (error) {
    console.error("[API] Job sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during sync",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/jobs/sync
 * Check sync status or trigger manual sync (for testing)
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  // For GET, just return sync configuration info
  if (authHeader === `Bearer ${cronSecret}`) {
    return NextResponse.json({
      configured: true,
      message: "Job sync is configured. Use POST to trigger sync.",
      config: {
        staleThreshold: process.env.JOB_STALE_THRESHOLD_HOURS || "72",
        defaultLocation: process.env.DEFAULT_LOCATION || "Washington, WA",
      },
    });
  }

  return NextResponse.json({
    configured: !!cronSecret,
    message: "Job sync endpoint. Use POST with authorization to trigger sync.",
  });
}
