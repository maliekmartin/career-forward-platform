"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Pencil,
  Plus,
  Eye,
  ChevronRight,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  List,
  BookOpen,
  CheckCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { ResumeData, WizardStep, WIZARD_STEPS } from "./types/resume-types";

// Types
export type GuidedMode = "beginner" | "expert";

export type GuidedAction =
  | { type: "edit-section"; section: WizardStep; mode: GuidedMode }
  | { type: "full-wizard"; mode: GuidedMode }
  | { type: "create-new"; cloneExisting: boolean }
  | { type: "browse" }
  | { type: "dismiss" };

interface GuidedResumeFlowProps {
  resume: {
    id: string;
    name: string;
    templateId: string;
    content: ResumeData;
    updatedAt: string;
  };
  userExperienceLevel: GuidedMode | null;
  onComplete: (action: GuidedAction) => void;
  onDismiss: () => void;
  onSaveExperienceLevel: (level: GuidedMode) => void;
}

type FlowStep = "preview" | "intent" | "experience-level" | "section-select" | "new-resume-options";

// Section icons mapping
const SECTION_ICONS: Record<WizardStep, React.ElementType> = {
  contact: User,
  summary: BookOpen,
  experience: Briefcase,
  education: GraduationCap,
  skills: List,
  certifications: Award,
  review: CheckCircle,
};

// Section explanations for beginner mode
export const SECTION_EXPLANATIONS: Record<WizardStep, string> = {
  contact: "Your contact information is the first thing employers see. Make sure it's professional and up-to-date so they can easily reach you.",
  summary: "A strong summary gives employers a quick snapshot of who you are and what you bring to the table. Think of it as your elevator pitch.",
  experience: "Your work experience shows employers what you've accomplished. Focus on achievements and results, not just duties.",
  education: "List your educational background. Include degrees, certifications, and relevant coursework that applies to your target job.",
  skills: "Skills help employers quickly see if you're a good fit. Include both technical skills and soft skills relevant to the job.",
  certifications: "Professional certifications add credibility and show your commitment to your field. Include any relevant licenses too.",
  review: "Take a final look at your resume. Check for typos, consistency, and make sure everything looks polished and professional.",
};

