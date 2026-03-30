"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function SummaryStep() {
  const { state, updateSummary } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterCount = state.data.summary.length;
  const maxCharacters = 500;
  const isNearLimit = characterCount > maxCharacters * 0.8;
  const isOverLimit = characterCount > maxCharacters;

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const { contactInfo, experience } = state.data;

      // Build context from resume data
      const jobTitles = experience.map((e) => e.jobTitle).filter(Boolean);
      const companies = experience.map((e) => e.company).filter(Boolean);

      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          jobTitles,
          companies,
          currentSummary: state.data.summary,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await response.json();
      updateSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

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
          Professional Summary
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Write a compelling 2-4 sentence summary highlighting your key qualifications and career goals.
          This section is optional but highly recommended.
        </p>
      </div>

      {/* AI Generate Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
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
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </>
          )}
        </Button>
        <span className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
          Let AI write your summary based on your experience
        </span>
      </div>

      {error && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-xl",
            isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"
          )}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Textarea */}
      <div>
        <textarea
          value={state.data.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="A results-driven professional with 5+ years of experience in..."
          rows={6}
          className={cn(
            "w-full p-4 rounded-xl resize-none transition-colors",
            isDark
              ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]/20"
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20",
            isOverLimit && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
          )}
        />
        <div className="flex items-center justify-between mt-2">
          <p
            className={cn(
              "text-sm",
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                ? isDark
                  ? "text-yellow-400"
                  : "text-yellow-600"
                : isDark
                ? "text-gray-500"
                : "text-gray-400"
            )}
          >
            {characterCount}/{maxCharacters} characters
          </p>
          {isOverLimit && (
            <p className="text-sm text-red-500">
              Summary is too long. Please shorten it.
            </p>
          )}
        </div>
      </div>

      {/* Examples */}
      <div
        className={cn(
          "p-4 rounded-xl",
          isDark ? "bg-gray-800/50" : "bg-gray-50"
        )}
      >
        <h4
          className={cn(
            "font-medium mb-3 text-sm",
            isDark ? "text-gray-300" : "text-gray-700"
          )}
        >
          Example Summaries
        </h4>
        <div className="space-y-4">
          <ExampleSummary
            title="Marketing Professional"
            text="Results-driven marketing professional with 7+ years of experience developing and executing multi-channel campaigns that drive brand awareness and customer acquisition. Proven track record of increasing lead generation by 150% through data-driven strategies and creative content initiatives."
            isDark={isDark}
          />
          <ExampleSummary
            title="Software Engineer"
            text="Full-stack software engineer with 5 years of experience building scalable web applications using React, Node.js, and AWS. Passionate about writing clean, maintainable code and mentoring junior developers. Led migration of legacy systems that reduced operational costs by 40%."
            isDark={isDark}
          />
          <ExampleSummary
            title="Customer Service"
            text="Dedicated customer service professional with 3+ years of experience in high-volume call centers. Known for resolving complex issues with empathy and efficiency, consistently maintaining 98% customer satisfaction ratings. Bilingual in English and Spanish."
            isDark={isDark}
          />
        </div>
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
          Tips for a Strong Summary
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Lead with your years of experience and primary expertise</li>
          <li>Include 1-2 quantifiable achievements (e.g., "increased sales by 30%")</li>
          <li>Tailor it to the job you are applying for</li>
          <li>Keep it concise - 2-4 sentences is ideal</li>
          <li>Avoid first-person pronouns (I, me, my)</li>
        </ul>
      </div>
    </div>
  );
}

function ExampleSummary({
  title,
  text,
  isDark,
}: {
  title: string;
  text: string;
  isDark: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-xs font-medium mb-1",
          isDark ? "text-gray-400" : "text-gray-500"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "text-sm italic",
          isDark ? "text-gray-300" : "text-gray-600"
        )}
      >
        "{text}"
      </p>
    </div>
  );
}
