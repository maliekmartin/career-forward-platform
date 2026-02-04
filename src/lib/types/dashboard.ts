// Dashboard types and utilities for premium dashboard customization

// ==================== Types ====================

export interface MetricConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface SectionConfig {
  id: string;
  visible: boolean;
  order: number;
}

export interface DashboardPreferences {
  metrics: MetricConfig[];
  sections: SectionConfig[];
  metricsLayout: "3x2" | "2x3";
  themeOverride: "light" | "dark" | null;
  updatedAt: string;
}

export type UserRole = "coach" | "job_seeker";

// ==================== Constants ====================

export const MAX_METRICS = 6;

// Coach-specific sections
export const COACH_SECTIONS: Record<string, { label: string; description: string }> = {
  caseload_overview: {
    label: "Caseload Overview",
    description: "Summary of your client caseload",
  },
  recent_activity: {
    label: "Recent Activity",
    description: "Recent client activities and updates",
  },
  upcoming_tasks: {
    label: "Upcoming Tasks",
    description: "Tasks that need attention",
  },
  client_progress: {
    label: "Client Progress",
    description: "Progress tracking for clients",
  },
  quick_actions: {
    label: "Quick Actions",
    description: "Common actions and shortcuts",
  },
  notifications: {
    label: "Notifications",
    description: "Recent notifications and alerts",
  },
};

// Job seeker-specific sections
export const JOB_SEEKER_SECTIONS: Record<string, { label: string; description: string }> = {
  career_score: {
    label: "Career Score",
    description: "Your Career Forward score breakdown",
  },
  pathway_progress: {
    label: "Pathway Progress",
    description: "Your 5-stage career journey progress",
  },
  job_applications: {
    label: "Job Applications",
    description: "Recent job applications and status",
  },
  upcoming_tasks: {
    label: "Upcoming Tasks",
    description: "Tasks to complete on your journey",
  },
  ai_insights: {
    label: "AI Insights",
    description: "Personalized AI-powered recommendations",
  },
  achievements: {
    label: "Achievements",
    description: "Badges and milestones earned",
  },
};

// Available metrics for coaches
export const COACH_METRICS: Record<string, { label: string; icon: string }> = {
  total_clients: { label: "Total Clients", icon: "users" },
  active_clients: { label: "Active Clients", icon: "user-check" },
  pending_connections: { label: "Pending Connections", icon: "user-plus" },
  messages_unread: { label: "Unread Messages", icon: "mail" },
  tasks_due: { label: "Tasks Due", icon: "list-todo" },
  completions_this_week: { label: "Completions This Week", icon: "check-circle" },
};

// Available metrics for job seekers
export const JOB_SEEKER_METRICS: Record<string, { label: string; icon: string }> = {
  career_score: { label: "Career Score", icon: "target" },
  resume_score: { label: "Resume Score", icon: "file-text" },
  applications_total: { label: "Total Applications", icon: "briefcase" },
  applications_active: { label: "Active Applications", icon: "send" },
  interviews_scheduled: { label: "Interviews", icon: "calendar" },
  pathway_completion: { label: "Pathway Progress", icon: "trending-up" },
};

// ==================== Functions ====================

/**
 * Get default dashboard preferences based on user role
 */
export function getDefaultDashboardPreferences(role: UserRole): DashboardPreferences {
  const isCoach = role === "coach";

  const defaultMetrics: MetricConfig[] = isCoach
    ? [
        { id: "total_clients", label: "Total Clients", visible: true, order: 0 },
        { id: "active_clients", label: "Active Clients", visible: true, order: 1 },
        { id: "pending_connections", label: "Pending Connections", visible: true, order: 2 },
        { id: "messages_unread", label: "Unread Messages", visible: true, order: 3 },
        { id: "tasks_due", label: "Tasks Due", visible: true, order: 4 },
        { id: "completions_this_week", label: "Completions This Week", visible: true, order: 5 },
      ]
    : [
        { id: "career_score", label: "Career Score", visible: true, order: 0 },
        { id: "resume_score", label: "Resume Score", visible: true, order: 1 },
        { id: "applications_total", label: "Total Applications", visible: true, order: 2 },
        { id: "applications_active", label: "Active Applications", visible: true, order: 3 },
        { id: "interviews_scheduled", label: "Interviews", visible: true, order: 4 },
        { id: "pathway_completion", label: "Pathway Progress", visible: true, order: 5 },
      ];

  const sections = isCoach ? COACH_SECTIONS : JOB_SEEKER_SECTIONS;
  const defaultSections: SectionConfig[] = Object.keys(sections).map((id, index) => ({
    id,
    visible: true,
    order: index,
  }));

  return {
    metrics: defaultMetrics,
    sections: defaultSections,
    metricsLayout: "3x2",
    themeOverride: null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Validate metric selection for a given role
 */
export function validateMetricSelection(
  metrics: MetricConfig[],
  role: UserRole
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validMetrics = role === "coach" ? COACH_METRICS : JOB_SEEKER_METRICS;
  const validMetricIds = Object.keys(validMetrics);

  // Check for invalid metric IDs
  for (const metric of metrics) {
    if (!validMetricIds.includes(metric.id)) {
      errors.push(`Invalid metric: ${metric.id}`);
    }
  }

  // Check for duplicates
  const metricIds = metrics.map((m) => m.id);
  const uniqueIds = new Set(metricIds);
  if (uniqueIds.size !== metricIds.length) {
    errors.push("Duplicate metrics are not allowed");
  }

  // Check metric count
  if (metrics.length > MAX_METRICS) {
    errors.push(`Maximum of ${MAX_METRICS} metrics allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate section selection for a given role
 */
export function validateSectionSelection(
  sections: SectionConfig[],
  role: UserRole
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validSections = role === "coach" ? COACH_SECTIONS : JOB_SEEKER_SECTIONS;
  const validSectionIds = Object.keys(validSections);

  // Check for invalid section IDs
  for (const section of sections) {
    if (!validSectionIds.includes(section.id)) {
      errors.push(`Invalid section: ${section.id}`);
    }
  }

  // Check for duplicates
  const sectionIds = sections.map((s) => s.id);
  const uniqueIds = new Set(sectionIds);
  if (uniqueIds.size !== sectionIds.length) {
    errors.push("Duplicate sections are not allowed");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
