import prisma from "@/lib/db";
import * as jsearch from "../job-aggregation/jsearch";
import * as usajobs from "../job-aggregation/usajobs";
import type { SyncOptions, SyncResult, RawJob } from "../job-aggregation/types";

/**
 * Job Sync Orchestrator
 * Coordinates fetching jobs from multiple sources and saving to database
 */

export async function syncJobs(options: SyncOptions = {}): Promise<SyncResult> {
  const startTime = Date.now();
  const source = options.source || "all";
  const errors: string[] = [];
  let totalJobsFound = 0;
  let totalJobsSaved = 0;

  console.log(`[JobSync] Starting sync for source: ${source}`);

  try {
    const allJobs: RawJob[] = [];

    // Fetch from JSearch
    if (source === "jsearch" || source === "all") {
      try {
        const jSearchJobs = await jsearch.fetchWashingtonJobs();
        allJobs.push(...jSearchJobs);
        console.log(`[JobSync] JSearch returned ${jSearchJobs.length} jobs`);
      } catch (error) {
        const errorMsg = `JSearch fetch failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[JobSync] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Fetch from USAJOBS
    if (source === "usajobs" || source === "all") {
      try {
        const usaJobsJobs = await usajobs.fetchWashingtonJobs();
        allJobs.push(...usaJobsJobs);
        console.log(`[JobSync] USAJOBS returned ${usaJobsJobs.length} jobs`);
      } catch (error) {
        const errorMsg = `USAJOBS fetch failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[JobSync] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    totalJobsFound = allJobs.length;
    console.log(`[JobSync] Total jobs fetched from all sources: ${totalJobsFound}`);

    // Save jobs to database
    if (allJobs.length > 0) {
      totalJobsSaved = await saveJobsToDatabase(allJobs);
      console.log(`[JobSync] Saved ${totalJobsSaved} jobs to database`);
    }

    // Mark stale jobs as inactive
    await markStaleJobsInactive();

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      source,
      jobsFound: totalJobsFound,
      jobsSaved: totalJobsSaved,
      errors,
      duration,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[JobSync] Fatal error during sync:", error);
    errors.push(errorMsg);

    return {
      success: false,
      source,
      jobsFound: totalJobsFound,
      jobsSaved: totalJobsSaved,
      errors,
      duration: Date.now() - startTime,
    };
  }
}

/**
 * Save jobs to database using upsert to handle duplicates
 */
async function saveJobsToDatabase(jobs: RawJob[]): Promise<number> {
  let savedCount = 0;

  for (const job of jobs) {
    try {
      await prisma.jobListing.upsert({
        where: { externalId: job.id },
        create: {
          externalId: job.id,
          source: job.source,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          jobType: job.jobType,
          workMode: job.workMode,
          industry: job.industry,
          salaryRange: job.salaryRange,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          externalUrl: job.externalUrl,
          postedDate: job.postedDate,
          fetchedAt: new Date(),
          isActive: true,
        },
        update: {
          // Update fetchedAt to mark as recently seen
          fetchedAt: new Date(),
          // Update other fields in case they changed
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          jobType: job.jobType,
          workMode: job.workMode,
          industry: job.industry,
          salaryRange: job.salaryRange,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          externalUrl: job.externalUrl,
          postedDate: job.postedDate,
          isActive: true,
        },
      });

      savedCount++;
    } catch (error) {
      console.error(`[JobSync] Failed to save job ${job.id}:`, error);
    }
  }

  return savedCount;
}

/**
 * Mark jobs as inactive if they haven't been fetched recently
 */
async function markStaleJobsInactive(): Promise<void> {
  const staleThresholdHours = parseInt(process.env.JOB_STALE_THRESHOLD_HOURS || "72");
  const staleDate = new Date();
  staleDate.setHours(staleDate.getHours() - staleThresholdHours);

  try {
    const result = await prisma.jobListing.updateMany({
      where: {
        fetchedAt: {
          lt: staleDate,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    console.log(`[JobSync] Marked ${result.count} jobs as inactive (stale > ${staleThresholdHours}h)`);
  } catch (error) {
    console.error("[JobSync] Error marking stale jobs inactive:", error);
  }
}

/**
 * Get statistics about job listings in the database
 */
export async function getJobStats() {
  const [totalJobs, activeJobs, jobsByType, jobsByWorkMode, jobsBySource] = await Promise.all([
    prisma.jobListing.count(),
    prisma.jobListing.count({ where: { isActive: true } }),
    prisma.jobListing.groupBy({
      by: ["jobType"],
      where: { isActive: true },
      _count: true,
    }),
    prisma.jobListing.groupBy({
      by: ["workMode"],
      where: { isActive: true },
      _count: true,
    }),
    prisma.jobListing.groupBy({
      by: ["source"],
      where: { isActive: true },
      _count: true,
    }),
  ]);

  // Get the most recent sync time
  const latestJob = await prisma.jobListing.findFirst({
    orderBy: { fetchedAt: "desc" },
    select: { fetchedAt: true },
  });

  return {
    totalJobs,
    activeJobs,
    jobsByType: Object.fromEntries(jobsByType.map((item) => [item.jobType || "unknown", item._count])),
    jobsByWorkMode: Object.fromEntries(jobsByWorkMode.map((item) => [item.workMode || "unknown", item._count])),
    jobsBySource: Object.fromEntries(jobsBySource.map((item) => [item.source, item._count])),
    lastSyncTime: latestJob?.fetchedAt?.toISOString() || null,
  };
}
