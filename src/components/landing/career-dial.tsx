"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, DollarSign, TrendingUp, Briefcase, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import marketData from "@/../public/data/market-data.json";

type Region = "washington" | "spokane";

export function CareerDial() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const regionNames = {
    washington: "Washington State",
    spokane: "Spokane County",
  };

  // Get all occupations from selected region
  const allOccupations = useMemo(() => {
    if (!selectedRegion) return [];
    return marketData.regions[selectedRegion].occupations;
  }, [selectedRegion]);

  // Filter occupations based on search query
  const filteredOccupations = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return allOccupations
      .filter((occ: any) =>
        occ.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 8);
  }, [searchQuery, allOccupations]);

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    setSearchQuery(job.title);
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedRegion(null);
    setSearchQuery("");
    setSelectedJob(null);
    setShowResults(false);
  };

  return (
    <section id="career-dial" className="relative py-32 overflow-hidden bg-gradient-to-br from-white via-[#F3E8FF] to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,95,245,0.08),transparent_60%)]" />

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-[#7C5FF5]/30"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Free Career Explorer</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          >
            Explore Your Career{" "}
            <span className="text-[#7C5FF5]">Potential</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            See real-time salary and demand data for any career in your area
          </motion.p>
        </div>

        {/* Interactive Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Select Region */}
            {!selectedRegion && (
              <motion.div
                key="region-select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-8">
                  <MapPin className="w-6 h-6 text-[#7C5FF5]" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Where do you want to work?
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-4">
                  {(["washington", "spokane"] as Region[]).map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className="group relative bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] hover:from-[#6B4FE4] hover:to-[#9370ED] text-white rounded-2xl p-8 transition-all hover:scale-105 shadow-lg hover:shadow-2xl"
                    >
                      <div className="text-lg font-bold mb-2">{regionNames[region]}</div>
                      <div className="text-sm opacity-90">
                        {region === "washington" && "787 occupations tracked"}
                        {region === "spokane" && "634 occupations tracked"}
                      </div>
                      <ArrowRight className="absolute top-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                <Link href="/waitlist">
                  <button className="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#7C5FF5] text-gray-700 hover:text-[#7C5FF5] rounded-2xl px-6 py-3 transition-all hover:scale-105 shadow-md hover:shadow-lg font-medium">
                    Other Location
                    <ArrowRight className="inline-block ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </Link>
              </motion.div>
            )}

            {/* Step 2: Search Job */}
            {selectedRegion && !showResults && (
              <motion.div
                key="job-search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-6">
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:text-[#7C5FF5] transition-colors mb-4"
                  >
                    ← Change location
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-6 h-6 text-[#7C5FF5]" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      What career are you interested in?
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Searching in {regionNames[selectedRegion]}
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a job title (e.g., Software Developer, Nurse, Teacher)"
                    className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-[#7C5FF5] focus:ring-2 focus:ring-[#7C5FF5]/20 outline-none transition-all"
                    autoFocus
                  />
                </div>

                {/* Search Results Dropdown */}
                {filteredOccupations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    {filteredOccupations.map((occ: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleJobSelect(occ)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">{occ.title}</div>
                        <div className="text-sm text-gray-600">
                          ${occ.salary.median.toLocaleString()}/yr
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {searchQuery.length >= 2 && filteredOccupations.length === 0 && (
                  <div className="mt-4 text-center py-8 text-gray-500">
                    No matching careers found. Try a different search term.
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Show Results */}
            {showResults && selectedJob && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-[#7C5FF5] transition-colors mb-6"
                >
                  ← Start over
                </button>

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedJob.title}
                  </h3>
                  <p className="text-gray-600">in {regionNames[selectedRegion!]}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      ${selectedJob.salary.median.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Median Salary</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedJob.demand.avgAnnualOpenings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Annual Openings</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-[#7C5FF5] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedJob.employment.changePercent > 0 ? "+" : ""}
                      {selectedJob.employment.changePercent}%
                    </div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <h4 className="font-bold text-gray-900 mb-4">Career Outlook</h4>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Jobs:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {selectedJob.employment.current.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Projected (2026):</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {selectedJob.employment.projected.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-2xl p-8 text-white"
                >
                  <h4 className="text-2xl font-bold mb-3">Ready to Start Your Journey?</h4>
                  <p className="mb-6 text-white/90">
                    Join Career Forward to build your resume, track applications, and land your dream job as a {selectedJob.title}.
                  </p>
                  <Button
                    size="lg"
                    asChild
                    className="bg-white hover:bg-white/90 text-[#7C5FF5] rounded-full px-12 h-14 text-lg font-semibold shadow-lg hover:scale-105 transition-all"
                  >
                    <Link href="/waitlist">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Data Attribution - Lightcast Compliance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-[#7C5FF5]/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                Powered by{" "}
                <a
                  href="https://lightcast.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C5FF5] hover:underline"
                >
                  Lightcast
                </a>
              </span>{" "}
              • Last updated: {new Date(marketData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Lightcast
          </p>
        </motion.div>
      </div>
    </section>
  );
}
