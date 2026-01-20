"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Lock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface ScoreData {
  totalScore: number;
  resumeQuality: { total: number };
  jobSeeker: { total: number };
  marketData?: { demandLevel: string };
  recommendations: Array<{ title: string; priority: string; isBlurred?: boolean }>;
  calculatedAt: string;
}

function MiniProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={`h-1.5 w-full rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export function ScoreCard() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [scores, setScores] = useState<ScoreData | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores/calculate");
      if (res.ok) {
        const data = await res.json();
        if (data.hasScore) {
          setScores(data.scores);
          setIsPremium(data.isPremium);
        }
      }
    } catch (error) {
      console.error("Failed to fetch scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "#22c55e";
    if (pct >= 60) return "#2B8A8A";
    if (pct >= 40) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-4 ${isDark ? "bg-gray-900" : "bg-white"} shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        <div className="animate-pulse flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-4 w-32 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
            <div className={`h-2 w-full rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
          </div>
        </div>
      </div>
    );
  }

  if (!scores) {
    return (
      <Link href="/onboarding">
        <div className={`rounded-xl p-4 ${isDark ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-50"} shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"} cursor-pointer transition-colors`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-[#2B8A8A]/20" : "bg-[#2B8A8A]/10"}`}>
                <Sparkles className="w-5 h-5 text-[#2B8A8A]" />
              </div>
              <div>
                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Get Your Career Score</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Upload your resume to see your score</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </div>
        </div>
      </Link>
    );
  }

  const scoreColor = getScoreColor(scores.totalScore, 100);
  const topRecs = scores.recommendations.slice(0, 3);

  // Normalize scores to 0-100 scale for display
  const resumeQualityPct = Math.round((scores.resumeQuality.total / 30) * 100);
  const jobSeekerPct = Math.round((scores.jobSeeker.total / 70) * 100);

  return (
    <div className={`rounded-xl ${isDark ? "bg-gray-900" : "bg-white"} shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"} overflow-hidden`}>
      {/* Compact Main Row */}
      <div
        className={`p-4 cursor-pointer transition-colors ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Score Circle */}
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 -rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth="4" />
              <motion.circle
                cx="28" cy="28" r="24" fill="none"
                stroke={scoreColor}
                strokeWidth="4" strokeLinecap="round"
                initial={{ strokeDasharray: "0 151" }}
                animate={{ strokeDasharray: `${(scores.totalScore / 100) * 151} 151` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: scoreColor }}>{Math.round(scores.totalScore)}</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Career Forward Score</h3>
              <div className="flex items-center gap-2">
                {scores.marketData?.demandLevel && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    scores.marketData.demandLevel === "high"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {scores.marketData.demandLevel} demand
                  </span>
                )}
                {expanded ? (
                  <ChevronUp className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                ) : (
                  <ChevronDown className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>Resume Quality</span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>{resumeQualityPct}/100</span>
                </div>
                <MiniProgress value={resumeQualityPct} max={100} color={getScoreColor(resumeQualityPct, 100)} />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>Job Seeker</span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>{jobSeekerPct}/100</span>
                </div>
                <MiniProgress value={jobSeekerPct} max={100} color={getScoreColor(jobSeekerPct, 100)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Recommendations */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Top Recommendations
              </span>
              {!isPremium && (
                <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>
            <div className="space-y-2">
              {topRecs.map((rec, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"} ${rec.isBlurred ? "relative overflow-hidden" : ""}`}
                >
                  {rec.isBlurred && (
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/30 dark:bg-gray-900/30 z-10 flex items-center justify-center">
                      <Lock className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                    </div>
                  )}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    rec.priority === "high" ? "bg-red-500" :
                    rec.priority === "medium" ? "bg-amber-500" : "bg-green-500"
                  }`} />
                  <span className={`text-sm truncate ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {rec.title}
                  </span>
                </div>
              ))}
            </div>

            {!isPremium && (
              <Link href="/ai-coach">
                <Button
                  className="w-full mt-3 bg-gradient-to-r from-[#2B8A8A] to-[#4ECDC4] hover:opacity-90 text-white text-sm h-9"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Chat with Compass & Unlock Tips - $4.99/mo
                </Button>
              </Link>
            )}

            {isPremium && (
              <Link href="/ai-coach">
                <Button variant="outline" className="w-full mt-3 text-sm h-9">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Chat with Compass
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
