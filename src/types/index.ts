// User types
export type Role = "CLIENT" | "COACH" | "ADMIN";
export type Gender = "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY";
export type CareerGoal = "SAME_INDUSTRY" | "NEW_INDUSTRY" | "CERTIFICATION";

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  emailVerified: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  gender: Gender | null;
  yearsInIndustry: number | null;
  currentIndustry: string | null;
  careerGoal: CareerGoal | null;
  profilePhotoUrl: string | null;
  preferredLanguage: string;
  profileCompleted: boolean;
  welcomeTourDone: boolean;
}

export interface UserWithProfile extends User {
  profile: Profile | null;
}

// Session types
export interface SessionUser {
  id: string;
  email: string;
  role: Role;
  profileCompleted: boolean;
  emailVerified: boolean;
}

// Resume types
export type TemplateCategory = "CHRONOLOGICAL" | "FUNCTIONAL" | "COMBINATION";

export interface ResumeContent {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: Certification[];
  customSections?: CustomSection[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string | "present";
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expires?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

// Job Application types
export type ApplicationPlatform =
  | "WORKSOURCEWA"
  | "INDEED"
  | "LINKEDIN"
  | "COMPANY_WEBSITE"
  | "REFERRAL"
  | "JOB_FAIR"
  | "OTHER";

export type ApplicationStatus = "GREEN" | "YELLOW" | "RED";

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string | null;
  industry: string | null;
  platform: ApplicationPlatform;
  appliedDate: Date;
  alignmentScore: number | null;
  status: ApplicationStatus;
  notes: string | null;
  isArchived: boolean;
}

// Progress types
export interface CareerForwardStage {
  stage: number;
  title: string;
  description: string;
  items: ProgressItem[];
}

export interface ProgressItem {
  key: string;
  label: string;
  completed: boolean;
  completedAt?: Date;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success?: boolean;
  error?: boolean;
  code?: string;
  message?: string;
  data?: T;
  details?: Record<string, string[]>;
}
