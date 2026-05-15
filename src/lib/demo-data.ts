// Demo data for Career Forward platform
// This data will be replaced with real database data at GTM

// Action types for tracking job seeker activity
// Production: These would be logged via event tracking service and stored in user_actions table
export type ActionType =
  | "submitted_application"
  | "saved_job"
  | "browsed_jobs"
  | "updated_resume"
  | "downloaded_resume"
  | "updated_profile"
  | "completed_interview_module"
  | "watched_prep_video"
  | "started_interview_prep"
  | "completed_assessment"
  | "started_assessment"
  | "viewed_assessment_results"
  | "updated_application_status"
  | "added_job_to_tracker"
  | "logged_interview_notes"
  | "messaged_coach"
  | "read_coach_message"
  | "completed_task"
  | "viewed_task"
  | "viewed_resource"
  | "saved_resource"
  | "logged_in"
  | "viewed_dashboard";

export interface LastAction {
  type: ActionType;
  timestamp: Date;
  metadata?: {
    jobTitle?: string;
    companyName?: string;
    assessmentName?: string;
    moduleName?: string;
    resourceName?: string;
  };
}

// Helper to format relative time (e.g., "2h ago", "Yesterday", "5d ago")
export function formatActionTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// Helper to get human-readable action label
export function getActionLabel(type: ActionType): string {
  const labels: Record<ActionType, string> = {
    submitted_application: "Submitted Application",
    saved_job: "Saved Job Listing",
    browsed_jobs: "Browsed Job Board",
    updated_resume: "Updated Resume",
    downloaded_resume: "Downloaded Resume",
    updated_profile: "Updated Profile",
    completed_interview_module: "Completed Interview Module",
    watched_prep_video: "Watched Prep Video",
    started_interview_prep: "Started Interview Prep",
    completed_assessment: "Completed Assessment",
    started_assessment: "Started Assessment",
    viewed_assessment_results: "Viewed Assessment Results",
    updated_application_status: "Updated Application Status",
    added_job_to_tracker: "Added Job to Tracker",
    logged_interview_notes: "Logged Interview Notes",
    messaged_coach: "Messaged Coach",
    read_coach_message: "Read Coach Message",
    completed_task: "Completed Task",
    viewed_task: "Viewed Assigned Task",
    viewed_resource: "Viewed Resource",
    saved_resource: "Saved Resource",
    logged_in: "Logged In",
    viewed_dashboard: "Viewed Dashboard",
  };
  return labels[type] || type;
}

export interface DemoClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  age: number;
  phone: string;
  quirkyFact: {
    prompt: string;
    answer: string;
  };
  parseScore: number; // 0-100 based on resume completeness
  questProgress: number; // 0-100
  currentMilestone: string;
  completedMilestones: string[];
  stats: {
    applicationsSubmitted: number;
    interviewsScheduled: number;
    daysActive: number;
    loginStreak: number;
  };
  lastLogin: string;
  sessionDuration: string;
  isOnline: boolean;
  daysInactive: number;
  resume: {
    workExperience: number; // years
    jobCount: number;
    education: "high-school" | "some-college" | "associates" | "bachelors" | "masters" | "doctorate";
    skills: string[];
  };
  achievements: string[];
  goals: {
    current: string;
    progress: number;
    target: number;
  };
  notificationSettings: {
    emailOnMilestone: boolean;
    emailOnHired: boolean;
    inactivityAlertDays: 1 | 3 | 7 | null;
  };
  lastAction: LastAction;
}

export interface DemoCoach {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  organization: string;
  quirkyFact: {
    prompt: string;
    answer: string;
  };
  clientCount: number;
  maxClients: number;
}

export const quirkyFactPrompts = [
  "Pet's name",
  "Favorite animal",
  "Go-to karaoke song",
  "Coffee or tea?",
  "Dream vacation spot",
  "Hidden talent",
  "Favorite movie",
  "Comfort food",
];

export const milestones = [
  { id: "profile-complete", name: "Profile Complete", description: "Upload resume and fill profile" },
  { id: "resume-ready", name: "Resume Ready", description: "Build or polish resume in builder" },
  { id: "assessment-complete", name: "Assessment Complete", description: "Complete at least 1 career assessment" },
  { id: "first-application", name: "First Application", description: "Log first job application" },
  { id: "interview-prep", name: "Interview Ready", description: "Complete 1 interview prep module" },
  { id: "active-seeker", name: "Active Seeker", description: "5 applications logged" },
  { id: "interview-scheduled", name: "Interview Scheduled", description: "Log an interview" },
  { id: "offer-received", name: "Offer Received", description: "Receive a job offer" },
  { id: "quest-complete", name: "Quest Complete", description: "Employed!" },
];

