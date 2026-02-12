// Dashboard Customization Types - Premium Feature
// These types define the structure for customizable dashboard preferences

// ==================== METRIC DEFINITIONS ====================

export type CoachMetricId =
  | 'active_clients'
  | 'tasks_due_today'
  | 'unread_messages'
  | 'placements_this_month'
  | 'interviews_scheduled'
  | 'new_clients_week'
  | 'clients_needing_attention'
  | 'pending_reviews'
  | 'client_success_rate'
  | 'avg_days_to_placement';

export type JobSeekerMetricId =
  | 'career_score'
  | 'applications_sent'
  | 'interviews_scheduled'
  | 'tasks_to_complete'
  | 'quest_progress'
  | 'profile_completion'
  | 'days_active_streak'
  | 'saved_jobs_count'
  | 'resume_views'
  | 'recommendations_pending';

export interface MetricDefinition {
  id: string;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  gradient: {
    from: string;
    to: string;
  };
  valueType: 'number' | 'percentage' | 'days';
  defaultValue?: number;
}

// ==================== COACH METRICS ====================

export const COACH_METRICS: Record<CoachMetricId, MetricDefinition> = {
  active_clients: {
    id: 'active_clients',
    label: 'Active Clients',
    description: 'Total number of active job seekers in your caseload',
    icon: 'Users',
    color: 'teal',
    gradient: { from: '#2B8A8A', to: '#38A169' },
    valueType: 'number',
  },
  tasks_due_today: {
    id: 'tasks_due_today',
    label: 'Tasks Due Today',
    description: 'Tasks that need to be completed today',
    icon: 'CheckCircle',
    color: 'amber',
    gradient: { from: '#D69E2E', to: '#DD6B20' },
    valueType: 'number',
  },
  unread_messages: {
    id: 'unread_messages',
    label: 'Unread Messages',
    description: 'Messages awaiting your response',
    icon: 'MessageSquare',
    color: 'blue',
    gradient: { from: '#3182CE', to: '#2B6CB0' },
    valueType: 'number',
  },
  placements_this_month: {
    id: 'placements_this_month',
    label: 'Placements This Month',
    description: 'Job seekers successfully placed this month',
    icon: 'Trophy',
    color: 'emerald',
    gradient: { from: '#38A169', to: '#2F855A' },
    valueType: 'number',
  },
  interviews_scheduled: {
    id: 'interviews_scheduled',
    label: 'Interviews Scheduled',
    description: 'Upcoming interviews for your clients',
    icon: 'Calendar',
    color: 'purple',
    gradient: { from: '#805AD5', to: '#6B46C1' },
    valueType: 'number',
  },
  new_clients_week: {
    id: 'new_clients_week',
    label: 'New Clients This Week',
    description: 'Job seekers added to your caseload this week',
    icon: 'UserPlus',
    color: 'cyan',
    gradient: { from: '#0BC5EA', to: '#00B5D8' },
    valueType: 'number',
  },
  clients_needing_attention: {
    id: 'clients_needing_attention',
    label: 'Needs Attention',
    description: 'Clients who may need additional support',
    icon: 'AlertTriangle',
    color: 'orange',
    gradient: { from: '#ED8936', to: '#DD6B20' },
    valueType: 'number',
  },
  pending_reviews: {
    id: 'pending_reviews',
    label: 'Pending Reviews',
    description: 'Resumes and documents awaiting your review',
    icon: 'FileText',
    color: 'pink',
    gradient: { from: '#ED64A6', to: '#D53F8C' },
    valueType: 'number',
  },
  client_success_rate: {
    id: 'client_success_rate',
    label: 'Success Rate',
    description: 'Percentage of clients successfully placed',
    icon: 'TrendingUp',
    color: 'green',
    gradient: { from: '#48BB78', to: '#38A169' },
    valueType: 'percentage',
  },
  avg_days_to_placement: {
    id: 'avg_days_to_placement',
    label: 'Avg. Days to Placement',
    description: 'Average time to place a job seeker',
    icon: 'Clock',
    color: 'indigo',
    gradient: { from: '#667EEA', to: '#5A67D8' },
    valueType: 'days',
  },
};

// ==================== JOB SEEKER METRICS ====================

