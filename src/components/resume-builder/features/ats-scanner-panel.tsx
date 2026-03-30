"use client";

import { useState } from "react";
import {
  Scan,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSearch,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface ATSAnalysis {
  atsScore: number;
  parsedData: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    currentTitle: string | null;
    totalExperience: string | null;
    skills: string[];
    education: string | null;
    certifications: string[];
  };
  issues: {
    severity: "high" | "medium" | "low";
    section: string;
    issue: string;
    fix: string;
  }[];
  formatting: {
    score: number;
    feedback: string[];
  };
  keywords: {
    detected: string[];
    density: string;
  };
  compatibilityByATS: {
    workday: number;
    taleo: number;
    greenhouse: number;
    icims: number;
  };
}

export function ATSScannerPanel() {
  const { state } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/ats-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: state.data }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to scan");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan resume");
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return isDark ? "text-green-400" : "text-green-600";
    if (score >= 60) return isDark ? "text-yellow-400" : "text-yellow-600";
    return isDark ? "text-red-400" : "text-red-600";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Scan className={cn("w-5 h-5", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")} />
        <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
          ATS Compatibility Scanner
        </h3>
      </div>

      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
        See how your resume will be parsed by Applicant Tracking Systems and identify issues.
      </p>

      <Button
        onClick={handleScan}
        disabled={isScanning}
        className={cn(
          "w-full gap-2",
          isDark
            ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
            : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
        )}
      >
        {isScanning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <FileSearch className="w-4 h-4" />
            Scan Resume
          </>
        )}
      </Button>

      {error && (
        <div className={cn("p-3 rounded-lg text-sm", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className={cn("p-4 rounded-xl text-center", isDark ? "bg-gray-900" : "bg-gray-50")}>
            <p className={cn("text-sm mb-1", isDark ? "text-gray-400" : "text-gray-500")}>
              ATS Compatibility Score
            </p>
            <p className={cn("text-4xl font-bold", getScoreColor(analysis.atsScore))}>
              {analysis.atsScore}%
            </p>
          </div>

          {/* ATS Compatibility by System */}
          <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-900" : "bg-white border border-gray-200")}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className={cn("w-4 h-4", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")} />
              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                Compatibility by ATS System
              </span>
            </div>
            <div className="space-y-2">
              {Object.entries(analysis.compatibilityByATS).map(([ats, score]) => (
                <div key={ats} className="flex items-center gap-3">
                  <span className={cn("text-xs w-20 capitalize", isDark ? "text-gray-400" : "text-gray-500")}>
                    {ats}
                  </span>
                  <div className={cn("flex-1 h-2 rounded-full", isDark ? "bg-gray-800" : "bg-gray-200")}>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        score >= 80
                          ? "bg-green-500"
                          : score >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className={cn("text-xs w-8", getScoreColor(score))}>{score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parsed Data Preview */}
          <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-900" : "bg-white border border-gray-200")}>
            <p className={cn("text-sm font-medium mb-3", isDark ? "text-white" : "text-gray-900")}>
              How ATS Sees Your Resume
            </p>
            <div className="space-y-2 text-sm">
              {Object.entries(analysis.parsedData).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                return (
                  <div key={key} className="flex gap-2">
                    <span className={cn("w-28 flex-shrink-0 capitalize", isDark ? "text-gray-500" : "text-gray-400")}>
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span className={cn(isDark ? "text-gray-300" : "text-gray-700")}>
                      {Array.isArray(value) ? value.join(", ") : value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-900" : "bg-white border border-gray-200")}>
              <p className={cn("text-sm font-medium mb-3", isDark ? "text-white" : "text-gray-900")}>
                Issues Found ({analysis.issues.length})
              </p>
              <div className="space-y-3">
                {analysis.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-lg",
                      issue.severity === "high"
                        ? isDark
                          ? "bg-red-900/20"
                          : "bg-red-50"
                        : issue.severity === "medium"
                        ? isDark
                          ? "bg-yellow-900/20"
                          : "bg-yellow-50"
                        : isDark
                        ? "bg-blue-900/20"
                        : "bg-blue-50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                          {issue.section}
                        </p>
                        <p className={cn("text-sm mt-0.5", isDark ? "text-gray-400" : "text-gray-600")}>
                          {issue.issue}
                        </p>
                        <p className={cn("text-xs mt-1", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")}>
                          Fix: {issue.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formatting Feedback */}
          <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-900" : "bg-white border border-gray-200")}>
            <div className="flex items-center justify-between mb-3">
              <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
                Formatting Score
              </span>
              <span className={cn("font-bold", getScoreColor(analysis.formatting.score))}>
                {analysis.formatting.score}%
              </span>
            </div>
            <ul className="space-y-1.5">
              {analysis.formatting.feedback.map((item, i) => (
                <li
                  key={i}
                  className={cn(
                    "text-sm flex items-start gap-2",
                    item.toLowerCase().includes("good") || item.toLowerCase().includes("✓")
                      ? isDark
                        ? "text-green-400"
                        : "text-green-600"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  )}
                >
                  {item.toLowerCase().includes("good") || item.toLowerCase().includes("✓") ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-900" : "bg-white border border-gray-200")}>
            <p className={cn("text-sm font-medium mb-2", isDark ? "text-white" : "text-gray-900")}>
              Keywords Detected
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywords.detected.map((kw) => (
                <span
                  key={kw}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                  )}
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className={cn("text-xs mt-2", isDark ? "text-gray-500" : "text-gray-400")}>
              Keyword density: {analysis.keywords.density}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
