"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Brain,
  Heart,
  Target,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

const assessments = [
  {
    id: 1,
    name: "O*NET Interest Profiler",
    description:
      "Discover your interests and how they relate to the world of work. This assessment helps identify careers that match your interests.",
    duration: "30 min",
    questions: 60,
    completed: true,
    completedDate: "Dec 15, 2025",
    icon: Heart,
    color: "#E53E3E",
    link: "https://www.mynextmove.org/explore/ip",
  },
  {
    id: 2,
    name: "CareerOneStop Skills Matcher",
    description:
      "Rate your skills and find careers that match. See what skills you might need to develop for your target career.",
    duration: "20 min",
    questions: 40,
    completed: true,
    completedDate: "Dec 18, 2025",
    icon: Target,
    color: "#38A169",
    link: "https://www.careeronestop.org/toolkit/Skills/skills-matcher.aspx",
  },
  {
    id: 3,
    name: "Myers-Briggs Type Indicator (MBTI)",
    description:
      "Understand your personality type and how it influences your career preferences and work style.",
    duration: "15 min",
    questions: 93,
    completed: false,
    icon: Brain,
    color: "#805AD5",
    link: "https://www.16personalities.com/",
  },
  {
    id: 4,
    name: "Work Values Assessment",
    description:
      "Identify what matters most to you in a job - from salary to work-life balance to helping others.",
    duration: "10 min",
    questions: 20,
    completed: false,
    icon: Compass,
    color: "#2B8A8A",
    link: "https://www.mynextmove.org/explore/ip",
  },
];

const completedResults = [
  {
    assessment: "O*NET Interest Profiler",
    topInterests: ["Social", "Enterprising", "Conventional"],
    suggestedCareers: [
      "Human Resources Specialist",
      "Sales Manager",
      "Training Coordinator",
    ],
  },
  {
    assessment: "Skills Matcher",
    topSkills: ["Communication", "Problem Solving", "Customer Service"],
    suggestedCareers: [
      "Customer Service Manager",
      "Account Executive",
      "Project Coordinator",
    ],
  },
];

export default function AssessmentsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const completedCount = assessments.filter((a) => a.completed).length;

  // Stats for the dashboard-within-dashboard feel
  const stats = [
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "#38A169" },
    { label: "Available", value: assessments.length, icon: FileText, color: "#2B8A8A" },
    { label: "Suggested Careers", value: 6, icon: Target, color: "#805AD5" },
    { label: "Skills Identified", value: 8, icon: Sparkles, color: "#D69E2E" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {stat.value}
            </p>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-8 mb-6 ${
          isDark
            ? "bg-gradient-to-r from-[#4FD1C5] to-[#2B8A8A] text-gray-900"
            : "bg-gradient-to-r from-[#2B8A8A] to-[#1a5a5a] text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">
              {completedCount} of {assessments.length} Assessments Complete
            </h2>
            <p className={isDark ? "text-gray-900/80" : "text-white/80"}>
              Complete all assessments to unlock personalized career
              recommendations
            </p>
          </div>
          <div className="flex gap-2">
            {assessments.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < completedCount
                    ? isDark ? "bg-gray-900" : "bg-white"
                    : isDark ? "bg-gray-900/30" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Assessments List */}
        <div className="col-span-2 space-y-4">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`rounded-2xl border p-6 transition-all ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                  : "bg-white border-gray-100 hover:shadow-lg hover:border-[#2B8A8A]/30"
              }`}
            >
              <div className="flex gap-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${assessment.color}15` }}
                >
                  <assessment.icon
                    className="h-7 w-7"
                    style={{ color: assessment.color }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {assessment.name}
                    </h3>
                    {assessment.completed && (
                      <span className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
                        isDark ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-600"
                      }`}>
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {assessment.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-4 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {assessment.duration}
                      </span>
                      <span>{assessment.questions} questions</span>
                    </div>
                    <a
                      href={assessment.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant={assessment.completed ? "outline" : "default"}
                        className={
                          assessment.completed
                            ? isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""
                            : isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
                        }
                      >
                        {assessment.completed ? "Retake" : "Start Assessment"}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar - Results */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl border p-6 ${
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Your Results</h3>
            </div>

            {completedResults.map((result, index) => (
              <div
                key={index}
                className={`mb-6 pb-6 border-b last:border-0 last:mb-0 last:pb-0 ${
                  isDark ? "border-gray-800" : "border-gray-100"
                }`}
              >
                <h4 className={`text-sm font-medium mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {result.assessment}
                </h4>

                {result.topInterests && (
                  <div className="mb-3">
                    <p className={`text-xs mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Top Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.topInterests.map((interest) => (
                        <span
                          key={interest}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? "bg-[#4FD1C5]/20 text-[#4FD1C5]" : "bg-[#2B8A8A]/10 text-[#2B8A8A]"
                          }`}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.topSkills && (
                  <div className="mb-3">
                    <p className={`text-xs mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Top Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.topSkills.map((skill) => (
                        <span
                          key={skill}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className={`text-xs mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Suggested Careers:</p>
                  <ul className="space-y-1">
                    {result.suggestedCareers.map((career) => (
                      <li
                        key={career}
                        className={`text-sm flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <ArrowRight className={`h-3 w-3 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl p-6 ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Need Help Interpreting Results?
            </h3>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              A career coach can help you understand your assessment results and
              create a personalized career plan.
            </p>
            <Button
              variant="outline"
              className={`w-full ${
                isDark
                  ? "border-[#4FD1C5] text-[#4FD1C5] hover:bg-[#4FD1C5] hover:text-gray-900"
                  : "border-[#2B8A8A] text-[#2B8A8A] hover:bg-[#2B8A8A] hover:text-white"
              }`}
            >
              Talk to a Coach
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
