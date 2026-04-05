"use client";

import {
  CheckCircle2,
  AlertCircle,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Award,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface SectionStatus {
  name: string;
  icon: typeof User;
  isComplete: boolean;
  issues: string[];
  step: string;
}

export function ReviewStep() {
  const { state, goToStep, saveResume } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data } = state;

  // Analyze each section
  const sections: SectionStatus[] = [
    {
      name: "Contact Information",
      icon: User,
      step: "contact",
      isComplete: !!(
        data.contactInfo.firstName &&
        data.contactInfo.lastName &&
        data.contactInfo.email &&
        data.contactInfo.phone &&
        data.contactInfo.city &&
        data.contactInfo.state
      ),
      issues: [
        !data.contactInfo.firstName && "Missing first name",
        !data.contactInfo.lastName && "Missing last name",
        !data.contactInfo.email && "Missing email",
        !data.contactInfo.phone && "Missing phone number",
        !data.contactInfo.city && "Missing city",
        !data.contactInfo.state && "Missing state",
      ].filter(Boolean) as string[],
    },
    {
      name: "Professional Summary",
      icon: FileText,
      step: "summary",
      isComplete: data.summary.length >= 50,
      issues: [
        data.summary.length === 0 && "No summary added",
        data.summary.length > 0 && data.summary.length < 50 && "Summary is too short",
        data.summary.length > 500 && "Summary is too long",
      ].filter(Boolean) as string[],
    },
    {
      name: "Work Experience",
      icon: Briefcase,
      step: "experience",
      isComplete:
        data.experience.length > 0 &&
        data.experience.every(
          (exp) =>
            exp.jobTitle &&
            exp.company &&
            exp.startDate &&
            exp.bullets.some((b) => b.trim())
        ),
      issues: [
        data.experience.length === 0 && "No work experience added",
        ...data.experience.flatMap((exp, i) => [
          !exp.jobTitle && `Experience ${i + 1}: Missing job title`,
          !exp.company && `Experience ${i + 1}: Missing company`,
          !exp.startDate && `Experience ${i + 1}: Missing start date`,
          !exp.bullets.some((b) => b.trim()) &&
            `Experience ${i + 1}: No achievements listed`,
        ]),
      ].filter(Boolean) as string[],
    },
    {
      name: "Education",
      icon: GraduationCap,
      step: "education",
      isComplete:
        data.education.length > 0 &&
        data.education.every((edu) => edu.school && edu.degree),
      issues: [
        data.education.length === 0 && "No education added",
        ...data.education.flatMap((edu, i) => [
          !edu.school && `Education ${i + 1}: Missing school name`,
          !edu.degree && `Education ${i + 1}: Missing degree`,
        ]),
      ].filter(Boolean) as string[],
    },
    {
      name: "Skills",
      icon: Lightbulb,
      step: "skills",
      isComplete: data.skills.length >= 5,
      issues: [
        data.skills.length === 0 && "No skills added",
        data.skills.length > 0 && data.skills.length < 5 && "Consider adding more skills (aim for 5-10)",
      ].filter(Boolean) as string[],
    },
    {
      name: "Certifications",
      icon: Award,
      step: "certifications",
      isComplete: true, // Optional section, always "complete"
      issues: [],
    },
  ];

  const completedSections = sections.filter((s) => s.isComplete).length;
  const totalSections = sections.length - 1; // Exclude certifications from count
  const completionPercentage = Math.round(
    (completedSections / totalSections) * 100
  );

  const allRequiredComplete = sections
    .filter((s) => s.name !== "Certifications")
    .every((s) => s.isComplete);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-[#0F172A]"
          )}
        >
          Review Your Resume
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Check your resume for completeness before downloading.
        </p>
      </div>

      {/* Completion Score */}
      <div
        className={cn(
          "p-6 rounded-xl border",
          allRequiredComplete
            ? isDark
              ? "bg-green-900/20 border-green-500/30"
              : "bg-green-50 border-green-200"
            : isDark
            ? "bg-yellow-900/20 border-yellow-500/30"
            : "bg-yellow-50 border-yellow-200"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {allRequiredComplete ? (
              <CheckCircle2
                className={cn(
                  "w-8 h-8",
                  isDark ? "text-green-400" : "text-green-600"
                )}
              />
            ) : (
              <AlertCircle
                className={cn(
                  "w-8 h-8",
                  isDark ? "text-yellow-400" : "text-yellow-600"
                )}
              />
            )}
            <div>
              <p
                className={cn(
                  "font-semibold text-lg",
                  isDark ? "text-white" : "text-[#0F172A]"
                )}
              >
                {allRequiredComplete
                  ? "Your resume is ready!"
                  : "Almost there!"}
              </p>
              <p
                className={cn(
                  "text-sm",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}
              >
                {completedSections} of {totalSections} sections complete
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-3xl font-bold",
                allRequiredComplete
                  ? isDark
                    ? "text-green-400"
                    : "text-green-600"
                  : isDark
                  ? "text-yellow-400"
                  : "text-yellow-600"
              )}
            >
              {completionPercentage}%
            </p>
            <p
              className={cn(
                "text-xs",
                isDark ? "text-gray-500" : "text-gray-400"
              )}
            >
              Complete
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className={cn(
            "h-2 rounded-full overflow-hidden",
            isDark ? "bg-gray-700" : "bg-gray-200"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              allRequiredComplete
                ? isDark
                  ? "bg-green-400"
                  : "bg-green-500"
                : isDark
                ? "bg-yellow-400"
                : "bg-yellow-500"
            )}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Section status list */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.name}
            className={cn(
              "p-4 rounded-xl border transition-all",
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    section.isComplete
                      ? isDark
                        ? "bg-green-900/30"
                        : "bg-green-50"
                      : isDark
                      ? "bg-yellow-900/30"
                      : "bg-yellow-50"
                  )}
                >
                  <section.icon
                    className={cn(
                      "w-5 h-5",
                      section.isComplete
                        ? isDark
                          ? "text-green-400"
                          : "text-green-600"
                        : isDark
                        ? "text-yellow-400"
                        : "text-yellow-600"
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDark ? "text-white" : "text-[#0F172A]"
                    )}
                  >
                    {section.name}
                  </p>
                  {section.issues.length > 0 ? (
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-yellow-400/80" : "text-yellow-600"
                      )}
                    >
                      {section.issues[0]}
                    </p>
                  ) : (
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-green-400/80" : "text-green-600"
                      )}
                    >
                      Complete
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {section.isComplete ? (
                  <CheckCircle2
                    className={cn(
                      "w-5 h-5",
                      isDark ? "text-green-400" : "text-green-600"
                    )}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => goToStep(section.step as any)}
                    className={cn(
                      "text-sm",
                      isDark
                        ? "text-[#4FD1C5] hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/10"
                        : "text-[#0D9488] hover:text-[#0D9488] hover:bg-[#0D9488]/10"
                    )}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resume name */}
      <div
        className={cn(
          "p-4 rounded-xl border",
          isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
        )}
      >
        <p
          className={cn(
            "text-sm font-medium mb-1",
            isDark ? "text-gray-400" : "text-gray-500"
          )}
        >
          Resume Name
        </p>
        <p
          className={cn(
            "font-semibold",
            isDark ? "text-white" : "text-[#0F172A]"
          )}
        >
          {state.resumeName}
        </p>
        <p
          className={cn(
            "text-sm mt-1",
            isDark ? "text-gray-500" : "text-gray-400"
          )}
        >
          Template: {state.templateId.charAt(0).toUpperCase() + state.templateId.slice(1)}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className={cn(
            "flex-1 h-12 gap-2",
            isDark
              ? "border-gray-700 hover:bg-gray-800"
              : "border-gray-200 hover:bg-gray-100"
          )}
        >
          <Eye className="w-4 h-4" />
          Preview Full Resume
        </Button>
        <Button
          disabled={!allRequiredComplete}
          className={cn(
            "flex-1 h-12 gap-2",
            isDark
              ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-[#0F172A]"
              : "bg-[#F59E0B] hover:bg-[#D97706] text-white",
            !allRequiredComplete && "opacity-50 cursor-not-allowed"
          )}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* Tips */}
      <div
        className={cn(
          "p-4 rounded-xl",
          isDark ? "bg-[#4FD1C5]/5 border border-[#4FD1C5]/20" : "bg-[#0D9488]/5 border border-[#0D9488]/20"
        )}
      >
        <h4
          className={cn(
            "font-medium mb-2 text-sm",
            isDark ? "text-[#4FD1C5]" : "text-[#0D9488]"
          )}
        >
          Before You Download
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Review the live preview on the right to see how your resume looks</li>
          <li>Check for spelling and grammar errors</li>
          <li>Tailor your resume for each job application</li>
          <li>Keep your resume to 1-2 pages for most positions</li>
          <li>Use the PDF format for best compatibility with ATS systems</li>
        </ul>
      </div>
    </div>
  );
}