export function GuidedResumeFlow({
  resume,
  userExperienceLevel,
  onComplete,
  onDismiss,
  onSaveExperienceLevel,
}: GuidedResumeFlowProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [currentFlowStep, setCurrentFlowStep] = useState<FlowStep>("preview");
  const [selectedIntent, setSelectedIntent] = useState<"update" | "new" | "browse" | null>(null);
  const [selectedMode, setSelectedMode] = useState<GuidedMode | null>(userExperienceLevel);
  const [savePreference, setSavePreference] = useState(true);

  // Calculate resume stats for preview
  const resumeStats = {
    experienceCount: resume.content?.experience?.length || 0,
    educationCount: resume.content?.education?.length || 0,
    skillsCount: resume.content?.skills?.length || 0,
    certificationsCount: resume.content?.certifications?.length || 0,
    hasSummary: !!resume.content?.summary && resume.content.summary.length > 0,
    hasContact: !!(resume.content?.contactInfo?.firstName && resume.content?.contactInfo?.email),
  };

  const completedSections = [
    resumeStats.hasContact,
    resumeStats.hasSummary,
    resumeStats.experienceCount > 0,
    resumeStats.educationCount > 0,
    resumeStats.skillsCount > 0,
  ].filter(Boolean).length;

  const handleContinue = () => {
    if (currentFlowStep === "preview") {
      setCurrentFlowStep("intent");
    } else if (currentFlowStep === "intent") {
      if (selectedIntent === "browse") {
        onComplete({ type: "browse" });
      } else if (selectedIntent === "new") {
        setCurrentFlowStep("new-resume-options");
      } else if (selectedIntent === "update") {
        // If we already have experience level saved, go to section select (expert) or wizard (beginner)
        if (userExperienceLevel) {
          if (userExperienceLevel === "expert") {
            setCurrentFlowStep("section-select");
          } else {
            onComplete({ type: "full-wizard", mode: "beginner" });
          }
        } else {
          setCurrentFlowStep("experience-level");
        }
      }
    } else if (currentFlowStep === "experience-level") {
      if (selectedMode) {
        // Save preference if checkbox is checked
        if (savePreference) {
          onSaveExperienceLevel(selectedMode);
        }

        if (selectedMode === "expert") {
          setCurrentFlowStep("section-select");
        } else {
          onComplete({ type: "full-wizard", mode: "beginner" });
        }
      }
    }
  };

  const handleSectionSelect = (section: WizardStep) => {
    onComplete({
      type: "edit-section",
      section,
      mode: selectedMode || userExperienceLevel || "expert"
    });
  };

  const handleNewResumeOption = (cloneExisting: boolean) => {
    onComplete({ type: "create-new", cloneExisting });
  };

  // Render resume thumbnail preview
  const renderResumeThumbnail = () => {
    const contact = resume.content?.contactInfo;
    const name = contact?.firstName && contact?.lastName
      ? `${contact.firstName} ${contact.lastName}`
      : resume.name;

    return (
      <div
        className={cn(
          "aspect-[8.5/11] rounded-lg shadow-lg overflow-hidden relative",
          isDark ? "bg-white" : "bg-white"
        )}
        style={{ maxWidth: "200px" }}
      >
        {/* Mini resume preview */}
        <div className="p-3 text-[6px] text-gray-800 leading-tight">
          {/* Header */}
          <div className="text-center mb-2 border-b border-gray-200 pb-2">
            <div className="font-bold text-[8px] truncate">{name}</div>
            {contact?.email && (
              <div className="text-gray-500 truncate">{contact.email}</div>
            )}
          </div>

          {/* Summary placeholder */}
          {resumeStats.hasSummary && (
            <div className="mb-2">
              <div className="bg-gray-100 h-1 w-full rounded mb-0.5" />
              <div className="bg-gray-100 h-1 w-4/5 rounded" />
            </div>
          )}

          {/* Experience placeholder */}
          {resumeStats.experienceCount > 0 && (
            <div className="mb-2">
              <div className="font-bold text-[7px] mb-1">Experience</div>
              {Array.from({ length: Math.min(resumeStats.experienceCount, 2) }).map((_, i) => (
                <div key={i} className="mb-1">
                  <div className="bg-gray-200 h-1 w-3/4 rounded mb-0.5" />
                  <div className="bg-gray-100 h-1 w-full rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Skills placeholder */}
          {resumeStats.skillsCount > 0 && (
            <div className="mb-2">
              <div className="font-bold text-[7px] mb-1">Skills</div>
              <div className="flex flex-wrap gap-0.5">
                {Array.from({ length: Math.min(resumeStats.skillsCount, 4) }).map((_, i) => (
                  <div key={i} className="bg-teal-100 h-1.5 w-6 rounded" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden",
          isDark ? "bg-gray-900" : "bg-white"
        )}
      >
        {/* Progress indicator */}
        <div className={cn("h-1", isDark ? "bg-gray-800" : "bg-gray-100")}>
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
            initial={{ width: "20%" }}
            animate={{
              width: currentFlowStep === "preview" ? "20%" :
                     currentFlowStep === "intent" ? "40%" :
                     currentFlowStep === "experience-level" ? "60%" :
                     currentFlowStep === "section-select" ? "80%" :
                     currentFlowStep === "new-resume-options" ? "80%" : "100%"
            }}
          />
        </div>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Preview */}
            {currentFlowStep === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-[#0F172A]")}>
                    Here&apos;s your current resume
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    {resume.name} - Last updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                  {/* Resume thumbnail */}
                  <div className="flex-shrink-0">
                    {renderResumeThumbnail()}
                  </div>

                  {/* Resume stats */}
                  <div className="flex-1 space-y-3 max-w-xs">
                    <div className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                      Resume Completion
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn("flex-1 h-2 rounded-full", isDark ? "bg-gray-800" : "bg-gray-100")}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                          style={{ width: `${(completedSections / 5) * 100}%` }}
                        />
                      </div>
                      <span className={cn("text-sm font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
                        {completedSections}/5
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <StatBadge icon={Briefcase} label="Experience" count={resumeStats.experienceCount} isDark={isDark} />
                      <StatBadge icon={GraduationCap} label="Education" count={resumeStats.educationCount} isDark={isDark} />
                      <StatBadge icon={List} label="Skills" count={resumeStats.skillsCount} isDark={isDark} />
                      <StatBadge icon={Award} label="Certs" count={resumeStats.certificationsCount} isDark={isDark} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleContinue}
                    className={cn(
                      "px-8 py-3 rounded-xl text-base",
                      isDark
                        ? "bg-teal-500 hover:bg-teal-400 text-[#0F172A]"
                        : "bg-teal-600 hover:bg-teal-500 text-white"
                    )}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Intent Selection */}
            {currentFlowStep === "intent" && (
              <motion.div
                key="intent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-[#0F172A]")}>
                    What would you like to do?
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    Choose how you&apos;d like to work on your resume today
                  </p>
                </div>

                <div className="grid gap-4">
                  <IntentOption
                    icon={Pencil}
                    title="Update my resume"
                    description="Make changes to improve or update your existing resume"
                    selected={selectedIntent === "update"}
                    onClick={() => setSelectedIntent("update")}
                    isDark={isDark}
                    recommended
                  />
                  <IntentOption
                    icon={Plus}
                    title="Create a new resume"
                    description="Start fresh or create a version tailored for a specific job"
                    selected={selectedIntent === "new"}
                    onClick={() => setSelectedIntent("new")}
                    isDark={isDark}
                  />
                  <IntentOption
                    icon={Eye}
                    title="Just browse"
                    description="View templates and explore options without making changes"
                    selected={selectedIntent === "browse"}
                    onClick={() => setSelectedIntent("browse")}
                    isDark={isDark}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentFlowStep("preview")}
                    className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#0F172A]"}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedIntent}
                    className={cn(
                      "px-8 rounded-xl",
                      isDark
                        ? "bg-teal-500 hover:bg-teal-400 text-[#0F172A] disabled:bg-gray-700 disabled:text-gray-500"
                        : "bg-teal-600 hover:bg-teal-500 text-white disabled:bg-gray-200 disabled:text-gray-400"
                    )}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Experience Level Selection */}
            {currentFlowStep === "experience-level" && (
              <motion.div
                key="experience-level"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-[#0F172A]")}>
                    What&apos;s your experience with resume building?
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    We&apos;ll customize the experience based on your comfort level
                  </p>
                </div>

                <div className="grid gap-4">
                  <ExperienceOption
                    icon={Sparkles}
                    title="I'm new to this"
                    description="Guide me step by step with tips, examples, and AI suggestions"
                    mode="beginner"
                    selected={selectedMode === "beginner"}
                    onClick={() => setSelectedMode("beginner")}
                    isDark={isDark}
                  />
                  <ExperienceOption
                    icon={Briefcase}
                    title="I know what I'm doing"
                    description="Let me jump directly to the sections I want to edit"
                    mode="expert"
                    selected={selectedMode === "expert"}
                    onClick={() => setSelectedMode("expert")}
                    isDark={isDark}
                  />
                </div>

                {/* Save preference checkbox */}
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                  <input
                    type="checkbox"
                    checked={savePreference}
                    onChange={(e) => setSavePreference(e.target.checked)}
                    className={cn(
                      "w-4 h-4 rounded border-2 cursor-pointer",
                      isDark ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                    )}
                  />
                  <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    Remember my preference for next time
                  </span>
                </label>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentFlowStep("intent")}
                    className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#0F172A]"}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={!selectedMode}
                    className={cn(
                      "px-8 rounded-xl",
                      isDark
                        ? "bg-teal-500 hover:bg-teal-400 text-[#0F172A] disabled:bg-gray-700 disabled:text-gray-500"
                        : "bg-teal-600 hover:bg-teal-500 text-white disabled:bg-gray-200 disabled:text-gray-400"
                    )}
                  >
                    {selectedMode === "beginner" ? "Start Guided Experience" : "Continue"}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Section Selection (Expert Mode) */}
            {currentFlowStep === "section-select" && (
              <motion.div
                key="section-select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-[#0F172A]")}>
                    Which section would you like to edit?
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    Jump directly to any section of your resume
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {WIZARD_STEPS.filter(step => step.id !== "review").map((step) => {
                    const Icon = SECTION_ICONS[step.id];
                    const hasContent =
                      step.id === "contact" ? resumeStats.hasContact :
                      step.id === "summary" ? resumeStats.hasSummary :
                      step.id === "experience" ? resumeStats.experienceCount > 0 :
                      step.id === "education" ? resumeStats.educationCount > 0 :
                      step.id === "skills" ? resumeStats.skillsCount > 0 :
                      step.id === "certifications" ? resumeStats.certificationsCount > 0 :
                      false;

                    return (
                      <button
                        key={step.id}
                        onClick={() => handleSectionSelect(step.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all text-left group hover:scale-[1.02]",
                          isDark
                            ? "border-gray-700 hover:border-teal-500 bg-gray-800/50 hover:bg-gray-800"
                            : "border-gray-200 hover:border-teal-500 bg-white hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isDark ? "bg-gray-700 group-hover:bg-teal-500/20" : "bg-gray-100 group-hover:bg-teal-50"
                          )}>
                            <Icon className={cn(
                              "w-5 h-5",
                              isDark ? "text-gray-400 group-hover:text-teal-400" : "text-gray-500 group-hover:text-teal-600"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn("font-medium text-sm", isDark ? "text-white" : "text-[#0F172A]")}>
                              {step.label}
                            </div>
                            {hasContent && (
                              <div className={cn("text-xs mt-0.5", isDark ? "text-teal-400" : "text-teal-600")}>
                                Has content
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Full review option */}
                <div className="pt-2">
                  <button
                    onClick={() => onComplete({ type: "full-wizard", mode: "expert" })}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 border-dashed transition-all text-center",
                      isDark
                        ? "border-gray-700 hover:border-teal-500 text-gray-400 hover:text-teal-400"
                        : "border-gray-300 hover:border-teal-500 text-gray-500 hover:text-teal-600"
                    )}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-sm font-medium">Go through all sections</span>
                  </button>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (userExperienceLevel) {
                        setCurrentFlowStep("intent");
                      } else {
                        setCurrentFlowStep("experience-level");
                      }
                    }}
                    className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#0F172A]"}
                  >
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onDismiss}
                    className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#0F172A]"}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: New Resume Options */}
            {currentFlowStep === "new-resume-options" && (
              <motion.div
                key="new-resume-options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-[#0F172A]")}>
                    How would you like to start?
                  </h2>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                    Choose how to create your new resume
                  </p>
                </div>

                <div className="grid gap-4">
                  <IntentOption
                    icon={Copy}
                    title="Copy my existing resume"
                    description="Start with a copy of your current resume and make changes"
                    selected={false}
                    onClick={() => handleNewResumeOption(true)}
                    isDark={isDark}
                    recommended
                  />
                  <IntentOption
                    icon={Plus}
                    title="Start from scratch"
                    description="Begin with a blank template and build from the ground up"
                    selected={false}
                    onClick={() => handleNewResumeOption(false)}
                    isDark={isDark}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentFlowStep("intent")}
                    className={isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-[#0F172A]"}
                  >
                    Back
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skip link */}
        <div className={cn("px-6 pb-4 text-center", isDark ? "text-gray-500" : "text-gray-400")}>
          <button
            onClick={onDismiss}
            className="text-sm hover:underline"
          >
            Skip and go to full view
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper components
function StatBadge({
  icon: Icon,
  label,
  count,
  isDark
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  isDark: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg",
      isDark ? "bg-gray-800" : "bg-gray-100"
    )}>
      <Icon className={cn("w-4 h-4", isDark ? "text-gray-500" : "text-gray-400")} />
      <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
        {count} {label}
      </span>
    </div>
  );
}

function IntentOption({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  isDark,
  recommended,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all text-left relative group",
        selected
          ? isDark
            ? "border-teal-500 bg-teal-500/10"
            : "border-teal-500 bg-teal-50"
          : isDark
            ? "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            : "border-gray-200 hover:border-gray-300 bg-white"
      )}
    >
      {recommended && (
        <span className={cn(
          "absolute -top-2 right-4 text-xs px-2 py-0.5 rounded-full",
          isDark ? "bg-teal-500 text-[#0F172A]" : "bg-teal-500 text-white"
        )}>
          Recommended
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          selected
            ? isDark ? "bg-teal-500/20" : "bg-teal-100"
            : isDark ? "bg-gray-700" : "bg-gray-100"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            selected
              ? isDark ? "text-teal-400" : "text-teal-600"
              : isDark ? "text-gray-400" : "text-gray-500"
          )} />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold mb-1",
            isDark ? "text-white" : "text-[#0F172A]"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {description}
          </p>
        </div>
        {selected && (
          <CheckCircle className={cn(
            "w-5 h-5 flex-shrink-0",
            isDark ? "text-teal-400" : "text-teal-500"
          )} />
        )}
      </div>
    </button>
  );
}

function ExperienceOption({
  icon: Icon,
  title,
  description,
  mode,
  selected,
  onClick,
  isDark,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  mode: GuidedMode;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-xl border-2 transition-all text-left group",
        selected
          ? isDark
            ? "border-teal-500 bg-teal-500/10"
            : "border-teal-500 bg-teal-50"
          : isDark
            ? "border-gray-700 hover:border-gray-600 bg-gray-800/50"
            : "border-gray-200 hover:border-gray-300 bg-white"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          selected
            ? isDark ? "bg-teal-500/20" : "bg-teal-100"
            : isDark ? "bg-gray-700 group-hover:bg-gray-600" : "bg-gray-100 group-hover:bg-gray-200"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            selected
              ? isDark ? "text-teal-400" : "text-teal-600"
              : isDark ? "text-gray-400" : "text-gray-500"
          )} />
        </div>
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold mb-1",
            isDark ? "text-white" : "text-[#0F172A]"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {description}
          </p>
          {mode === "beginner" && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs",
              isDark ? "text-teal-400" : "text-teal-600"
            )}>
              <Sparkles className="w-3 h-3" />
              <span>Includes AI-powered suggestions</span>
            </div>
          )}
        </div>
        {selected && (
          <CheckCircle className={cn(
            "w-5 h-5 flex-shrink-0",
            isDark ? "text-teal-400" : "text-teal-500"
          )} />
        )}
      </div>
    </button>
  );
}