export const JOB_SEEKER_METRICS: Record<JobSeekerMetricId, MetricDefinition> = {
  career_score: {
    id: 'career_score',
    label: 'Career Score',
    description: 'Your overall career readiness score',
    icon: 'Sparkles',
    color: 'teal',
    gradient: { from: '#2B8A8A', to: '#38A169' },
    valueType: 'number',
  },
  applications_sent: {
    id: 'applications_sent',
    label: 'Applications Sent',
    description: 'Total job applications submitted',
    icon: 'Send',
    color: 'blue',
    gradient: { from: '#3182CE', to: '#2B6CB0' },
    valueType: 'number',
  },
  interviews_scheduled: {
    id: 'interviews_scheduled',
    label: 'Interviews Scheduled',
    description: 'Upcoming interview appointments',
    icon: 'Calendar',
    color: 'purple',
    gradient: { from: '#805AD5', to: '#6B46C1' },
    valueType: 'number',
  },
  tasks_to_complete: {
    id: 'tasks_to_complete',
    label: 'Tasks To Do',
    description: 'Pending tasks from your coach',
    icon: 'CheckCircle',
    color: 'amber',
    gradient: { from: '#D69E2E', to: '#DD6B20' },
    valueType: 'number',
  },
  quest_progress: {
    id: 'quest_progress',
    label: 'Quest Progress',
    description: 'Your career quest completion percentage',
    icon: 'Target',
    color: 'emerald',
    gradient: { from: '#38A169', to: '#2F855A' },
    valueType: 'percentage',
  },
  profile_completion: {
    id: 'profile_completion',
    label: 'Profile Completion',
    description: 'How complete your profile is',
    icon: 'User',
    color: 'cyan',
    gradient: { from: '#0BC5EA', to: '#00B5D8' },
    valueType: 'percentage',
  },
  days_active_streak: {
    id: 'days_active_streak',
    label: 'Active Streak',
    description: 'Days in a row you\'ve been active',
    icon: 'Flame',
    color: 'orange',
    gradient: { from: '#ED8936', to: '#DD6B20' },
    valueType: 'days',
  },
  saved_jobs_count: {
    id: 'saved_jobs_count',
    label: 'Saved Jobs',
    description: 'Jobs you\'ve saved for later',
    icon: 'Bookmark',
    color: 'pink',
    gradient: { from: '#ED64A6', to: '#D53F8C' },
    valueType: 'number',
  },
  resume_views: {
    id: 'resume_views',
    label: 'Resume Views',
    description: 'Times your resume has been viewed',
    icon: 'Eye',
    color: 'indigo',
    gradient: { from: '#667EEA', to: '#5A67D8' },
    valueType: 'number',
  },
  recommendations_pending: {
    id: 'recommendations_pending',
    label: 'Recommendations',
    description: 'Pending recommendations from your coach',
    icon: 'Lightbulb',
    color: 'yellow',
    gradient: { from: '#ECC94B', to: '#D69E2E' },
    valueType: 'number',
  },
};

// ==================== SECTION DEFINITIONS ====================

export type CoachSectionId =
  | 'stat_cards'
  | 'todays_schedule'
  | 'caseload_list'
  | 'activity_feed'
  | 'tasks'
  | 'quick_actions';

export type JobSeekerSectionId =
  | 'stat_cards'
  | 'quest_progress'
  | 'recent_applications'
  | 'calendar_events'
  | 'recommendations'
  | 'quick_links';

export interface SectionDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  defaultOrder: number;
  minHeight?: string;
}

export const COACH_SECTIONS: Record<CoachSectionId, SectionDefinition> = {
  stat_cards: {
    id: 'stat_cards',
    label: 'Stat Cards',
    description: 'Key metrics at a glance',
    icon: 'BarChart3',
    defaultOrder: 0,
  },
  todays_schedule: {
    id: 'todays_schedule',
    label: "Today's Schedule",
    description: 'Your appointments and meetings',
    icon: 'Calendar',
    defaultOrder: 1,
  },
  caseload_list: {
    id: 'caseload_list',
    label: 'Caseload',
    description: 'Your active job seekers',
    icon: 'Users',
    defaultOrder: 2,
  },
  activity_feed: {
    id: 'activity_feed',
    label: 'Activity Feed',
    description: 'Recent client activity',
    icon: 'Activity',
    defaultOrder: 3,
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    description: 'Your pending tasks',
    icon: 'CheckSquare',
    defaultOrder: 4,
  },
  quick_actions: {
    id: 'quick_actions',
    label: 'Quick Actions',
    description: 'Frequently used actions',
    icon: 'Zap',
    defaultOrder: 5,
  },
};

