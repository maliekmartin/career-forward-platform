/**
 * Common types for job aggregation services
 */

export interface RawJob {
  id: string;
  source: "jsearch" | "usajobs";
  title: string;
  company: string | null;
  location: string | null;
  description: string | null;
  jobType: string | null;
  workMode: string | null;
  industry: string | null;
  salaryRange: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  externalUrl: string;
  postedDate: Date | null;
}

export interface JSearchQuery {
  query: string;
  location?: string;
  employment_types?: string; // "FULLTIME,PARTTIME,CONTRACTOR"
  remote_jobs_only?: boolean;
  page?: number;
  num_pages?: number;
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  data: JSearchJob[];
}

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_description: string;
  job_employment_type?: string; // "FULLTIME", "PARTTIME", "CONTRACTOR"
  job_is_remote?: boolean;
  job_posted_at_datetime_utc?: string;
  job_apply_link: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
}

export interface USAJobsQuery {
  keyword?: string;
  locationName?: string;
  positionScheduleTypeCode?: string; // "1"=Full-time, "2"=Part-time
  remoteIndicator?: boolean;
  resultPage?: number;
}

export interface USAJobsResponse {
  SearchResult: {
    SearchResultItems?: USAJobsItem[];
    SearchResultCount: number;
  };
}

export interface USAJobsItem {
  MatchedObjectDescriptor: {
    PositionID: string;
    PositionTitle: string;
    OrganizationName: string;
    PositionLocationDisplay: string;
    UserArea?: {
      Details?: {
        MajorDuties?: string;
        JobSummary?: string;
      };
    };
    PositionSchedule?: Array<{
      Name?: string;
      Code?: string;
    }>;
    PositionRemoteIndicator?: boolean;
    PositionStartDate?: string;
    ApplicationCloseDate?: string;
    PositionURI: string;
    QualificationSummary?: string;
    PositionFormattedDescription?: Array<{
      Label?: string;
      LabelDescription?: string;
    }>;
    PositionOfferingType?: Array<{
      Name?: string;
      Code?: string;
    }>;
    RemunerationRange?: {
      MinimumRange?: string;
      MaximumRange?: string;
    };
  };
}

export interface SyncOptions {
  source?: "jsearch" | "usajobs" | "all";
  force?: boolean;
}

export interface SyncResult {
  success: boolean;
  source: string;
  jobsFound: number;
  jobsSaved: number;
  errors: string[];
  duration: number;
}
