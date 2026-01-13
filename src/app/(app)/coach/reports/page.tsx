"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Briefcase,
  Trophy,
  Calendar,
  Download,
  BarChart3,
  Target,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoClients } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function CoachReportsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Calculate stats from demo clients
  const totalClients = demoClients.length;
  const activeClients = demoClients.filter(c => c.daysInactive < 7).length;
  const totalApplications = demoClients.reduce((sum, c) => sum + c.stats.applicationsSubmitted, 0);
  const totalInterviews = demoClients.reduce((sum, c) => sum + c.stats.interviewsScheduled, 0);
  const avgQuestProgress = Math.round(demoClients.reduce((sum, c) => sum + c.questProgress, 0) / totalClients);
  const clientsNeedingAttention = demoClients.filter(c => c.daysInactive >= 5).length;
  const clientsWithOffers = demoClients.filter(c => c.currentMilestone === "offer-received").length;

  // Progress distribution
  const progressDistribution = {
    "0-25%": demoClients.filter(c => c.questProgress <= 25).length,
    "26-50%": demoClients.filter(c => c.questProgress > 25 && c.questProgress <= 50).length,
    "51-75%": demoClients.filter(c => c.questProgress > 50 && c.questProgress <= 75).length,
    "76-100%": demoClients.filter(c => c.questProgress > 75).length,
  };

  // Milestone breakdown
  const milestoneBreakdown = [
    { name: "Profile Complete", count: demoClients.filter(c => c.completedMilestones.includes("profile-complete")).length },
    { name: "Resume Ready", count: demoClients.filter(c => c.completedMilestones.includes("resume-ready")).length },
    { name: "Assessment Done", count: demoClients.filter(c => c.completedMilestones.includes("assessment-complete")).length },
    { name: "First Application", count: demoClients.filter(c => c.completedMilestones.includes("first-application")).length },
    { name: "Interview Prep", count: demoClients.filter(c => c.completedMilestones.includes("interview-prep")).length },
    { name: "Interview Scheduled", count: demoClients.filter(c => c.completedMilestones.includes("interview-scheduled")).length },
  ];

  const timeRanges = ["week", "month", "quarter", "year"] as const;

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Reports & Analytics
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Track caseload performance and outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex gap-1 p-1 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
            role="tablist"
            aria-label="Time range"
          >
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  timeRange === range
                    ? isDark
                      ? "bg-gray-700 shadow text-white"
                      : "bg-white shadow text-gray-900"
                    : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                role="tab"
                aria-selected={timeRange === range}
                aria-controls={`${range}-panel`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className={`gap-2 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-4 gap-4 mb-8"
        role="region"
        aria-label="Key metrics"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
              <Users className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +2
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {activeClients}/{totalClients}
          </div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Active Clients</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}>
              <Briefcase className={`h-5 w-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} aria-hidden="true" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +12
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{totalApplications}</div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Applications</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-purple-900/30" : "bg-purple-100"}`}>
              <Calendar className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} aria-hidden="true" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +3
            </span>
          </div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{totalInterviews}</div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Interviews Scheduled</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-xl p-5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-green-900/30" : "bg-green-100"}`}>
              <Trophy className={`h-5 w-5 ${isDark ? "text-green-400" : "text-green-600"}`} aria-hidden="true" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{clientsWithOffers}</div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Offers Received</div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Charts */}
        <div className="col-span-2 space-y-6">
          {/* Progress Distribution */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Client Progress Distribution
              </h2>
              <div className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Quest completion
              </div>
            </div>
            <div className="space-y-4" role="list" aria-label="Progress distribution">
              {Object.entries(progressDistribution).map(([range, count]) => (
                <div key={range} role="listitem">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>{range}</span>
                    <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {count} clients
                    </span>
                  </div>
                  <div
                    className={`h-3 rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                    role="progressbar"
                    aria-valuenow={(count / totalClients) * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${range}: ${count} clients`}
                  >
                    <motion.div
                      className={`h-full rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalClients) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Average Quest Progress</span>
              <span className={`text-2xl font-bold ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>{avgQuestProgress}%</span>
            </div>
          </motion.div>

          {/* Milestone Completion */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Milestone Completion
              </h2>
              <div className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <Target className="h-4 w-4" aria-hidden="true" />
                By stage
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" role="list" aria-label="Milestone completion">
              {milestoneBreakdown.map((milestone) => (
                <motion.div
                  key={milestone.name}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                  role="listitem"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                    isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                  }`}>
                    <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{milestone.name}</p>
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {milestone.count}/{totalClients}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attention Needed */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
            role="region"
            aria-label="Clients needing attention"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Needs Attention</h3>
            </div>
            {clientsNeedingAttention > 0 ? (
              <>
                <div className={`text-3xl font-bold mb-2 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  {clientsNeedingAttention}
                </div>
                <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Clients inactive for 5+ days
                </p>
                <ul className="space-y-2" role="list">
                  {demoClients.filter(c => c.daysInactive >= 5).map((client) => (
                    <li
                      key={client.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? "bg-amber-900/20" : "bg-amber-50"}`}
                    >
                      <img
                        src={client.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                          {client.firstName} {client.lastName}
                        </p>
                        <p className={`text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                          {client.daysInactive} days inactive
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" aria-hidden="true" />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>All clients are active!</p>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Quick Stats</h3>
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Avg. Applications/Client</dt>
                <dd className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {(totalApplications / totalClients).toFixed(1)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Interview Conversion</dt>
                <dd className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {totalApplications > 0 ? Math.round((totalInterviews / totalApplications) * 100) : 0}%
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Avg. Days Active</dt>
                <dd className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {Math.round(demoClients.reduce((sum, c) => sum + c.stats.daysActive, 0) / totalClients)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Completion Rate</dt>
                <dd className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}>{avgQuestProgress}%</dd>
              </div>
            </dl>
          </motion.div>

          {/* Export Options */}
          <motion.div
            variants={itemVariants}
            className={`rounded-xl p-6 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Export Reports</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Caseload Summary (PDF)
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Client Progress (CSV)
              </Button>
              <Button
                variant="outline"
                className={`w-full justify-start gap-2 ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Application Log (Excel)
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
