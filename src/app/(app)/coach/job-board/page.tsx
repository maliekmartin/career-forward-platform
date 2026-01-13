"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Briefcase,
  X,
  RefreshCw,
  Laptop,
  Sparkles,
  Share2,
  MessageSquare,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockJobs,
  Job,
  formatPay,
  formatJobDate,
  getSourceInfo,
} from "@/lib/job-data";
import { demoClients } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";

type Category = "all" | "healthcare" | "manufacturing" | "admin" | "retail";
type Source = "all" | "worksourcewa" | "indeed" | "linkedin" | "governmentjobs";
type HoursType = "all" | "full-time" | "part-time" | "contract" | "temporary";

export default function CoachJobBoardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedSource, setSelectedSource] = useState<Source>("all");
  const [selectedHoursType, setSelectedHoursType] = useState<HoursType>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "pay-high" | "pay-low">("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Share modal state
  const [shareModalJob, setShareModalJob] = useState<Job | null>(null);
  const [shareMethod, setShareMethod] = useState<"message" | "task" | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let jobs = [...mockJobs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      jobs = jobs.filter((job) => job.category === selectedCategory);
    }

    // Source filter
    if (selectedSource !== "all") {
      jobs = jobs.filter((job) => job.source === selectedSource);
    }

    // Hours type filter
    if (selectedHoursType !== "all") {
      jobs = jobs.filter((job) => job.hoursType === selectedHoursType);
    }

    // Remote filter
    if (remoteOnly) {
      jobs = jobs.filter((job) => job.remote);
    }

    // Sort
    if (sortBy === "newest") {
      jobs.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
    } else if (sortBy === "pay-high") {
      jobs.sort((a, b) => {
        const aMax = a.payType === "hourly" ? a.payMax * 2080 : a.payMax;
        const bMax = b.payType === "hourly" ? b.payMax * 2080 : b.payMax;
        return bMax - aMax;
      });
    } else if (sortBy === "pay-low") {
      jobs.sort((a, b) => {
        const aMin = a.payType === "hourly" ? a.payMin * 2080 : a.payMin;
        const bMin = b.payType === "hourly" ? b.payMin * 2080 : b.payMin;
        return aMin - bMin;
      });
    }

    return jobs;
  }, [searchQuery, selectedCategory, selectedSource, selectedHoursType, remoteOnly, sortBy]);

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "healthcare", label: "Healthcare" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "admin", label: "Admin & Office" },
    { value: "retail", label: "Retail & Service" },
  ];

  const sourceOptions = [
    { value: "all", label: "All Sources" },
    { value: "worksourcewa", label: "WorkSource WA" },
    { value: "indeed", label: "Indeed" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "governmentjobs", label: "Government Jobs" },
  ];

  const hoursOptions = [
    { value: "all", label: "All Types" },
    { value: "full-time", label: "Full-Time" },
    { value: "part-time", label: "Part-Time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
  ];

  const handleShare = (job: Job) => {
    setShareModalJob(job);
    setShareMethod(null);
    setSelectedClient(null);
  };

  const handleShareConfirm = () => {
    if (!shareModalJob || !shareMethod || !selectedClient) return;

    const client = demoClients.find((c) => c.id === selectedClient);
    if (!client) return;

    // In a real app, this would send the message or create a task
    setShowSuccessToast(
      shareMethod === "message"
        ? `Job shared with ${client.firstName} via message`
        : `Job assigned to ${client.firstName} as a task`
    );
    setShareModalJob(null);
    setShareMethod(null);
    setSelectedClient(null);

    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSource("all");
    setSelectedHoursType("all");
    setRemoteOnly(false);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSource !== "all" ||
    selectedHoursType !== "all" ||
    remoteOnly ||
    searchQuery;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <p className="font-medium">{showSuccessToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShareModalJob(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                    Share Job
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {shareModalJob.title} at {shareModalJob.company}
                  </p>
                </div>
                <button
                  onClick={() => setShareModalJob(null)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              </div>

              {/* Share Method Selection */}
              {!shareMethod && (
                <div className="space-y-3">
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    How would you like to share this job?
                  </p>
                  <button
                    onClick={() => setShareMethod("message")}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isDark
                        ? "border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                      <MessageSquare className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        Send via Message
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Share with a clickable link in messages
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setShareMethod("task")}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isDark
                        ? "border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                      <Briefcase className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        Assign as Task
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Add to job seeker's task list to review
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Client Selection */}
              {shareMethod && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => {
                        setShareMethod(null);
                        setSelectedClient(null);
                      }}
                      className={`text-sm ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"} hover:underline`}
                    >
                      Back
                    </button>
                    <span className={isDark ? "text-gray-600" : "text-gray-300"}>/</span>
                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {shareMethod === "message" ? "Send via Message" : "Assign as Task"}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Select a job seeker:
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {demoClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          selectedClient === client.id
                            ? isDark
                              ? "bg-[#4FD1C5]/20 border-[#4FD1C5] border"
                              : "bg-[#2B8A8A]/10 border-[#2B8A8A] border"
                            : isDark
                            ? "border border-gray-700 hover:bg-gray-700"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={client.avatar}
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left flex-1">
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {client.firstName} {client.lastName}
                          </p>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {client.currentMilestone.replace("-", " ")}
                          </p>
                        </div>
                        {selectedClient === client.id && (
                          <CheckCircle2 className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleShareConfirm}
                    disabled={!selectedClient}
                    className={`w-full mt-4 rounded-xl ${
                      selectedClient
                        ? "bg-[#2B8A8A] hover:bg-[#237070] text-white"
                        : isDark
                        ? "bg-gray-700 text-gray-500"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {shareMethod === "message" ? "Send Message" : "Assign Task"}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Job Board
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Find opportunities to share with your job seekers
            </p>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            <RefreshCw className="h-4 w-4" />
            <span>Auto-updates every 1-2 hours</span>
          </div>
        </div>

        {/* Source Badges */}
        <div className="flex items-center gap-3 mt-4">
          <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>Aggregating from:</span>
          {["worksourcewa", "indeed", "linkedin", "governmentjobs"].map((source) => {
            const info = getSourceInfo(source as Job["source"]);
            return (
              <span
                key={source}
                className={`text-xs px-3 py-1 rounded-full ${info.bgColor}`}
                style={{ color: info.color }}
              >
                {info.name}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4 mb-6"
      >
        <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white border border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-blue-500/20" : "bg-blue-100"}`}>
              <Briefcase className={`h-5 w-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {mockJobs.length}
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Jobs</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white border border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
              <Users className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {demoClients.length}
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Job Seekers</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white border border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-green-500/20" : "bg-green-100"}`}>
              <Laptop className={`h-5 w-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {mockJobs.filter((j) => j.remote).length}
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Remote Jobs</p>
            </div>
          </div>
        </div>
        <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white border border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
              <Share2 className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                12
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Shared This Week</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-6 ${
          isDark ? "bg-gray-800" : "bg-white border border-gray-100"
        }`}
      >
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`} />
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-lg transition-colors ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#4FD1C5]/30 focus:border-[#4FD1C5]"
                  : "bg-gray-50 border-gray-200 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A]"
              } border focus:outline-none focus:ring-2`}
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`rounded-xl px-6 ${
              showFilters
                ? isDark
                  ? "bg-[#4FD1C5]/20 border-[#4FD1C5] text-[#4FD1C5]"
                  : "bg-[#2B8A8A]/10 border-[#2B8A8A] text-[#2B8A8A]"
                : isDark
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : ""
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className={`ml-2 w-2 h-2 rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`} />
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <div className="grid grid-cols-5 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as Category)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-[#4FD1C5]"
                          : "bg-gray-50 border-gray-200 focus:border-[#2B8A8A]"
                      } focus:outline-none focus:ring-2 ${
                        isDark ? "focus:ring-[#4FD1C5]/30" : "focus:ring-[#2B8A8A]/20"
                      }`}
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Source Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Source
                    </label>
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value as Source)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-[#4FD1C5]"
                          : "bg-gray-50 border-gray-200 focus:border-[#2B8A8A]"
                      } focus:outline-none focus:ring-2 ${
                        isDark ? "focus:ring-[#4FD1C5]/30" : "focus:ring-[#2B8A8A]/20"
                      }`}
                    >
                      {sourceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hours Type Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Job Type
                    </label>
                    <select
                      value={selectedHoursType}
                      onChange={(e) => setSelectedHoursType(e.target.value as HoursType)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-[#4FD1C5]"
                          : "bg-gray-50 border-gray-200 focus:border-[#2B8A8A]"
                      } focus:outline-none focus:ring-2 ${
                        isDark ? "focus:ring-[#4FD1C5]/30" : "focus:ring-[#2B8A8A]/20"
                      }`}
                    >
                      {hoursOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-[#4FD1C5]"
                          : "bg-gray-50 border-gray-200 focus:border-[#2B8A8A]"
                      } focus:outline-none focus:ring-2 ${
                        isDark ? "focus:ring-[#4FD1C5]/30" : "focus:ring-[#2B8A8A]/20"
                      }`}
                    >
                      <option value="newest">Newest First</option>
                      <option value="pay-high">Highest Pay</option>
                      <option value="pay-low">Lowest Pay</option>
                    </select>
                  </div>

                  {/* Remote Toggle */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Remote
                    </label>
                    <button
                      onClick={() => setRemoteOnly(!remoteOnly)}
                      className={`w-full px-3 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                        remoteOnly
                          ? isDark
                            ? "bg-[#4FD1C5] text-gray-900 border-[#4FD1C5]"
                            : "bg-[#2B8A8A] text-white border-[#2B8A8A]"
                          : isDark
                          ? "bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Laptop className="h-4 w-4" />
                      Remote Only
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {filteredJobs.length} jobs match your criteria
                    </span>
                    <button
                      onClick={clearFilters}
                      className={`text-sm flex items-center gap-1 hover:underline ${
                        isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
                      }`}
                    >
                      <X className="h-3 w-3" />
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
        </p>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => {
          const sourceInfo = getSourceInfo(job.source);

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * Math.min(index, 10) }}
              className={`rounded-2xl p-6 transition-all group ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600"
                  : "bg-white border border-gray-100 hover:shadow-lg hover:border-gray-200"
              }`}
            >
              <div className="flex items-start gap-6">
                {/* Company Logo Placeholder */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDark ? "bg-gray-700 group-hover:bg-gray-600" : "bg-gray-100 group-hover:bg-gray-50"
                }`}>
                  <Building2 className={`h-8 w-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-lg font-semibold transition-colors ${
                        isDark
                          ? "text-white group-hover:text-[#4FD1C5]"
                          : "text-gray-900 group-hover:text-[#2B8A8A]"
                      }`}>
                        {job.title}
                      </h3>
                      <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {job.company}
                      </p>
                    </div>

                    {/* Source Badge */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ${sourceInfo.bgColor}`}
                      style={{ color: sourceInfo.color }}
                    >
                      {sourceInfo.name}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className={`flex flex-wrap items-center gap-4 mt-3 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatPay(job)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.hoursType.charAt(0).toUpperCase() + job.hoursType.slice(1)}
                      {job.hoursPerWeek && ` (${job.hoursPerWeek} hrs/wk)`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {formatJobDate(job.datePosted)}
                    </span>
                    {job.remote && (
                      <span className={`flex items-center gap-1 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
                        <Laptop className="h-4 w-4" />
                        Remote
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className={`mt-3 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {job.description}
                  </p>

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.benefits.slice(0, 4).map((benefit) => (
                        <span
                          key={benefit}
                          className={`text-xs px-2 py-1 rounded ${
                            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {benefit}
                        </span>
                      ))}
                      {job.benefits.length > 4 && (
                        <span className={`text-xs px-2 py-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                          +{job.benefits.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Share Button - Subtle version */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleShare(job)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isDark
                        ? "text-[#4FD1C5] hover:bg-[#4FD1C5]/10 border border-gray-700 hover:border-[#4FD1C5]/50"
                        : "text-[#2B8A8A] hover:bg-[#2B8A8A]/10 border border-gray-200 hover:border-[#2B8A8A]/50"
                    }`}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl p-12 text-center ${
            isDark ? "bg-gray-800" : "bg-white border border-gray-100"
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <Search className={`h-8 w-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          </div>
          <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            No jobs found
          </h3>
          <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Try adjusting your search or filters to find more opportunities
          </p>
          <Button
            onClick={clearFilters}
            className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-full"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}

      {/* Load More Hint */}
      {filteredJobs.length > 0 && (
        <div className={`text-center mt-8 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          <p className="text-sm">
            Showing all {filteredJobs.length} matching jobs
          </p>
          <p className="text-xs mt-1 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" />
            New jobs added automatically from connected platforms
          </p>
        </div>
      )}
    </div>
  );
}
