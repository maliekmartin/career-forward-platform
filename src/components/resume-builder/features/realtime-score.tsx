"use client";

import { useMemo } from "react";
import { TrendingUp, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  tips: string[];
  status: "good" | "warning" | "error";
}

export function RealtimeScore() {
  const { state } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { data } = state;

  // Calculate score in real-time
  const scoreBreakdown = useMemo((): ScoreBreakdown[] => {
    const breakdown: ScoreBreakdown[] = [];

    // Contact Info (15 points)
    const contactScore = [
      data.contactInfo.firstName ? 3 : 0,
      data.contactInfo.lastName ? 3 : 0,
      data.contactInfo.email ? 3 : 0,
      data.contactInfo.phone ? 3 : 0,
      (data.contactInfo.city && data.contactInfo.state) ? 3 : 0,
    ].reduce((a, b) => a + b, 0);

    breakdown.push({
      category: "Contact Info",
      score: contactScore,
      maxScore: 15,
      status: contactScore >= 12 ? "good" : contactScore >= 9 ? "warning" : "error",
      tips: [
        !data.contactInfo.firstName && "Add first name",
        !data.contactInfo.lastName && "Add last name",
        !data.contactInfo.email && "Add email address",
        !data.contactInfo.phone && "Add phone number",
        (!data.contactInfo.city || !data.contactInfo.state) && "Add location",
      ].filter(Boolean) as string[],
    });

    // Summary (15 points)
    const summaryLength = data.summary.length;
    const summaryScore = summaryLength === 0 ? 0
      : summaryLength < 100 ? 5
      : summaryLength < 200 ? 10
      : summaryLength <= 500 ? 15
      : 10; // Too long

    breakdown.push({
      category: "Summary",
      score: summaryScore,
      maxScore: 15,
      status: summaryScore >= 12 ? "good" : summaryScore >= 8 ? "warning" : "error",
      tips: [
        summaryLength === 0 && "Add a professional summary",
        summaryLength > 0 && summaryLength < 100 && "Summary is too short (aim for 150-300 characters)",
        summaryLength > 500 && "Summary is too long (keep under 500 characters)",
      ].filter(Boolean) as string[],
    });

    // Work Experience (30 points)
    const expCount = data.experience.length;
    const bulletsCount = data.experience.reduce((acc, exp) =>
      acc + exp.bullets.filter(b => b.trim().length > 0).length, 0
    );
    const hasQuantifiedBullets = data.experience.some(exp =>
      exp.bullets.some(b => /\d+%|\$\d+|\d+ /.test(b))
    );

    let expScore = 0;
    expScore += Math.min(expCount * 5, 15); // Up to 15 for having experiences
    expScore += Math.min(bulletsCount * 2, 10); // Up to 10 for bullets
    expScore += hasQuantifiedBullets ? 5 : 0; // 5 for metrics

    breakdown.push({
      category: "Experience",
      score: Math.min(expScore, 30),
      maxScore: 30,
      status: expScore >= 25 ? "good" : expScore >= 15 ? "warning" : "error",
      tips: [
        expCount === 0 && "Add work experience",
        expCount > 0 && bulletsCount < 3 && "Add more bullet points to describe achievements",
        expCount > 0 && !hasQuantifiedBullets && "Add metrics to bullets (e.g., 'increased sales by 25%')",
      ].filter(Boolean) as string[],
    });

    // Education (15 points)
    const eduCount = data.education.length;
    const hasCompleteEdu = data.education.some(e => e.school && e.degree);

    let eduScore = 0;
    eduScore += eduCount > 0 ? 10 : 0;
    eduScore += hasCompleteEdu ? 5 : 0;

    breakdown.push({
      category: "Education",
      score: eduScore,
      maxScore: 15,
      status: eduScore >= 12 ? "good" : eduScore >= 8 ? "warning" : "error",
      tips: [
        eduCount === 0 && "Add your education",
        eduCount > 0 && !hasCompleteEdu && "Complete education details (school and degree)",
      ].filter(Boolean) as string[],
    });

    // Skills (20 points)
    const skillsCount = data.skills.length;
    let skillsScore = Math.min(skillsCount * 2, 20);

    breakdown.push({
      category: "Skills",
      score: skillsScore,
      maxScore: 20,
      status: skillsScore >= 16 ? "good" : skillsScore >= 10 ? "warning" : "error",
      tips: [
        skillsCount === 0 && "Add relevant skills",
        skillsCount > 0 && skillsCount < 5 && "Add more skills (aim for 8-15)",
        skillsCount > 20 && "Consider removing less relevant skills",
      ].filter(Boolean) as string[],
    });

    // Certifications (5 points - bonus)
    const certScore = data.certifications.length > 0 ? 5 : 0;
    breakdown.push({
      category: "Certifications",
      score: certScore,
      maxScore: 5,
      status: certScore > 0 ? "good" : "warning",
      tips: [
        certScore === 0 && "Add certifications if you have any (optional)",
      ].filter(Boolean) as string[],
    });

    return breakdown;
  }, [data]);

  const totalScore = scoreBreakdown.reduce((acc, b) => acc + b.score, 0);
  const maxScore = scoreBreakdown.reduce((acc, b) => acc + b.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getScoreColor = () => {
    if (percentage >= 80) return isDark ? "text-green-400" : "text-green-600";
    if (percentage >= 60) return isDark ? "text-yellow-400" : "text-yellow-600";
    return isDark ? "text-red-400" : "text-red-600";
  };

  const getScoreBg = () => {
    if (percentage >= 80) return isDark ? "bg-green-900/30" : "bg-green-50";
    if (percentage >= 60) return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    return isDark ? "bg-red-900/30" : "bg-red-50";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className={cn("w-5 h-5", isDark ? "text-[#4FD1C5]" : "text-[#0D9488]")} />
        <h3 className={cn("font-semibold", isDark ? "text-white" : "text-[#0F172A]")}>
          Resume Score
        </h3>
      </div>

      {/* Score circle */}
      <div className={cn("p-4 rounded-xl text-center", getScoreBg())}>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={isDark ? "#0F172A" : "#e5e7eb"}
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={percentage >= 80 ? "#22c55e" : percentage >= 60 ? "#eab308" : "#ef4444"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            />
          </svg>
          <span className={cn("absolute text-2xl font-bold", getScoreColor())}>
            {percentage}
          </span>
        </div>
        <p className={cn("text-sm mt-2", isDark ? "text-gray-400" : "text-gray-600")}>
          {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good progress" : "Needs work"}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {scoreBreakdown.map((item) => (
          <div
            key={item.category}
            className={cn(
              "p-3 rounded-lg",
              isDark ? "bg-gray-900" : "bg-white border border-gray-200"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-[#0F172A]")}>
                  {item.category}
                </span>
              </div>
              <span className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                {item.score}/{item.maxScore}
              </span>
            </div>

            {/* Progress bar */}
            <div className={cn("h-1.5 rounded-full mt-2", isDark ? "bg-gray-800" : "bg-gray-200")}>
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  item.status === "good" ? "bg-green-500" : item.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${(item.score / item.maxScore) * 100}%` }}
              />
            </div>

            {/* Tips */}
            {item.tips.length > 0 && (
              <div className="mt-2 space-y-1">
                {item.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Info className={cn("w-3 h-3 mt-0.5 flex-shrink-0", isDark ? "text-gray-600" : "text-gray-400")} />
                    <span className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