export const JOB_SEEKER_SECTIONS: Record<JobSeekerSectionId, SectionDefinition> = {
  stat_cards: {
    id: 'stat_cards',
    label: 'Stat Cards',
    description: 'Your key metrics',
    icon: 'BarChart3',
    defaultOrder: 0,
  },
  quest_progress: {
    id: 'quest_progress',
    label: 'Quest Progress',
    description: 'Your career journey stages',
    icon: 'Map',
    defaultOrder: 1,
  },
  recent_applications: {
    id: 'recent_applications',
    label: 'Recent Applications',
    description: 'Your latest job applications',
    icon: 'Briefcase',
    defaultOrder: 2,
  },
  calendar_events: {
    id: 'calendar_events',
    label: 'Upcoming Events',
    description: 'Interviews and appointments',
    icon: 'Calendar',
    defaultOrder: 3,
  },
  recommendations: {
    id: 'recommendations',
    label: 'Recommendations',
    description: 'Suggestions from your coach',
    icon: 'Lightbulb',
    defaultOrder: 4,
  },
  quick_links: {
    id: 'quick_links',
    label: 'Quick Links',
    description: 'Fast access to tools',
    icon: 'Link',
    defaultOrder: 5,
  },
};

// ==================== DASHBOARD PREFERENCES ====================

export interface SectionPreference {
  id: string;
  visible: boolean;
  order: number;
}

export interface DashboardPreferences {
  // Selected metrics (max 6)
  metrics: string[];
  // Section order and visibility
  sections: SectionPreference[];
  // Layout preferences
  metricsLayout: '3x2' | '2x3';
  // Theme override (null = use system)
  themeOverride: 'light' | 'dark' | null;
  // Last updated timestamp
  updatedAt: string;
}

// ==================== DEFAULTS ====================

export const DEFAULT_COACH_METRICS: CoachMetricId[] = [
  'active_clients',
  'tasks_due_today',
  'unread_messages',
  'placements_this_month',
  'interviews_scheduled',
  'clients_needing_attention',
];

export const DEFAULT_JOB_SEEKER_METRICS: JobSeekerMetricId[] = [
  'career_score',
  'applications_sent',
  'interviews_scheduled',
  'tasks_to_complete',
  'quest_progress',
  'profile_completion',
];

export const DEFAULT_COACH_SECTIONS: SectionPreference[] = [
  { id: 'stat_cards', visible: true, order: 0 },
  { id: 'todays_schedule', visible: true, order: 1 },
  { id: 'caseload_list', visible: true, order: 2 },
  { id: 'activity_feed', visible: true, order: 3 },
  { id: 'tasks', visible: true, order: 4 },
  { id: 'quick_actions', visible: true, order: 5 },
];

export const DEFAULT_JOB_SEEKER_SECTIONS: SectionPreference[] = [
  { id: 'stat_cards', visible: true, order: 0 },
  { id: 'quest_progress', visible: true, order: 1 },
  { id: 'recent_applications', visible: true, order: 2 },
  { id: 'calendar_events', visible: true, order: 3 },
  { id: 'recommendations', visible: true, order: 4 },
  { id: 'quick_links', visible: true, order: 5 },
];

export const getDefaultDashboardPreferences = (role: 'coach' | 'job_seeker'): DashboardPreferences => ({
  metrics: role === 'coach' ? DEFAULT_COACH_METRICS : DEFAULT_JOB_SEEKER_METRICS,
  sections: role === 'coach' ? DEFAULT_COACH_SECTIONS : DEFAULT_JOB_SEEKER_SECTIONS,
  metricsLayout: '3x2',
  themeOverride: null,
  updatedAt: new Date().toISOString(),
});

// ==================== UTILITY FUNCTIONS ====================

export const MAX_METRICS = 6;

export const validateMetricSelection = (
  metrics: string[],
  role: 'coach' | 'job_seeker'
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const validMetrics = role === 'coach' ? Object.keys(COACH_METRICS) : Object.keys(JOB_SEEKER_METRICS);

  if (metrics.length > MAX_METRICS) {
    errors.push(`Maximum of ${MAX_METRICS} metrics allowed`);
  }

  const invalidMetrics = metrics.filter(m => !validMetrics.includes(m));
  if (invalidMetrics.length > 0) {
    errors.push(`Invalid metrics: ${invalidMetrics.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
};

export const reorderSections = (
  sections: SectionPreference[],
  sourceIndex: number,
  destinationIndex: number
): SectionPreference[] => {
  const result = [...sections];
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);

  // Update order values
  return result.map((section, index) => ({
    ...section,
    order: index,
  }));
};

export const toggleSectionVisibility = (
  sections: SectionPreference[],
  sectionId: string
): SectionPreference[] => {
  return sections.map(section =>
    section.id === sectionId
      ? { ...section, visible: !section.visible }
      : section
  );
};
