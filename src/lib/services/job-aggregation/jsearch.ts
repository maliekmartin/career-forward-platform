import type { JSearchQuery, JSearchResponse, RawJob } from "./types";

/**
 * JSearch API Client (via RapidAPI)
 * Aggregates jobs from LinkedIn, Indeed, ZipRecruiter, and more
 */

const JSEARCH_ENDPOINT = process.env.JSEARCH_ENDPOINT || "https://jsearch.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export async function searchJobs(query: JSearchQuery): Promise<RawJob[]> {
  if (!RAPIDAPI_KEY) {
    console.warn("[JSearch] API key not configured, skipping JSearch");
    return [];
  }

  try {
    const params = new URLSearchParams({
      query: query.query,
      ...(query.location && { location: query.location }),
      ...(query.employment_types && { employment_types: query.employment_types }),
      ...(query.remote_jobs_only !== undefined && { remote_jobs_only: query.remote_jobs_only.toString() }),
      ...(query.page && { page: query.page.toString() }),
      ...(query.num_pages && { num_pages: query.num_pages.toString() }),
    });

    console.log(`[JSearch] Fetching jobs with query: ${query.query}, location: ${query.location}`);

    const response = await fetch(`${JSEARCH_ENDPOINT}/search?${params}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      console.error(`[JSearch] API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: JSearchResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log("[JSearch] No jobs found");
      return [];
    }

    console.log(`[JSearch] Found ${data.data.length} jobs`);

    // Transform JSearch jobs to common RawJob format
    const jobs: RawJob[] = data.data.map((job) => {
      // Determine location string
      const locationParts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(", ") : null;

      // Determine work mode
      let workMode: string | null = null;
      if (job.job_is_remote === true) {
        workMode = "remote";
      } else if (location) {
        workMode = "on-site";
      }

      // Map employment type
      const jobType = job.job_employment_type
        ? mapJSearchEmploymentType(job.job_employment_type)
        : null;

      // Parse posted date
      let postedDate: Date | null = null;
      if (job.job_posted_at_datetime_utc) {
        postedDate = new Date(job.job_posted_at_datetime_utc);
      }

      // Parse salary
      let salaryMin: number | null = null;
      let salaryMax: number | null = null;
      let salaryRange: string | null = null;

      if (job.job_min_salary && job.job_max_salary) {
        salaryMin = job.job_min_salary;
        salaryMax = job.job_max_salary;
        const period = job.job_salary_period || "year";
        salaryRange = `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()} per ${period}`;
      }

      return {
        id: job.job_id,
        source: "jsearch",
        title: job.job_title,
        company: job.employer_name || null,
        location,
        description: job.job_description || null,
        jobType,
        workMode,
        industry: null, // JSearch doesn't provide industry categorization
        salaryRange,
        salaryMin,
        salaryMax,
        externalUrl: job.job_apply_link,
        postedDate,
      };
    });

    return jobs;
  } catch (error) {
    console.error("[JSearch] Error fetching jobs:", error);
    return [];
  }
}

/**
 * Map JSearch employment types to our standard format
 */
function mapJSearchEmploymentType(type: string): string {
  const typeUpper = type.toUpperCase();
  if (typeUpper === "FULLTIME") return "full-time";
  if (typeUpper === "PARTTIME") return "part-time";
  if (typeUpper === "CONTRACTOR") return "contract";
  if (typeUpper === "INTERN") return "internship";
  return "other";
}

/**
 * Fetch jobs for Washington state with multiple queries
 * Returns jobs for both full-time and part-time positions
 */
export async function fetchWashingtonJobs(): Promise<RawJob[]> {
  const location = process.env.DEFAULT_LOCATION || "Washington, WA";
  const allJobs: RawJob[] = [];

  // Query 1: Full-time jobs
  const fullTimeJobs = await searchJobs({
    query: "jobs",
    location,
    employment_types: "FULLTIME",
    num_pages: 1,
  });
  allJobs.push(...fullTimeJobs);

  // Query 2: Part-time jobs
  const partTimeJobs = await searchJobs({
    query: "jobs",
    location,
    employment_types: "PARTTIME",
    num_pages: 1,
  });
  allJobs.push(...partTimeJobs);

  // Query 3: Remote jobs (any employment type)
  const remoteJobs = await searchJobs({
    query: "remote jobs",
    location,
    remote_jobs_only: true,
    num_pages: 1,
  });
  allJobs.push(...remoteJobs);

  // Query 4: Contract jobs
  const contractJobs = await searchJobs({
    query: "contract jobs",
    location,
    employment_types: "CONTRACTOR",
    num_pages: 1,
  });
  allJobs.push(...contractJobs);

  console.log(`[JSearch] Total jobs fetched: ${allJobs.length}`);
  return allJobs;
}
