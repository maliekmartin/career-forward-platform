"use client";

import { useState, KeyboardEvent } from "react";
import { Plus, X, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { WhyThisMatters, useBeginnerMode } from "../beginner-mode-helpers";

// Common skills suggestions by category
const SKILL_SUGGESTIONS = {
  "Technical": [
    "Microsoft Office",
    "Google Workspace",
    "Data Analysis",
    "Project Management",
    "CRM Software",
    "Excel",
    "PowerPoint",
    "Word Processing",
    "Database Management",
    "Salesforce",
  ],
  "Communication": [
    "Written Communication",
    "Verbal Communication",
    "Public Speaking",
    "Presentation Skills",
    "Active Listening",
    "Negotiation",
    "Customer Service",
    "Conflict Resolution",
  ],
  "Leadership": [
    "Team Leadership",
    "Strategic Planning",
    "Decision Making",
    "Problem Solving",
    "Time Management",
    "Delegation",
    "Mentoring",
    "Performance Management",
  ],
  "Software Development": [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "Git",
    "AWS",
    "TypeScript",
    "HTML/CSS",
    "REST APIs",
  ],
  "Healthcare": [
    "Patient Care",
    "Medical Terminology",
    "HIPAA Compliance",
    "EMR/EHR Systems",
    "Vital Signs Monitoring",
    "Medication Administration",
    "CPR Certified",
    "Infection Control",
  ],
  "Marketing": [
    "Social Media Marketing",
    "Content Creation",
    "SEO",
    "Google Analytics",
    "Email Marketing",
    "Brand Management",
    "Market Research",
    "Adobe Creative Suite",
  ],
};

export function SkillsStep() {
  const { state, addSkill, removeSkill } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { guidedMode } = state;
  const isBeginnerMode = useBeginnerMode(guidedMode);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !state.data.skills.includes(skill)) {
      addSkill(skill);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSuggestionClick = (skill: string) => {
    if (!state.data.skills.includes(skill)) {
      addSkill(skill);
    }
  };

  const handleGenerateSkills = async () => {
    if (state.data.experience.length === 0) return;

    setIsGenerating(true);
    try {
      const jobTitles = state.data.experience.map((e) => e.jobTitle).filter(Boolean);
      const bullets = state.data.experience.flatMap((e) => e.bullets).filter(Boolean);

      const response = await fetch("/api/ai/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitles,
          bullets,
          existingSkills: state.data.skills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate skills");
      }

      const data = await response.json();
      data.skills.forEach((skill: string) => {
        if (!state.data.skills.includes(skill)) {
          addSkill(skill);
        }
      });
    } catch (error) {
      console.error("Failed to generate skills:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputClass = cn(
    "h-11 rounded-xl transition-colors flex-1",
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]/20"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Skills
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Add relevant skills that showcase your abilities. Include both technical and soft skills.
        </p>
      </div>

      {/* Beginner Mode: Why This Matters */}
      {isBeginnerMode && <WhyThisMatters step="skills" isDark={isDark} />}

      {/* AI Generate button */}
      <Button
        onClick={handleGenerateSkills}
        disabled={isGenerating || state.data.experience.length === 0}
        className={cn(
          "gap-2",
          isDark
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Suggest Skills from Experience
          </>
        )}
      </Button>

      {/* Input field */}
      <div className="flex gap-2">
        <Input
          placeholder="Type a skill and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={inputClass}
        />
        <Button
          onClick={handleAddSkill}
          disabled={!inputValue.trim()}
          className={cn(
            "h-11 px-6",
            isDark
              ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
              : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
          )}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Skills tags */}
      {state.data.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {state.data.skills.map((skill) => (
            <span
              key={skill}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                isDark
                  ? "bg-[#4FD1C5]/10 text-[#4FD1C5] border border-[#4FD1C5]/20"
                  : "bg-[#2B8A8A]/10 text-[#2B8A8A] border border-[#2B8A8A]/20"
              )}
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className={cn(
                  "p-0.5 rounded-full transition-colors",
                  isDark
                    ? "hover:bg-[#4FD1C5]/20"
                    : "hover:bg-[#2B8A8A]/20"
                )}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Skill count */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm",
            isDark ? "text-gray-400" : "text-gray-500"
          )}
        >
          {state.data.skills.length} skill{state.data.skills.length !== 1 ? "s" : ""} added
        </span>
        {state.data.skills.length < 5 && (
          <span
            className={cn(
              "text-sm",
              isDark ? "text-yellow-400/80" : "text-yellow-600"
            )}
          >
            (Aim for at least 5-10 skills)
          </span>
        )}
      </div>

      {/* Skill suggestions */}
      <div
        className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb
            className={cn(
              "w-4 h-4",
              isDark ? "text-yellow-400" : "text-yellow-500"
            )}
          />
          <span
            className={cn(
              "font-medium text-sm",
              isDark ? "text-gray-300" : "text-gray-700"
            )}
          >
            Quick Add - Click to add
          </span>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(SKILL_SUGGESTIONS).map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === category
                  ? isDark
                    ? "bg-[#4FD1C5] text-gray-900"
                    : "bg-[#2B8A8A] text-white"
                  : isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Suggestions for selected category */}
        {selectedCategory && (
          <div className="flex flex-wrap gap-2">
            {SKILL_SUGGESTIONS[selectedCategory as keyof typeof SKILL_SUGGESTIONS].map(
              (skill) => {
                const isAdded = state.data.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleSuggestionClick(skill)}
                    disabled={isAdded}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-colors",
                      isAdded
                        ? isDark
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {isAdded ? "✓ " : "+ "}
                    {skill}
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <div
        className={cn(
          "p-4 rounded-xl",
          isDark ? "bg-[#4FD1C5]/5 border border-[#4FD1C5]/20" : "bg-[#2B8A8A]/5 border border-[#2B8A8A]/20"
        )}
      >
        <h4
          className={cn(
            "font-medium mb-2 text-sm",
            isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
          )}
        >
          Tips for Skills
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Match skills to the job description you're applying for</li>
          <li>Include a mix of technical (hard) and soft skills</li>
          <li>Be specific - "Excel Pivot Tables" is better than just "Excel"</li>
          <li>Include certifications and tools you're proficient with</li>
          <li>Order skills by relevance to your target role</li>
        </ul>
      </div>
    </div>
  );
}