export const achievements = [
  { id: "first-steps", name: "First Steps", emoji: "🚀", rarity: "common" },
  { id: "resume-builder", name: "Resume Builder", emoji: "📝", rarity: "common" },
  { id: "first-application", name: "First Application", emoji: "🎯", rarity: "common" },
  { id: "knowledge-seeker", name: "Knowledge Seeker", emoji: "📚", rarity: "common" },
  { id: "self-discovery", name: "Self Discovery", emoji: "🔍", rarity: "common" },
  { id: "persistent", name: "Persistent", emoji: "💪", rarity: "uncommon" },
  { id: "dedicated", name: "Dedicated", emoji: "🔥", rarity: "uncommon" },
  { id: "interview-ready", name: "Interview Ready", emoji: "🎤", rarity: "rare" },
  { id: "resume-master", name: "Resume Master", emoji: "✨", rarity: "rare" },
  { id: "connected", name: "Connected", emoji: "🤝", rarity: "uncommon" },
  { id: "interview-champion", name: "Interview Champion", emoji: "🏆", rarity: "epic" },
  { id: "quest-complete", name: "Quest Complete", emoji: "👑", rarity: "legendary" },
  { id: "diamond-hired", name: "Diamond Hired", emoji: "💎", rarity: "legendary" },
];

// Founder/Owner - Maliek Martin
export interface Founder {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  avatar: string;
  company: string;
}

export const founder: Founder = {
  id: "founder-1",
  firstName: "Maliek",
  lastName: "Martin",
  title: "Founder & CEO",
  email: "maliek@careerquest.io",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  company: "Career Forward",
};

// Demo coach
export const demoCoach: DemoCoach = {
  id: "coach-1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@careerservices.org",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  organization: "Career Services Center",
  quirkyFact: {
    prompt: "Pet's name",
    answer: "Luna (a very fluffy cat)",
  },
  clientCount: 10,
  maxClients: 25,
};

