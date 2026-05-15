// Resume Builder Types

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zipCode: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  city: string;
  state: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
}

export interface ResumeData {
  contactInfo: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
}

export interface Resume {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  content: ResumeData;
  createdAt: Date;
  updatedAt: Date;
  isStarred?: boolean;
  // Version history
  parentId?: string; // If this is a tailored version, points to master resume
  versionNumber?: number;
  versionLabel?: string; // e.g., "Tailored for Google", "v2 with updated skills"
  targetJobTitle?: string;
  targetCompany?: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  content: ResumeData;
  templateId: string;
  versionNumber: number;
  versionLabel?: string;
  createdAt: Date;
  changeDescription?: string;
}

export interface TailoredResume {
  id: string;
  masterResumeId: string;
  name: string;
  targetJobTitle: string;
  targetCompany: string;
  jobDescription?: string;
  matchScore?: number;
  content: ResumeData;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateId = "modern" | "classic" | "professional" | "clean";

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
  preview: string;
  popular: boolean;
  category: "CHRONOLOGICAL" | "FUNCTIONAL" | "COMBINATION";
}

// Wizard steps
export type WizardStep =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "review";

export interface WizardStepConfig {
  id: WizardStep;
  label: string;
  description: string;
  required: boolean;
}

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: "contact",
    label: "Contact Info",
    description: "Your personal and contact information",
    required: true,
  },
  {
    id: "summary",
    label: "Summary",
    description: "A brief professional summary",
    required: false,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Your work history",
    required: true,
  },
  {
    id: "education",
    label: "Education",
    description: "Your educational background",
    required: true,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Your professional skills",
    required: true,
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Professional certifications (optional)",
    required: false,
  },
  {
    id: "review",
    label: "Review",
    description: "Review and finalize your resume",
    required: true,
  },
];

// Templates configuration
export const TEMPLATES: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Two-column header with accent colors. Great for most industries.",
    preview: "🎨",
    popular: true,
    category: "CHRONOLOGICAL",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout. Perfect for conservative industries.",
    preview: "📄",
    popular: false,
    category: "CHRONOLOGICAL",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Bold headers with blue accents. Ideal for corporate roles.",
    preview: "💼",
    popular: true,
    category: "CHRONOLOGICAL",
  },
  {
    id: "clean",
    name: "Clean",
    description: "Maximum whitespace, skills-first. Best for tech and creative roles.",
    preview: "✨",
    popular: true,
    category: "FUNCTIONAL",
  },
];

// Default empty resume data
export const DEFAULT_RESUME_DATA: ResumeData = {
  contactInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zipCode: "",
    linkedinUrl: "",
    portfolioUrl: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

// Helper function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
