"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Clock,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Phone,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  Briefcase,
  PartyPopper,
  FileText,
  X,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useJobApplications } from "@/lib/job-applications-context";
import { jobStatuses, formatPay, JobApplication } from "@/lib/job-data";
import { useTheme } from "@/lib/theme-context";

type StatusFilter = JobApplication["status"] | "all";

export default function JobTrackerPage() {
  const { applications, updateApplicationStatus, setHiredData } = useJobApplications();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [view, setView] = useState<"list" | "board">("list");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [showHiredModal, setShowHiredModal] = useState<string | null>(null);
  const [hiredFormData, setHiredFormData] = useState({
    jobTitle: "",
    hourlyWage: "",
    hoursPerWeek: "40",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSuccessStoryModal, setShowSuccessStoryModal] = useState(false);
  const [successStory, setSuccessStory] = useState("");
  const [recentlyHiredApp, setRecentlyHiredApp] = useState<JobApplication | null>(null);

  // Stats for the dashboard-within-dashboard feel
  const stats = [
    { label: "Total Applied", value: applications.length, icon: Briefcase, color: "#2B8A8A" },
    { label: "Interviewing", value: applications.filter(a => ["phone-screen", "first-interview", "final-interview"].includes(a.status)).length, icon: Users, color: "#805AD5" },
    { label: "Offers", value: applications.filter(a => a.status === "offered").length, icon: Target, color: "#38A169" },
    { label: "Hired", value: applications.filter(a => a.status === "hired").length, icon: PartyPopper, color: "#D69E2E" },
  ];

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status: JobApplication["status"]) =>
    applications.filter((app) => app.status === status).length;

  const getStatusConfig = (status: JobApplication["status"]) => {
    const config = jobStatuses.find((s) => s.id === status);
    return config || { label: status, color: "#6b7280", bgColor: "bg-gray-100", textColor: "text-gray-700" };
  };

  const getStatusIcon = (status: JobApplication["status"]) => {
    switch (status) {
      case "applied":
        return FileText;
      case "phone-screen":
        return Phone;
      case "first-interview":
        return Users;
      case "final-interview":
        return Star;
      case "offered":
        return CheckCircle2;
      case "hired":
        return PartyPopper;
      case "rejected":
        return XCircle;
      default:
        return Briefcase;
    }
  };

  const handleStatusChange = (appId: string, newStatus: JobApplication["status"]) => {
    if (newStatus === "hired") {
      const app = applications.find((a) => a.id === appId);
      if (app) {
        setHiredFormData({
          jobTitle: app.job.title,
          hourlyWage: app.job.payType === "hourly" ? String(app.job.payMin) : "",
          hoursPerWeek: String(app.job.hoursPerWeek || 40),
          startDate: new Date().toISOString().split("T")[0],
        });
      }
      setShowHiredModal(appId);
    } else {
      updateApplicationStatus(appId, newStatus);
    }
  };

  const handleHiredSubmit = (appId: string) => {
    const app = applications.find((a) => a.id === appId);

    setHiredData(appId, {
      startDate: hiredFormData.startDate,
      jobTitle: hiredFormData.jobTitle,
      hourlyWage: hiredFormData.hourlyWage ? parseFloat(hiredFormData.hourlyWage) : undefined,
      hoursPerWeek: parseInt(hiredFormData.hoursPerWeek),
    });

    setShowHiredModal(null);
    setRecentlyHiredApp(app || null);
    setShowCelebration(true);

    // Show celebration for 3 seconds, then show success story modal
    setTimeout(() => {
      setShowCelebration(false);
      setShowSuccessStoryModal(true);
    }, 3000);
  };

  const handleSuccessStorySubmit = () => {
    if (recentlyHiredApp && successStory) {
      setHiredData(recentlyHiredApp.id, {
        ...recentlyHiredApp.hiredData!,
        successStory,
      });
    }
    setShowSuccessStoryModal(false);
    setSuccessStory("");
    setRecentlyHiredApp(null);
  };

  // Status summary for the kanban-style view
  const statusSummary = jobStatuses.filter((s) => s.id !== "rejected").map((status) => ({
    ...status,
    count: getStatusCount(status.id as JobApplication["status"]),
  }));

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

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`rounded-3xl p-12 text-center max-w-md mx-4 ${isDark ? "bg-gray-900" : "bg-white"}`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                className="text-8xl mb-6"
              >
                <PartyPopper className={`h-24 w-24 mx-auto ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
              </motion.div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Quest Complete!
              </h2>
              <p className={`text-xl mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Congratulations on landing the job!
              </p>
              <p className={`font-semibold ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
                {recentlyHiredApp?.job.title} at {recentlyHiredApp?.job.company}
              </p>
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [-20, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: ["#2B8A8A", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444"][i] }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hired Modal */}
      <AnimatePresence>
        {showHiredModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-2xl p-8 max-w-md w-full ${isDark ? "bg-gray-900" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Congratulations! Tell us about your new job
                </h3>
                <button
                  onClick={() => setShowHiredModal(null)}
                  className={`p-2 rounded-full ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={hiredFormData.jobTitle}
                    onChange={(e) =>
                      setHiredFormData({ ...hiredFormData, jobTitle: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                      isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Hourly Wage ($)
                  </label>
                  <input
                    type="number"
                    value={hiredFormData.hourlyWage}
                    onChange={(e) =>
                      setHiredFormData({ ...hiredFormData, hourlyWage: e.target.value })
                    }
                    placeholder="e.g. 22.50"
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                      isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Hours Per Week
                  </label>
                  <input
                    type="number"
                    value={hiredFormData.hoursPerWeek}
                    onChange={(e) =>
                      setHiredFormData({ ...hiredFormData, hoursPerWeek: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                      isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={hiredFormData.startDate}
                    onChange={(e) =>
                      setHiredFormData({ ...hiredFormData, startDate: e.target.value })
                    }
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                      isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowHiredModal(null)}
                  className={`flex-1 rounded-xl ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleHiredSubmit(showHiredModal)}
                  className={`flex-1 rounded-xl ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                >
                  Complete Quest!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Story Modal */}
      <AnimatePresence>
        {showSuccessStoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-2xl p-8 max-w-lg w-full ${isDark ? "bg-gray-900" : "bg-white"}`}
            >
              <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Share Your Success Story!
              </h3>
              <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Help inspire others on their career journey. Your story may be featured on Career Forward to motivate future job seekers.
              </p>

              <textarea
                value={successStory}
                onChange={(e) => setSuccessStory(e.target.value)}
                placeholder="Tell us about your journey... What challenges did you overcome? What advice do you have for others?"
                rows={6}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] resize-none ${
                  isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900"
                }`}
              />

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuccessStoryModal(false);
                    setSuccessStory("");
                    setRecentlyHiredApp(null);
                  }}
                  className={`flex-1 rounded-xl ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleSuccessStorySubmit}
                  disabled={!successStory.trim()}
                  className={`flex-1 rounded-xl disabled:opacity-50 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                >
                  Share Story
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Your Applications</h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Track and manage your job applications
          </p>
        </div>
        <Button className={`rounded-xl px-6 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}>
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </motion.div>

      {/* Status Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-2">
          {statusSummary.map((status, index) => {
            const isActive = filterStatus === status.id;
            const StatusIcon = getStatusIcon(status.id as JobApplication["status"]);
            return (
              <button
                key={status.id}
                onClick={() =>
                  setFilterStatus(filterStatus === status.id ? "all" : (status.id as StatusFilter))
                }
                className={`flex-1 rounded-xl p-4 border transition-all ${
                  isActive
                    ? "border-2"
                    : isDark ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white border-gray-100 hover:border-gray-200"
                }`}
                style={{
                  borderColor: isActive ? status.color : undefined,
                  backgroundColor: isActive ? (isDark ? "rgba(79, 209, 197, 0.1)" : `${status.color}08`) : undefined,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${status.color}20` }}
                  >
                    <StatusIcon className="h-4 w-4" style={{ color: status.color }} />
                  </div>
                  <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {status.label}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {status.count}
                </div>
                {index < statusSummary.length - 1 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2">
                    <ChevronRight className={`h-4 w-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
              isDark ? "bg-gray-900 border-gray-800 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900"
            }`}
          />
        </div>
        <Button variant="outline" className={`rounded-xl ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <div className={`flex gap-1 p-1 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded text-sm ${
              view === "list"
                ? isDark ? "bg-gray-700 shadow-sm text-white" : "bg-white shadow-sm text-gray-900"
                : isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("board")}
            className={`px-3 py-1.5 rounded text-sm ${
              view === "board"
                ? isDark ? "bg-gray-700 shadow-sm text-white" : "bg-white shadow-sm text-gray-900"
                : isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Board
          </button>
        </div>
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {filteredApplications.map((app) => {
          const statusConfig = getStatusConfig(app.status);
          const StatusIcon = getStatusIcon(app.status);
          const isExpanded = expandedAppId === app.id;

          return (
            <div
              key={app.id}
              className={`rounded-2xl border overflow-hidden transition-shadow ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-gray-700"
                  : "bg-white border-gray-100 hover:shadow-md"
              }`}
            >
              {/* Main Row */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Company Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  }`}>
                    <Building2 className={`h-6 w-6 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{app.job.title}</h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{app.job.company}</p>
                  </div>

                  {/* Location */}
                  <div className={`hidden md:flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <MapPin className="h-4 w-4" />
                    {app.job.location}
                  </div>

                  {/* Date Applied */}
                  <div className={`hidden md:flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <Calendar className="h-4 w-4" />
                    {app.appliedDate}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </span>

                  {/* Expand Icon */}
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${isDark ? "text-gray-500" : "text-gray-400"} ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-4 pb-4 border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Pay Range</p>
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {formatPay(app.job)}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Job Type</p>
                          <p className={`font-medium capitalize ${isDark ? "text-white" : "text-gray-900"}`}>
                            {app.job.hoursType}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Last Updated</p>
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {app.lastUpdated}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Source</p>
                          <a
                            href={app.job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium hover:underline inline-flex items-center gap-1 ${
                              isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
                            }`}
                          >
                            View Posting
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      {/* Notes */}
                      {app.notes && (
                        <div className={`rounded-xl p-3 mb-4 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                          <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Notes</p>
                          <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{app.notes}</p>
                        </div>
                      )}

                      {/* Hired Data */}
                      {app.status === "hired" && app.hiredData && (
                        <div className={`rounded-xl p-4 mb-4 border ${
                          isDark ? "bg-green-900/20 border-green-800" : "bg-green-50 border-green-200"
                        }`}>
                          <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                            isDark ? "text-green-400" : "text-green-800"
                          }`}>
                            <PartyPopper className="h-4 w-4" />
                            Hired Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className={isDark ? "text-green-500" : "text-green-600"}>Job Title</p>
                              <p className={`font-medium ${isDark ? "text-green-300" : "text-green-800"}`}>{app.hiredData.jobTitle}</p>
                            </div>
                            <div>
                              <p className={isDark ? "text-green-500" : "text-green-600"}>Wage</p>
                              <p className={`font-medium ${isDark ? "text-green-300" : "text-green-800"}`}>
                                ${app.hiredData.hourlyWage}/hr
                              </p>
                            </div>
                            <div>
                              <p className={isDark ? "text-green-500" : "text-green-600"}>Hours/Week</p>
                              <p className={`font-medium ${isDark ? "text-green-300" : "text-green-800"}`}>{app.hiredData.hoursPerWeek}</p>
                            </div>
                            <div>
                              <p className={isDark ? "text-green-500" : "text-green-600"}>Start Date</p>
                              <p className={`font-medium ${isDark ? "text-green-300" : "text-green-800"}`}>{app.hiredData.startDate}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status Update Buttons */}
                      {app.status !== "hired" && app.status !== "rejected" && (
                        <div>
                          <p className={`text-xs mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Update Status</p>
                          <div className="flex flex-wrap gap-2">
                            {jobStatuses
                              .filter((s) => s.id !== app.status)
                              .map((status) => {
                                const Icon = getStatusIcon(status.id as JobApplication["status"]);
                                return (
                                  <button
                                    key={status.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(app.id, status.id as JobApplication["status"]);
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                      isDark ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    style={{
                                      color: status.color,
                                    }}
                                  >
                                    <Icon className="h-3 w-3" />
                                    {status.label}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <div className={`rounded-2xl border p-12 text-center ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}>
            <Briefcase className={`h-8 w-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          </div>
          <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            No applications found
          </h3>
          <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Start applying to jobs from the Job Board"}
          </p>
          <Button className={`rounded-full ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}>
            Browse Job Board
          </Button>
        </div>
      )}
    </div>
  );
}
