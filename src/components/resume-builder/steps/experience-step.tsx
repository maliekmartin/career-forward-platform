"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeBuilder } from "../context/resume-builder-context";
import { WorkExperience, generateId } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { WhyThisMatters, useBeginnerMode } from "../beginner-mode-helpers";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function ExperienceStep() {
  const { state, addExperience, updateExperience, deleteExperience } =
    useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { guidedMode } = state;
  const isBeginnerMode = useBeginnerMode(guidedMode);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: generateId(),
      jobTitle: "",
      company: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      bullets: [""],
    };
    addExperience(newExp);
    setExpandedId(newExp.id);
  };

  const handleDeleteExperience = (id: string) => {
    deleteExperience(id);
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleAddBullet = (expId: string) => {
    const exp = state.data.experience.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, { bullets: [...exp.bullets, ""] });
    }
  };

  const handleUpdateBullet = (expId: string, bulletIndex: number, value: string) => {
    const exp = state.data.experience.find((e) => e.id === expId);
    if (exp) {
      const newBullets = [...exp.bullets];
      newBullets[bulletIndex] = value;
      updateExperience(expId, { bullets: newBullets });
    }
  };

  const handleDeleteBullet = (expId: string, bulletIndex: number) => {
    const exp = state.data.experience.find((e) => e.id === expId);
    if (exp && exp.bullets.length > 1) {
      const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex);
      updateExperience(expId, { bullets: newBullets });
    }
  };

  const handleGenerateBullets = async (expId: string) => {
    const exp = state.data.experience.find((e) => e.id === expId);
    if (!exp || !exp.jobTitle) return;

    setIsGenerating(expId);
    try {
      const response = await fetch("/api/ai/generate-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: exp.jobTitle,
          company: exp.company,
          existingBullets: exp.bullets.filter((b) => b.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bullets");
      }

      const data = await response.json();
      updateExperience(expId, { bullets: data.bullets });
    } catch (error) {
      console.error("Failed to generate bullets:", error);
    } finally {
      setIsGenerating(null);
    }
  };

  const inputClass = cn(
    "h-10 rounded-lg transition-colors",
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]/20"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
  );

  const labelClass = cn(
    "text-xs font-medium mb-1 block",
    isDark ? "text-gray-400" : "text-gray-600"
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
          Work Experience
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Add your work history, starting with your most recent position.
          Use bullet points to highlight your achievements.
        </p>
      </div>

      {/* Beginner Mode: Why This Matters */}
      {isBeginnerMode && <WhyThisMatters step="experience" isDark={isDark} />}

      {/* Experience list */}
      <div className="space-y-4">
        {state.data.experience.map((exp, index) => (
          <div
            key={exp.id}
            className={cn(
              "rounded-xl border overflow-hidden transition-all",
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200",
              expandedId === exp.id && (isDark ? "ring-1 ring-[#4FD1C5]/30" : "ring-1 ring-[#2B8A8A]/30")
            )}
          >
            {/* Header - always visible */}
            <button
              onClick={() =>
                setExpandedId(expandedId === exp.id ? null : exp.id)
              }
              className={cn(
                "w-full flex items-center gap-3 p-4 text-left transition-colors",
                isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
              )}
            >
              <GripVertical
                className={cn(
                  "w-5 h-5 cursor-grab",
                  isDark ? "text-gray-600" : "text-gray-300"
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium truncate",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {exp.jobTitle || "Job Title"}
                </p>
                <p
                  className={cn(
                    "text-sm truncate",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {exp.company || "Company"} {exp.city && exp.state && `• ${exp.city}, ${exp.state}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteExperience(exp.id);
                  }}
                  className={cn(
                    "h-8 w-8",
                    isDark
                      ? "text-gray-500 hover:text-red-400 hover:bg-red-900/20"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedId === exp.id ? (
                  <ChevronUp className={isDark ? "text-gray-400" : "text-gray-500"} />
                ) : (
                  <ChevronDown className={isDark ? "text-gray-400" : "text-gray-500"} />
                )}
              </div>
            </button>

            {/* Expanded content */}
            {expandedId === exp.id && (
              <div
                className={cn(
                  "p-4 border-t space-y-4",
                  isDark ? "border-gray-800" : "border-gray-200"
                )}
              >
                {/* Job title and company */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <Briefcase className="w-3 h-3 inline mr-1" />
                      Job Title *
                    </Label>
                    <Input
                      placeholder="Software Engineer"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        updateExperience(exp.id, { jobTitle: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      <Building2 className="w-3 h-3 inline mr-1" />
                      Company *
                    </Label>
                    <Input
                      placeholder="Acme Corp"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, { company: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <MapPin className="w-3 h-3 inline mr-1" />
                      City
                    </Label>
                    <Input
                      placeholder="Seattle"
                      value={exp.city}
                      onChange={(e) =>
                        updateExperience(exp.id, { city: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>State</Label>
                    <select
                      value={exp.state}
                      onChange={(e) =>
                        updateExperience(exp.id, { state: e.target.value })
                      }
                      className={cn(inputClass, "w-full px-3")}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Start Date *
                    </Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { startDate: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>End Date</Label>
                    <div className="space-y-2">
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, { endDate: e.target.value })
                        }
                        disabled={exp.isCurrent}
                        className={cn(inputClass, exp.isCurrent && "opacity-50")}
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              isCurrent: e.target.checked,
                              endDate: e.target.checked ? "" : exp.endDate,
                            })
                          }
                          className={cn(
                            "rounded",
                            isDark ? "bg-gray-800 border-gray-600" : ""
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}
                        >
                          I currently work here
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bullet points */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={labelClass}>Responsibilities & Achievements</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateBullets(exp.id)}
                      disabled={isGenerating === exp.id || !exp.jobTitle}
                      className={cn(
                        "gap-1 h-7 text-xs",
                        isDark
                          ? "border-purple-500/30 text-purple-400 hover:bg-purple-900/20"
                          : "border-purple-500/30 text-purple-600 hover:bg-purple-50"
                      )}
                    >
                      {isGenerating === exp.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      Generate with AI
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <span
                          className={cn(
                            "mt-2.5 w-2 h-2 rounded-full flex-shrink-0",
                            isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"
                          )}
                        />
                        <Input
                          placeholder="Developed and maintained..."
                          value={bullet}
                          onChange={(e) =>
                            handleUpdateBullet(exp.id, bulletIndex, e.target.value)
                          }
                          className={cn(inputClass, "flex-1")}
                        />
                        {exp.bullets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBullet(exp.id, bulletIndex)}
                            className={cn(
                              "h-10 w-10 flex-shrink-0",
                              isDark
                                ? "text-gray-500 hover:text-red-400"
                                : "text-gray-400 hover:text-red-600"
                            )}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddBullet(exp.id)}
                      className={cn(
                        "gap-1 h-8 ml-4",
                        isDark
                          ? "text-[#4FD1C5] hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/10"
                          : "text-[#2B8A8A] hover:text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                      )}
                    >
                      <Plus className="w-3 h-3" />
                      Add bullet point
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add experience button */}
        <Button
          variant="outline"
          onClick={handleAddExperience}
          className={cn(
            "w-full h-14 border-dashed gap-2",
            isDark
              ? "border-gray-700 text-gray-400 hover:text-[#4FD1C5] hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5"
              : "border-gray-300 text-gray-500 hover:text-[#2B8A8A] hover:border-[#2B8A8A] hover:bg-[#2B8A8A]/5"
          )}
        >
          <Plus className="w-5 h-5" />
          Add Work Experience
        </Button>
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
          Tips for Work Experience
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Start bullet points with strong action verbs (Led, Developed, Managed)</li>
          <li>Include quantifiable achievements when possible (e.g., "Increased sales by 25%")</li>
          <li>Focus on accomplishments, not just responsibilities</li>
          <li>Keep bullets concise - 1-2 lines each</li>
          <li>List your most recent or relevant experience first</li>
        </ul>
      </div>
    </div>
  );
}
