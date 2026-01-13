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
  ExternalLink,
  Briefcase,
  ChevronDown,
  X,
  RefreshCw,
  Laptop,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockJobs,
  Job,
  formatPay,
  formatJobDate,
  getSourceInfo,
} from "@/lib/job-data";
import { useJobApplications } from "@/lib/job-applications-context";
import { useTheme } from "@/lib/theme-context";

type Category = "all" | "healthcare" | "manufacturing" | "admin" | "retail";
type Source = "all" | "worksourcewa" | "indeed" | "linkedin" | "governmentjobs";
type HoursType = "all" | "full-time" | "part-time" | "contract" | "temporary";

export default function JobBoardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { addApplication, isJobApplied } = useJobApplications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedSource, setSelectedSource] = useState<Source>("all");
  const [selectedHoursType, setSelectedHoursType] = useState<HoursType>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "pay-high" | "pay-low">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
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

  const handleApply = async (job: Job) => {
    setApplyingJobId(job.id);

    // Simulate adding to job tracker
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Add to job applications context
    addApplication(job);
    setApplyingJobId(null);
    setShowSuccessToast(job.title);

    // Open job source in new tab
    window.open(job.sourceUrl, "_blank");

    // Hide toast after 3 seconds
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
              <p className="font-medium">Added to Job Tracker!</p>
              <p className="text-sm text-green-100">{showSuccessToast}</p>
            </div>
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
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Job Board</h1>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Discover opportunities from top job platforms
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

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl border p-6 mb-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
      >
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] text-lg ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`rounded-xl px-6 ${showFilters ? "bg-[#2B8A8A]/10 border-[#2B8A8A] text-[#2B8A8A]" : ""}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-[#2B8A8A] rounded-full" />
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
              <div className={`pt-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <div className="grid grid-cols-5 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as Category)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
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
                          ? "bg-[#2B8A8A] text-white border-[#2B8A8A]"
                          : isDark
                            ? "bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600"
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
                      className="text-sm text-[#2B8A8A] hover:underline flex items-center gap-1"
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
          const isApplied = isJobApplied(job.id);
          const isApplying = applyingJobId === job.id;

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * Math.min(index, 10) }}
              className={`rounded-2xl border p-6 transition-all group ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-gray-700"
                  : "bg-white border-gray-100 hover:shadow-lg hover:border-gray-200"
              }`}
            >
              <div className="flex items-start gap-6">
                {/* Company Logo Placeholder */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDark ? "bg-gray-800 group-hover:bg-gray-700" : "bg-gray-100 group-hover:bg-gray-50"
                }`}>
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-lg font-semibold group-hover:text-[#2B8A8A] transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                        {job.title}
                      </h3>
                      <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{job.company}</p>
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
                  <div className={`flex flex-wrap items-center gap-4 mt-3 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
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
                      <span className="flex items-center gap-1 text-[#2B8A8A]">
                        <Laptop className="h-4 w-4" />
                        Remote
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className={`mt-3 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{job.description}</p>

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.benefits.slice(0, 4).map((benefit) => (
                        <span
                          key={benefit}
                          className={`text-xs px-2 py-1 rounded ${
                            isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
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

                {/* Apply Button */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {isApplied ? (
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      Applied
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleApply(job)}
                      disabled={isApplying}
                      className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl px-6 py-6 h-auto"
                    >
                      {isApplying ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  )}
                  <span className="text-xs text-gray-400">
                    Opens in new tab
                  </span>
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
          className={`rounded-2xl border p-12 text-center ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}>
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No jobs found</h3>
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
          <p className={`text-xs mt-1 flex items-center justify-center gap-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            <Sparkles className="h-3 w-3" />
            New jobs added automatically from connected platforms
          </p>
        </div>
      )}
    </div>
  );
}
