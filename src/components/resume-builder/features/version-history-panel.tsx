"use client";

import { useState, useEffect } from "react";
import {
  History,
  GitBranch,
  Clock,
  Eye,
  RotateCcw,
  Plus,
  Target,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { ResumeVersion, TailoredResume } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface VersionHistoryPanelProps {
  onCreateTailored?: () => void;
}

export function VersionHistoryPanel({ onCreateTailored }: VersionHistoryPanelProps) {
  const { state } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [tailoredResumes, setTailoredResumes] = useState<TailoredResume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"history" | "tailored" | null>("history");

  // Load version history
  useEffect(() => {
    if (state.resumeId) {
      loadVersionHistory();
      loadTailoredResumes();
    }
  }, [state.resumeId]);

  const loadVersionHistory = async () => {
    if (!state.resumeId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/resume/${state.resumeId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error("Failed to load versions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTailoredResumes = async () => {
    if (!state.resumeId) return;
    try {
      const res = await fetch(`/api/resume/${state.resumeId}/tailored`);
      if (res.ok) {
        const data = await res.json();
        setTailoredResumes(data.tailored || []);
      }
    } catch (error) {
      console.error("Failed to load tailored resumes:", error);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const toggleSection = (section: "history" | "tailored") => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!state.resumeId) {
    return (
      <div className="p-4 text-center">
        <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
          Save your resume to start tracking versions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Version History Section */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "border-gray-800" : "border-gray-200"
        )}
      >
        <button
          onClick={() => toggleSection("history")}
          className={cn(
            "w-full flex items-center justify-between p-3 transition-colors",
            isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
          )}
        >
          <div className="flex items-center gap-2">
            <History className={cn("w-4 h-4", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")} />
            <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
              Version History
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
              )}
            >
              {versions.length}
            </span>
          </div>
          {expandedSection === "history" ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSection === "history" && (
          <div className={cn("border-t", isDark ? "border-gray-800" : "border-gray-200")}>
            {isLoading ? (
              <div className="p-4 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
              </div>
            ) : versions.length === 0 ? (
              <div className="p-4 text-center">
                <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                  Versions are saved automatically when you make changes
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {versions.slice(0, 5).map((version, index) => (
                  <div
                    key={version.id}
                    className={cn(
                      "p-3 flex items-center justify-between",
                      isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          index === 0
                            ? isDark
                              ? "bg-[#4FD1C5]/20 text-[#4FD1C5]"
                              : "bg-[#2B8A8A]/20 text-[#2B8A8A]"
                            : isDark
                            ? "bg-gray-800 text-gray-500"
                            : "bg-gray-100 text-gray-400"
                        )}
                      >
                        {version.versionNumber}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            isDark ? "text-white" : "text-gray-900"
                          )}
                        >
                          {version.versionLabel || `Version ${version.versionNumber}`}
                        </p>
                        <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDate(version.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Preview version"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Restore this version"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tailored Resumes Section */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "border-gray-800" : "border-gray-200"
        )}
      >
        <button
          onClick={() => toggleSection("tailored")}
          className={cn(
            "w-full flex items-center justify-between p-3 transition-colors",
            isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"
          )}
        >
          <div className="flex items-center gap-2">
            <GitBranch className={cn("w-4 h-4", isDark ? "text-purple-400" : "text-purple-600")} />
            <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
              Tailored Versions
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
              )}
            >
              {tailoredResumes.length}
            </span>
          </div>
          {expandedSection === "tailored" ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSection === "tailored" && (
          <div className={cn("border-t", isDark ? "border-gray-800" : "border-gray-200")}>
            {tailoredResumes.length === 0 ? (
              <div className="p-4 text-center space-y-3">
                <Target className="w-8 h-8 mx-auto text-gray-400" />
                <div>
                  <p className={cn("text-xs font-medium", isDark ? "text-gray-300" : "text-gray-600")}>
                    No tailored versions yet
                  </p>
                  <p className={cn("text-xs mt-1", isDark ? "text-gray-500" : "text-gray-400")}>
                    Create a version optimized for a specific job
                  </p>
                </div>
                <Button
                  onClick={onCreateTailored}
                  size="sm"
                  className={cn(
                    "w-full gap-1.5",
                    isDark
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Tailored Version
                </Button>
              </div>
            ) : (
              <div>
                {tailoredResumes.map((tailored) => (
                  <div
                    key={tailored.id}
                    className={cn(
                      "p-3 flex items-center justify-between border-b last:border-b-0",
                      isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isDark ? "bg-purple-900/30" : "bg-purple-100"
                        )}
                      >
                        <Target
                          className={cn("w-4 h-4", isDark ? "text-purple-400" : "text-purple-600")}
                        />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            isDark ? "text-white" : "text-gray-900"
                          )}
                        >
                          {tailored.name}
                        </p>
                        <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                          {tailored.targetCompany} • {tailored.targetJobTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tailored.matchScore && (
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            tailored.matchScore >= 80
                              ? "bg-green-500/20 text-green-400"
                              : tailored.matchScore >= 60
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          )}
                        >
                          {tailored.matchScore}%
                        </span>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="p-3">
                  <Button
                    onClick={onCreateTailored}
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn("p-3 rounded-lg text-xs", isDark ? "bg-gray-800/50" : "bg-gray-50")}>
        <p className={cn("font-medium mb-1", isDark ? "text-gray-300" : "text-gray-700")}>
          Pro Tips:
        </p>
        <ul className={cn("space-y-0.5 list-disc list-inside", isDark ? "text-gray-500" : "text-gray-500")}>
          <li>Versions auto-save when you make significant changes</li>
          <li>Create tailored versions for each job application</li>
          <li>Track which versions performed best</li>
        </ul>
      </div>
    </div>
  );
}
