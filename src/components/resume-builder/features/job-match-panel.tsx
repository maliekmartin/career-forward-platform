"use client";

import { useState } from "react";
import {
  Target,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface JobMatchAnalysis {
  matchScore: number;
  summary: string;
  keywords: {
    required: string[];
    found: string[];
    missing: string[];
  };
  sectionFeedback: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
  };
  criticalGaps: string[];
  quickWins: string[];
  suggestedSkillsToAdd: string[];
  suggestedBulletImprovements: {
    original: string;
    improved: string;
  }[];
}

export function JobMatchPanel() {
  const { state, addSkill } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(["keywords", "quickWins"]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          resumeData: state.data,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze job match");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddMissingSkill = (skill: string) => {
    addSkill(skill);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return isDark ? "text-green-400" : "text-green-600";
    if (score >= 60) return isDark ? "text-yellow-400" : "text-yellow-600";
    return isDark ? "text-red-400" : "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return isDark ? "bg-green-900/30" : "bg-green-50";
    if (score >= 60) return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    return isDark ? "bg-red-900/30" : "bg-red-50";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Target className={cn("w-5 h-5", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")} />
        <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
          Job Description Matching
        </h3>
      </div>

      {/* Job description input */}
      <div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to see how well your resume matches..."
          rows={6}
          className={cn(
            "w-full p-3 rounded-xl resize-none text-sm",
            isDark
              ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
          )}
        />
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className={cn(
            "w-full mt-2 gap-2",
            isDark
              ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
              : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Match
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className={cn("p-3 rounded-lg text-sm", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Score Card */}
          <div className={cn("p-4 rounded-xl", getScoreBg(analysis.matchScore))}>
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>
                Match Score
              </span>
              <span className={cn("text-3xl font-bold", getScoreColor(analysis.matchScore))}>
                {analysis.matchScore}%
              </span>
            </div>
            <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
              {analysis.summary}
            </p>
          </div>

          {/* Keywords Section */}
          <CollapsibleSection
            title="Keywords Analysis"
            icon={<Target className="w-4 h-4" />}
            isExpanded={expandedSections.includes("keywords")}
            onToggle={() => toggleSection("keywords")}
            isDark={isDark}
          >
            <div className="space-y-3">
              {/* Found keywords */}
              <div>
                <p className={cn("text-xs font-medium mb-1.5", isDark ? "text-green-400" : "text-green-600")}>
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  Found ({analysis.keywords.found.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.found.map((kw) => (
                    <span
                      key={kw}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                      )}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing keywords */}
              <div>
                <p className={cn("text-xs font-medium mb-1.5", isDark ? "text-red-400" : "text-red-600")}>
                  <XCircle className="w-3 h-3 inline mr-1" />
                  Missing ({analysis.keywords.missing.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.missing.map((kw) => (
                    <span
                      key={kw}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
                      )}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Quick Wins */}
          <CollapsibleSection
            title="Quick Wins"
            icon={<Zap className="w-4 h-4" />}
            isExpanded={expandedSections.includes("quickWins")}
            onToggle={() => toggleSection("quickWins")}
            isDark={isDark}
            badge={analysis.quickWins.length}
          >
            <ul className="space-y-2">
              {analysis.quickWins.map((win, i) => (
                <li key={i} className={cn("text-sm flex gap-2", isDark ? "text-gray-300" : "text-gray-700")}>
                  <TrendingUp className={cn("w-4 h-4 flex-shrink-0 mt-0.5", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")} />
                  {win}
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Critical Gaps */}
          {analysis.criticalGaps.length > 0 && (
            <CollapsibleSection
              title="Critical Gaps"
              icon={<AlertTriangle className="w-4 h-4" />}
              isExpanded={expandedSections.includes("gaps")}
              onToggle={() => toggleSection("gaps")}
              isDark={isDark}
              variant="warning"
            >
              <ul className="space-y-2">
                {analysis.criticalGaps.map((gap, i) => (
                  <li key={i} className={cn("text-sm", isDark ? "text-yellow-300" : "text-yellow-700")}>
                    • {gap}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Suggested Skills */}
          {analysis.suggestedSkillsToAdd.length > 0 && (
            <CollapsibleSection
              title="Add These Skills"
              icon={<Sparkles className="w-4 h-4" />}
              isExpanded={expandedSections.includes("skills")}
              onToggle={() => toggleSection("skills")}
              isDark={isDark}
            >
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedSkillsToAdd.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleAddMissingSkill(skill)}
                    className={cn(
                      "text-xs px-2 py-1 rounded-full flex items-center gap-1 transition-colors",
                      isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-[#4FD1C5]/20 hover:text-[#4FD1C5]"
                        : "bg-gray-100 text-gray-700 hover:bg-[#2B8A8A]/10 hover:text-[#2B8A8A]"
                    )}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Section Feedback */}
          <CollapsibleSection
            title="Section-by-Section Feedback"
            icon={<Target className="w-4 h-4" />}
            isExpanded={expandedSections.includes("feedback")}
            onToggle={() => toggleSection("feedback")}
            isDark={isDark}
          >
            <div className="space-y-3">
              {Object.entries(analysis.sectionFeedback).map(([section, feedback]) => (
                <div key={section}>
                  <p className={cn("text-xs font-medium capitalize mb-1", isDark ? "text-gray-400" : "text-gray-500")}>
                    {section}
                  </p>
                  <p className={cn("text-sm", isDark ? "text-gray-300" : "text-gray-700")}>
                    {feedback}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  children,
  isExpanded,
  onToggle,
  isDark,
  badge,
  variant = "default",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
  badge?: number;
  variant?: "default" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        variant === "warning"
          ? isDark
            ? "border-yellow-500/30 bg-yellow-900/10"
            : "border-yellow-200 bg-yellow-50"
          : isDark
          ? "border-gray-800 bg-gray-900"
          : "border-gray-200 bg-white"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-3 text-left",
          isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-2">
          <span className={variant === "warning" ? (isDark ? "text-yellow-400" : "text-yellow-600") : isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}>
            {icon}
          </span>
          <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
            {title}
          </span>
          {badge !== undefined && (
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full", isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600")}>
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className={cn("w-4 h-4", isDark ? "text-gray-500" : "text-gray-400")} />
        ) : (
          <ChevronDown className={cn("w-4 h-4", isDark ? "text-gray-500" : "text-gray-400")} />
        )}
      </button>
      {isExpanded && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
}
