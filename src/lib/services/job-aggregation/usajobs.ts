import type { USAJobsQuery, USAJobsResponse, RawJob } from "./types";

/**
 * USAJOBS API Client
 * Federal and state government job listings
 */

const USAJOBS_API_KEY = process.env.USAJOBS_API_KEY;
const USAJOBS_USER_AGENT = process.env.USAJOBS_USER_AGENT || "support@martinbuiltstrategies.com";
const USAJOBS_ENDPOINT = "https://data.usajobs.gov/api/search";

export async function searchJobs(query: USAJobsQuery): Promise<RawJob[]> {
  if (!USAJOBS_API_KEY) {
    console.warn("[USAJOBS] API key not configured, skipping USAJOBS");
    return [];
  }

  try {
    const params = new URLSearchParams();

    if (query.keyword) {
      params.append("Keyword", query.keyword);
    }
    if (query.locationName) {
      params.append("LocationName", query.locationName);
    }
    if (query.positionScheduleTypeCode) {
      params.append("PositionScheduleTypeCode", query.positionScheduleTypeCode);
    }
    if (query.remoteIndicator !== undefined) {
      params.append("RemoteIndicator", query.remoteIndicator.toString());
    }
    if (query.resultPage) {
      params.append("Page", query.resultPage.toString());
    }

    // Add result count
    params.append("ResultsPerPage", "100");

    console.log(`[USAJOBS] Fetching jobs with query: ${query.keyword || "all"}, location: ${query.locationName}`);

    const response = await fetch(`${USAJOBS_ENDPOINT}?${params}`, {
      method: "GET",
      headers: {
        "Host": "data.usajobs.gov",
        "User-Agent": USAJOBS_USER_AGENT,
        "Authorization-Key": USAJOBS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`[USAJOBS] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: USAJobsResponse = await response.json();

    if (!data.SearchResult?.SearchResultItems || data.SearchResult.SearchResultItems.length === 0) {
      console.log("[USAJOBS] No jobs found");
      return [];
    }

    console.log(`[USAJOBS] Found ${data.SearchResult.SearchResultItems.length} jobs`);

    // Transform USAJOBS to common RawJob format
    const jobs: RawJob[] = data.SearchResult.SearchResultItems.map((item) => {
      const job = item.MatchedObjectDescriptor;

      // Determine work mode
      let workMode: string | null = "on-site";
      if (job.PositionRemoteIndicator === true) {
        workMode = "remote";
      }

      // Determine job type
      let jobType: string | null = null;
      if (job.PositionSchedule && job.PositionSchedule.length > 0) {
        const scheduleCode = job.PositionSchedule[0].Code;
        jobType = mapUSAJobsScheduleType(scheduleCode || "");
      }

      // Parse description - combine available description fields
      let description = "";
      if (job.UserArea?.Details?.JobSummary) {
        description += job.UserArea.Details.JobSummary;
      } else if (job.QualificationSummary) {
        description += job.QualificationSummary;
      }

      // Parse salary
      let salaryMin: number | null = null;
      let salaryMax: number | null = null;
      let salaryRange: string | null = null;

      if (job.RemunerationRange?.MinimumRange && job.RemunerationRange?.MaximumRange) {
        try {
          salaryMin = parseFloat(job.RemunerationRange.MinimumRange);
          salaryMax = parseFloat(job.RemunerationRange.MaximumRange);
          salaryRange = `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()} per year`;
        } catch (e) {
          // Ignore parsing errors
        }
      }

      // Parse posted date
      let postedDate: Date | null = null;
      if (job.PositionStartDate) {
        postedDate = new Date(job.PositionStartDate);
      }

      return {
        id: job.PositionID,
        source: "usajobs",
        title: job.PositionTitle,
        company: job.OrganizationName || "U.S. Government",
        location: job.PositionLocationDisplay || null,
        description: description || null,
        jobType,
        workMode,
        industry: "Government",
        salaryRange,
        salaryMin,
        salaryMax,
        externalUrl: job.PositionURI,
        postedDate,
      };
    });

    return jobs;
  } catch (error) {
    console.error("[USAJOBS] Error fetching jobs:", error);
    return [];
  }
}

/**
 * Map USAJOBS schedule type codes to our standard format
 */
function mapUSAJobsScheduleType(code: string): string {
  // USAJOBS codes: 1=Full-time, 2=Part-time, 3=Shift Work, 4=Intermittent, 5=Job Sharing, 6=Multiple Schedules
  if (code === "1") return "full-time";
  if (code === "2") return "part-time";
  if (code === "3") return "shift-work";
  if (code === "4") return "intermittent";
  if (code === "5") return "job-sharing";
  if (code === "6") return "multiple-schedules";
  return "other";
}

/**
 * Fetch government jobs for Washington state
 * Returns jobs for both full-time and part-time positions
 */
export async function fetchWashingtonJobs(): Promise<RawJob[]> {
  const location = "Washington";
  const allJobs: RawJob[] = [];

  // Query 1: All jobs in Washington
  const washingtonJobs = await searchJobs({
    locationName: location,
    keyword: "jobs",
  });
  allJobs.push(...washingtonJobs);

  // Query 2: Remote jobs (nationwide but including Washington)
  const remoteJobs = await searchJobs({
    remoteIndicator: true,
    keyword: "remote",
  });
  allJobs.push(...remoteJobs);

  console.log(`[USAJOBS] Total jobs fetched: ${allJobs.length}`);
  return allJobs;
}
