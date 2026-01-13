"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Job, JobApplication, mockJobs } from "./job-data";

interface HiredData {
  startDate: string;
  jobTitle: string;
  hourlyWage?: number;
  salary?: number;
  hoursPerWeek: number;
  successStory?: string;
}

interface JobApplicationsContextType {
  applications: JobApplication[];
  addApplication: (job: Job) => void;
  updateApplicationStatus: (applicationId: string, status: JobApplication["status"]) => void;
  setHiredData: (applicationId: string, hiredData: HiredData) => void;
  getApplicationByJobId: (jobId: string) => JobApplication | undefined;
  isJobApplied: (jobId: string) => boolean;
}

const JobApplicationsContext = createContext<JobApplicationsContextType | null>(null);

// Initial demo applications (matching the old job tracker data style)
const initialApplications: JobApplication[] = [
  {
    id: "app-1",
    jobId: "demo-1",
    job: {
      id: "demo-1",
      title: "Marketing Coordinator",
      company: "Acme Corporation",
      location: "Spokane, WA",
      description: "Marketing coordinator position handling campaign coordination and analytics.",
      requirements: ["Marketing degree", "2+ years experience"],
      payMin: 45000,
      payMax: 55000,
      payType: "salary",
      hoursType: "full-time",
      datePosted: new Date().toISOString(),
      source: "indeed",
      sourceUrl: "https://indeed.com/jobs/marketing-coordinator-acme",
      category: "admin",
      remote: false,
    },
    status: "first-interview",
    appliedDate: "2026-01-05",
    lastUpdated: "2026-01-06",
    notes: "Phone screen scheduled for Monday",
  },
  {
    id: "app-2",
    jobId: "demo-2",
    job: {
      id: "demo-2",
      title: "Junior Developer",
      company: "Tech Solutions Inc",
      location: "Remote",
      description: "Entry-level developer position working on web applications.",
      requirements: ["CS degree or bootcamp", "JavaScript experience"],
      payMin: 60000,
      payMax: 75000,
      payType: "salary",
      hoursType: "full-time",
      datePosted: new Date().toISOString(),
      source: "linkedin",
      sourceUrl: "https://linkedin.com/jobs/junior-developer-tech-solutions",
      category: "tech",
      remote: true,
    },
    status: "applied",
    appliedDate: "2026-01-03",
    lastUpdated: "2026-01-03",
    notes: "",
  },
  {
    id: "app-3",
    jobId: "demo-3",
    job: {
      id: "demo-3",
      title: "Administrative Assistant",
      company: "Healthcare Plus",
      location: "Spokane Valley, WA",
      description: "Administrative support for healthcare facility.",
      requirements: ["Office experience", "Microsoft Office"],
      payMin: 38000,
      payMax: 42000,
      payType: "salary",
      hoursType: "full-time",
      datePosted: new Date().toISOString(),
      source: "worksourcewa",
      sourceUrl: "https://worksourcewa.com/jobs/admin-assistant-healthcare-plus",
      category: "admin",
      remote: false,
    },
    status: "offered",
    appliedDate: "2025-12-28",
    lastUpdated: "2026-01-06",
    notes: "Offer received! Need to respond by Friday",
  },
  {
    id: "app-4",
    jobId: "demo-4",
    job: {
      id: "demo-4",
      title: "Sales Associate",
      company: "Retail Group",
      location: "Spokane, WA",
      description: "Retail sales position in a busy store environment.",
      requirements: ["Customer service experience", "Flexible schedule"],
      payMin: 32000,
      payMax: 36000,
      payType: "salary",
      hoursType: "full-time",
      datePosted: new Date().toISOString(),
      source: "indeed",
      sourceUrl: "https://indeed.com/jobs/sales-associate-retail-group",
      category: "retail",
      remote: false,
    },
    status: "rejected",
    appliedDate: "2025-12-20",
    lastUpdated: "2026-01-02",
    notes: "Position filled internally",
  },
  {
    id: "app-5",
    jobId: "demo-5",
    job: {
      id: "demo-5",
      title: "Accounts Receivable Clerk",
      company: "Finance Partners",
      location: "Spokane, WA",
      description: "Handle accounts receivable and billing processes.",
      requirements: ["Accounting experience", "Excel proficiency"],
      payMin: 40000,
      payMax: 48000,
      payType: "salary",
      hoursType: "full-time",
      datePosted: new Date().toISOString(),
      source: "governmentjobs",
      sourceUrl: "https://governmentjobs.com/jobs/ar-clerk-finance-partners",
      category: "admin",
      remote: false,
    },
    status: "phone-screen",
    appliedDate: "2026-01-06",
    lastUpdated: "2026-01-07",
    notes: "Recruiter call scheduled for tomorrow",
  },
];

export function JobApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);

  const addApplication = useCallback((job: Job) => {
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      job,
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setApplications((prev) => [newApplication, ...prev]);
  }, []);

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: JobApplication["status"]) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status, lastUpdated: new Date().toISOString().split("T")[0] }
            : app
        )
      );
    },
    []
  );

  const setHiredData = useCallback((applicationId: string, hiredData: HiredData) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "hired" as const,
              hiredData,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : app
      )
    );
  }, []);

  const getApplicationByJobId = useCallback(
    (jobId: string) => applications.find((app) => app.jobId === jobId),
    [applications]
  );

  const isJobApplied = useCallback(
    (jobId: string) => applications.some((app) => app.jobId === jobId),
    [applications]
  );

  return (
    <JobApplicationsContext.Provider
      value={{
        applications,
        addApplication,
        updateApplicationStatus,
        setHiredData,
        getApplicationByJobId,
        isJobApplied,
      }}
    >
      {children}
    </JobApplicationsContext.Provider>
  );
}

export function useJobApplications() {
  const context = useContext(JobApplicationsContext);
  if (!context) {
    throw new Error("useJobApplications must be used within JobApplicationsProvider");
  }
  return context;
}