// 10 Demo clients with varied data
export const demoClients: DemoClient[] = [
  {
    id: "client-1",
    firstName: "Marcus",
    lastName: "Robinson",
    email: "marcus.r@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    age: 28,
    phone: "(509) 555-0101",
    quirkyFact: { prompt: "Hidden talent", answer: "Can solve a Rubik's cube in under 2 minutes" },
    parseScore: 85,
    questProgress: 75,
    currentMilestone: "active-seeker",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete", "first-application", "interview-prep"],
    stats: { applicationsSubmitted: 8, interviewsScheduled: 2, daysActive: 21, loginStreak: 5 },
    lastLogin: "2 hours ago",
    sessionDuration: "45 min",
    isOnline: true,
    daysInactive: 0,
    resume: { workExperience: 5, jobCount: 3, education: "bachelors", skills: ["Project Management", "Excel", "Customer Service", "Team Leadership"] },
    achievements: ["first-steps", "resume-builder", "first-application", "knowledge-seeker", "persistent"],
    goals: { current: "Apply to 10 jobs", progress: 8, target: 10 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 3 },
    lastAction: { type: "submitted_application", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), metadata: { jobTitle: "Project Coordinator", companyName: "Spokane Health Systems" } },
  },
  {
    id: "client-2",
    firstName: "Aisha",
    lastName: "Patel",
    email: "aisha.p@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    age: 24,
    phone: "(509) 555-0102",
    quirkyFact: { prompt: "Dream vacation spot", answer: "Northern Lights in Iceland" },
    parseScore: 72,
    questProgress: 60,
    currentMilestone: "interview-prep",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete", "first-application"],
    stats: { applicationsSubmitted: 5, interviewsScheduled: 1, daysActive: 14, loginStreak: 3 },
    lastLogin: "Yesterday",
    sessionDuration: "32 min",
    isOnline: false,
    daysInactive: 1,
    resume: { workExperience: 2, jobCount: 2, education: "bachelors", skills: ["Marketing", "Social Media", "Canva", "Content Writing"] },
    achievements: ["first-steps", "resume-builder", "first-application", "self-discovery"],
    goals: { current: "Complete interview modules", progress: 3, target: 6 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 3 },
    lastAction: { type: "completed_interview_module", timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), metadata: { moduleName: "Common Interview Questions" } },
  },
  {
    id: "client-3",
    firstName: "Tyler",
    lastName: "Chen",
    email: "tyler.c@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    age: 17,
    phone: "(509) 555-0103",
    quirkyFact: { prompt: "Go-to karaoke song", answer: "Don't Stop Believin' by Journey" },
    parseScore: 35,
    questProgress: 25,
    currentMilestone: "assessment-complete",
    completedMilestones: ["profile-complete"],
    stats: { applicationsSubmitted: 0, interviewsScheduled: 0, daysActive: 7, loginStreak: 2 },
    lastLogin: "3 hours ago",
    sessionDuration: "18 min",
    isOnline: true,
    daysInactive: 0,
    resume: { workExperience: 0, jobCount: 0, education: "high-school", skills: ["Microsoft Office", "Customer Service"] },
    achievements: ["first-steps"],
    goals: { current: "Complete 2 assessments", progress: 1, target: 2 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 1 },
    lastAction: { type: "started_assessment", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), metadata: { assessmentName: "O*NET Interest Profiler" } },
  },
  {
    id: "client-4",
    firstName: "Diana",
    lastName: "Okonkwo",
    email: "diana.o@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    age: 35,
    phone: "(509) 555-0104",
    quirkyFact: { prompt: "Comfort food", answer: "My grandmother's jollof rice" },
    parseScore: 92,
    questProgress: 90,
    currentMilestone: "offer-received",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete", "first-application", "interview-prep", "active-seeker", "interview-scheduled"],
    stats: { applicationsSubmitted: 15, interviewsScheduled: 4, daysActive: 45, loginStreak: 12 },
    lastLogin: "30 min ago",
    sessionDuration: "1 hr 5 min",
    isOnline: true,
    daysInactive: 0,
    resume: { workExperience: 10, jobCount: 4, education: "masters", skills: ["Healthcare Administration", "HIPAA Compliance", "Staff Management", "Budgeting", "EMR Systems"] },
    achievements: ["first-steps", "resume-builder", "first-application", "knowledge-seeker", "self-discovery", "persistent", "dedicated", "interview-ready", "interview-champion"],
    goals: { current: "Accept job offer", progress: 1, target: 1 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 7 },
    lastAction: { type: "messaged_coach", timestamp: new Date(Date.now() - 30 * 60 * 1000) },
  },
  {
    id: "client-5",
    firstName: "James",
    lastName: "Whitehorse",
    email: "james.w@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    age: 42,
    phone: "(509) 555-0105",
    quirkyFact: { prompt: "Favorite animal", answer: "Wolves - they remind me of home" },
    parseScore: 68,
    questProgress: 40,
    currentMilestone: "first-application",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete"],
    stats: { applicationsSubmitted: 2, interviewsScheduled: 0, daysActive: 10, loginStreak: 0 },
    lastLogin: "5 days ago",
    sessionDuration: "22 min",
    isOnline: false,
    daysInactive: 5,
    resume: { workExperience: 15, jobCount: 5, education: "some-college", skills: ["Construction", "Heavy Equipment", "OSHA Certified", "Team Supervision", "Blueprint Reading"] },
    achievements: ["first-steps", "resume-builder", "self-discovery"],
    goals: { current: "Apply to 5 jobs", progress: 2, target: 5 },
    notificationSettings: { emailOnMilestone: false, emailOnHired: true, inactivityAlertDays: 7 },
    lastAction: { type: "browsed_jobs", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  },
  {
    id: "client-6",
    firstName: "Emma",
    lastName: "Kowalski",
    email: "emma.k@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    age: 22,
    phone: "(509) 555-0106",
    quirkyFact: { prompt: "Coffee or tea?", answer: "Oat milk latte, extra shot" },
    parseScore: 55,
    questProgress: 35,
    currentMilestone: "resume-ready",
    completedMilestones: ["profile-complete", "assessment-complete"],
    stats: { applicationsSubmitted: 1, interviewsScheduled: 0, daysActive: 8, loginStreak: 1 },
    lastLogin: "Today",
    sessionDuration: "28 min",
    isOnline: false,
    daysInactive: 0,
    resume: { workExperience: 1, jobCount: 2, education: "associates", skills: ["Retail Sales", "Cash Handling", "Inventory Management"] },
    achievements: ["first-steps", "self-discovery"],
    goals: { current: "Build first resume", progress: 0, target: 1 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 3 },
    lastAction: { type: "updated_resume", timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  },
  {
    id: "client-7",
    firstName: "Darius",
    lastName: "Thompson",
    email: "darius.t@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    age: 31,
    phone: "(509) 555-0107",
    quirkyFact: { prompt: "Favorite movie", answer: "The Shawshank Redemption" },
    parseScore: 78,
    questProgress: 55,
    currentMilestone: "active-seeker",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete", "first-application"],
    stats: { applicationsSubmitted: 6, interviewsScheduled: 1, daysActive: 18, loginStreak: 4 },
    lastLogin: "1 hour ago",
    sessionDuration: "55 min",
    isOnline: true,
    daysInactive: 0,
    resume: { workExperience: 7, jobCount: 3, education: "bachelors", skills: ["Accounting", "QuickBooks", "Excel", "Financial Analysis", "Tax Preparation"] },
    achievements: ["first-steps", "resume-builder", "first-application", "knowledge-seeker", "persistent"],
    goals: { current: "Apply to 10 jobs", progress: 6, target: 10 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 3 },
    lastAction: { type: "added_job_to_tracker", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), metadata: { jobTitle: "Staff Accountant", companyName: "Northwest Financial" } },
  },
  {
    id: "client-8",
    firstName: "Sofia",
    lastName: "Martinez",
    email: "sofia.m@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    age: 19,
    phone: "(509) 555-0108",
    quirkyFact: { prompt: "Hidden talent", answer: "I can speak 3 languages fluently" },
    parseScore: 45,
    questProgress: 30,
    currentMilestone: "assessment-complete",
    completedMilestones: ["profile-complete"],
    stats: { applicationsSubmitted: 0, interviewsScheduled: 0, daysActive: 5, loginStreak: 1 },
    lastLogin: "Yesterday",
    sessionDuration: "15 min",
    isOnline: false,
    daysInactive: 1,
    resume: { workExperience: 0, jobCount: 1, education: "high-school", skills: ["Bilingual (Spanish)", "Customer Service", "Food Service"] },
    achievements: ["first-steps"],
    goals: { current: "Complete career assessment", progress: 0, target: 1 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 1 },
    lastAction: { type: "viewed_resource", timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), metadata: { resourceName: "Entry-Level Job Tips" } },
  },
  {
    id: "client-9",
    firstName: "Robert",
    lastName: "Kim",
    email: "robert.k@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    age: 38,
    phone: "(509) 555-0109",
    quirkyFact: { prompt: "Dream vacation spot", answer: "Backpacking through Japan" },
    parseScore: 88,
    questProgress: 70,
    currentMilestone: "interview-scheduled",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete", "first-application", "interview-prep", "active-seeker"],
    stats: { applicationsSubmitted: 12, interviewsScheduled: 3, daysActive: 30, loginStreak: 7 },
    lastLogin: "4 hours ago",
    sessionDuration: "40 min",
    isOnline: false,
    daysInactive: 0,
    resume: { workExperience: 12, jobCount: 4, education: "bachelors", skills: ["Software Development", "Python", "JavaScript", "AWS", "Agile/Scrum"] },
    achievements: ["first-steps", "resume-builder", "first-application", "knowledge-seeker", "self-discovery", "persistent", "dedicated", "interview-ready"],
    goals: { current: "Prepare for interview", progress: 2, target: 3 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 7 },
    lastAction: { type: "watched_prep_video", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), metadata: { moduleName: "STAR Method Explained" } },
  },
  {
    id: "client-10",
    firstName: "Keisha",
    lastName: "Brown",
    email: "keisha.b@careerquest.internal",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&h=150&fit=crop&crop=face",
    age: 26,
    phone: "(509) 555-0110",
    quirkyFact: { prompt: "Go-to karaoke song", answer: "Respect by Aretha Franklin" },
    parseScore: 65,
    questProgress: 45,
    currentMilestone: "interview-prep",
    completedMilestones: ["profile-complete", "resume-ready", "assessment-complete", "first-application"],
    stats: { applicationsSubmitted: 4, interviewsScheduled: 0, daysActive: 12, loginStreak: 0 },
    lastLogin: "8 days ago",
    sessionDuration: "35 min",
    isOnline: false,
    daysInactive: 8,
    resume: { workExperience: 3, jobCount: 2, education: "bachelors", skills: ["Nursing Assistant", "CPR Certified", "Patient Care", "Medical Terminology"] },
    achievements: ["first-steps", "resume-builder", "first-application", "self-discovery"],
    goals: { current: "Complete interview prep", progress: 1, target: 4 },
    notificationSettings: { emailOnMilestone: true, emailOnHired: true, inactivityAlertDays: 7 },
    lastAction: { type: "logged_in", timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
  },
];

// Helper function to get parse score recommendation
export function getRecommendedPath(parseScore: number, age: number): string[] {
  const isYouth = age < 18;

  if (parseScore < 40 || isYouth) {
    // Low score or youth: Start with assessments and resources
    return ["assessments", "resources", "resume-builder", "job-tracker"];
  } else if (parseScore < 70) {
    // Medium score: Balanced approach
    return ["resume-builder", "assessments", "interview-prep", "job-tracker"];
  } else {
    // High score: Ready for job search
    return ["resume-builder", "job-tracker", "interview-prep", "assessments"];
  }
}

// Helper function to get rarity color
export function getRarityColor(rarity: string): { bg: string; text: string; border: string } {
  switch (rarity) {
    case "common":
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    case "uncommon":
      return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
    case "rare":
      return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
    case "epic":
      return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" };
    case "legendary":
      return { bg: "bg-gradient-to-r from-yellow-100 to-orange-100", text: "text-yellow-700", border: "border-yellow-400" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
  }
}
