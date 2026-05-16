"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, MessageSquare, Target, Sparkles } from "lucide-react";
import { InteractiveDashboardDemo } from "@/components/landing/interactive-dashboard-demo";
// LIGHTCAST REMOVED - Commented out pending future data source decision
// import { MarketIntelligence } from "@/components/landing/market-intelligence";
// import { CareerDial } from "@/components/landing/career-dial";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div ref={containerRef} className="bg-white text-gray-900 overflow-hidden">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#7C5FF5]/10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex h-20 items-center justify-between px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/logo.svg"
              alt="Career Forward"
              width={180}
              height={50}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              Features
            </Link>
            <Link href="#career-dial" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              Career Explorer
            </Link>
            <Link href="#market-data" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              Market Data
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex text-gray-600 hover:text-[#7C5FF5] hover:bg-[#A78BFA]/10"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-8 h-11 shadow-lg shadow-[#7C5FF5]/30"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Reimagined Layout */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#F3E8FF] via-white to-[#E9D5FF] pt-32 pb-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,95,245,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(167,139,250,0.12),transparent_60%)]" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-[1600px] mx-auto px-8 w-full"
        >
          {/* Hero Text - Centered at Top */}
          <div className="text-center mb-16 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 bg-[#7C5FF5]/10 border border-[#7C5FF5]/20 rounded-full px-5 py-2.5 mb-8 backdrop-blur-xl">
                <div className="w-2 h-2 bg-[#7C5FF5] rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-[#7C5FF5]">Launching Q2 2027</span>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8 text-gray-900">
                Land your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                  dream job
                </span>{" "}
                faster
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Build resumes, track applications, ace interviews. All in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-12 h-16 text-lg shadow-2xl shadow-[#7C5FF5]/50 hover:shadow-[#7C5FF5]/70 transition-all hover:scale-105"
                >
                  <Link href="/waitlist">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Interactive Platform Demo - Full Width Below */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <InteractiveDashboardDemo />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#7C5FF5]/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature 1: Resume Builder - Diagonal Split */}
      <section id="how-it-works" className="relative py-40 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#F3E8FF]/30 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-[#7C5FF5]/20 border border-[#7C5FF5]/30 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-[#7C5FF5]">01 - Resume Builder</span>
              </div>
              <h2 className="text-6xl font-bold mb-6 leading-tight text-gray-900">
                Build resumes that
                <br />
                <span className="text-[#7C5FF5]">get noticed</span>
              </h2>
              <p className="text-xl text-gray-900 mb-8 leading-relaxed">
                AI-powered resume builder with ATS optimization. Our 100-point Career Forward Score analyzes your resume in real-time and tells you exactly what to improve.
              </p>

              {/* Score breakdown cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-[#7C5FF5]/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7C5FF5] flex items-center justify-center">
                      <span className="text-white text-sm font-bold">30</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Resume Quality</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-800">
                    <li className="flex items-start gap-2">
                      <span className="text-[#7C5FF5] mt-0.5">•</span>
                      <span>Formatting & Structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#7C5FF5] mt-0.5">•</span>
                      <span>Spelling & Grammar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#7C5FF5] mt-0.5">•</span>
                      <span>Length & Brevity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#7C5FF5] mt-0.5">•</span>
                      <span>Relevance & Clarity</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#A78BFA]/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A78BFA] flex items-center justify-center">
                      <span className="text-white text-sm font-bold">70</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Career Profile</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-gray-800">
                    <li className="flex items-start gap-2">
                      <span className="text-[#A78BFA] mt-0.5">•</span>
                      <span>Education & Credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#A78BFA] mt-0.5">•</span>
                      <span>Work History & Tenure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#A78BFA] mt-0.5">•</span>
                      <span>Employment Gaps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#A78BFA] mt-0.5">•</span>
                      <span>Market Demand Match</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ATS Features */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <h3 className="font-bold text-gray-900">ATS-Optimized Templates</h3>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  Professional designs that pass Applicant Tracking Systems used by 90% of employers. Clean formatting, proper keyword placement, and machine-readable structure ensure your resume gets seen by human recruiters.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  { title: "Real-time AI feedback", desc: "Get instant suggestions as you build your resume" },
                  { title: "Multiple tailored versions", desc: "Create up to 3 resumes optimized for different roles" }
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-[#7C5FF5] rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-gray-900 font-medium mb-0.5">{item.title}</div>
                      <div className="text-gray-800 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Cover Letters */}
              <div className="bg-gradient-to-br from-[#F3E8FF] to-white rounded-xl p-4 border border-[#7C5FF5]/20 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#7C5FF5] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Job-Matched Cover Letters</h3>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Generate personalized, professional cover letters tailored to each job posting. Our AI analyzes the job description and highlights your most relevant experience to help you stand out.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotate: -3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white/90 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-3xl p-6 shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                {/* Professional resume mockup */}
                <div className="aspect-[8.5/11] bg-white rounded-xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
                  {/* Score badge - top right corner */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl px-4 py-2 shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">87</div>
                        <div className="text-[10px] font-medium opacity-90">ATS Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Header - Name and contact */}
                    <div className="border-b-2 border-[#7C5FF5] pb-3">
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">SARAH JOHNSON</h1>
                      <p className="text-sm text-gray-600">Senior Marketing Manager</p>
                      <div className="flex gap-3 text-xs text-gray-500 mt-2">
                        <span>Seattle, WA</span>
                        <span>•</span>
                        <span>sarah.j@email.com</span>
                        <span>•</span>
                        <span>(206) 555-0123</span>
                      </div>
                    </div>

                    {/* Summary section */}
                    <div>
                      <h2 className="text-sm font-bold text-[#7C5FF5] mb-2 uppercase tracking-wide">Professional Summary</h2>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded w-full" />
                        <div className="h-2 bg-gray-200 rounded w-[95%]" />
                        <div className="h-2 bg-gray-200 rounded w-[90%]" />
                      </div>
                    </div>

                    {/* Experience section */}
                    <div>
                      <h2 className="text-sm font-bold text-[#7C5FF5] mb-2 uppercase tracking-wide">Experience</h2>
                      <div className="space-y-3">
                        {/* Job 1 */}
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="h-2.5 bg-gray-800 rounded w-40 mb-1" />
                              <div className="h-2 bg-gray-500 rounded w-32" />
                            </div>
                            <div className="h-2 bg-gray-400 rounded w-20" />
                          </div>
                          <ul className="space-y-1 mt-2">
                            <li className="flex gap-2">
                              <span className="text-[#7C5FF5] mt-0.5">•</span>
                              <div className="flex-1 space-y-0.5">
                                <div className="h-1.5 bg-gray-300 rounded w-full" />
                                <div className="h-1.5 bg-gray-200 rounded w-[85%]" />
                              </div>
                            </li>
                            <li className="flex gap-2">
                              <span className="text-[#7C5FF5] mt-0.5">•</span>
                              <div className="flex-1 space-y-0.5">
                                <div className="h-1.5 bg-gray-300 rounded w-full" />
                                <div className="h-1.5 bg-gray-200 rounded w-[75%]" />
                              </div>
                            </li>
                          </ul>
                        </div>

                        {/* Job 2 */}
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="h-2.5 bg-gray-800 rounded w-36 mb-1" />
                              <div className="h-2 bg-gray-500 rounded w-28" />
                            </div>
                            <div className="h-2 bg-gray-400 rounded w-20" />
                          </div>
                          <ul className="space-y-1 mt-2">
                            <li className="flex gap-2">
                              <span className="text-[#7C5FF5] mt-0.5">•</span>
                              <div className="flex-1 h-1.5 bg-gray-300 rounded w-[90%]" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Skills section */}
                    <div>
                      <h2 className="text-sm font-bold text-[#7C5FF5] mb-2 uppercase tracking-wide">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#F3E8FF] text-[#7C5FF5] text-xs font-medium rounded-full border border-[#7C5FF5]/20">Digital Marketing</span>
                        <span className="px-3 py-1 bg-[#E9D5FF] text-[#7C5FF5] text-xs font-medium rounded-full border border-[#A78BFA]/20">SEO/SEM</span>
                        <span className="px-3 py-1 bg-[#F3E8FF] text-[#7C5FF5] text-xs font-medium rounded-full border border-[#7C5FF5]/20">Analytics</span>
                        <span className="px-3 py-1 bg-[#E9D5FF] text-[#7C5FF5] text-xs font-medium rounded-full border border-[#A78BFA]/20">Team Leadership</span>
                      </div>
                    </div>
                  </div>

                  {/* ATS Optimized badge at bottom */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs font-medium text-green-700">ATS Optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 2: Job Tracker - Reverse Layout */}
      <section id="features" className="relative py-40 overflow-hidden bg-gradient-to-tr from-[#E9D5FF] to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.15),transparent_60%)]" />
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotate: 3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-3xl p-6 shadow-2xl transform rotate-[3deg] hover:rotate-0 transition-transform duration-500">
                {/* Job tracker mockup */}
                <div className="aspect-video bg-white rounded-2xl p-5 border border-[#7C5FF5]/10">
                  {/* Stats header */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-gradient-to-br from-[#F3E8FF] to-white rounded-lg p-2 border border-[#7C5FF5]/10">
                      <div className="text-lg font-bold text-gray-900">12</div>
                      <div className="text-[9px] text-gray-500">Total Applied</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#E9D5FF] to-white rounded-lg p-2 border border-[#A78BFA]/10">
                      <div className="text-lg font-bold text-[#7C5FF5]">3</div>
                      <div className="text-[9px] text-gray-500">Interviewing</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-2 border border-green-200/50">
                      <div className="text-lg font-bold text-green-600">1</div>
                      <div className="text-[9px] text-gray-500">Offers</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-2 border border-amber-200/50">
                      <div className="text-lg font-bold text-amber-600">0</div>
                      <div className="text-[9px] text-gray-500">Hired</div>
                    </div>
                  </div>

                  {/* Job entries with stoplight colors */}
                  <div className="space-y-2">
                    {/* Green - Active */}
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">Senior Marketing Manager</div>
                        <div className="text-[10px] text-gray-500">Tech Corp • San Francisco, CA</div>
                      </div>
                      <div className="text-[9px] text-gray-400">2d ago</div>
                    </div>

                    {/* Green - Active */}
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2.5">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">Product Designer</div>
                        <div className="text-[10px] text-gray-500">Innovate Inc • Remote</div>
                      </div>
                      <div className="text-[9px] text-gray-400">3d ago</div>
                    </div>

                    {/* Yellow - Pending */}
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2.5">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">Content Strategist</div>
                        <div className="text-[10px] text-gray-500">StartUp Co • New York, NY</div>
                      </div>
                      <div className="text-[9px] text-gray-400">5d ago</div>
                    </div>

                    {/* Red - Closed */}
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2.5 opacity-60">
                      <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">Brand Manager</div>
                        <div className="text-[10px] text-gray-500">Global Brands • Boston, MA</div>
                      </div>
                      <div className="text-[9px] text-gray-400">1w ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-block bg-[#6366F1]/20 border border-[#6366F1]/30 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-[#6366F1]">02 - Job Tracker</span>
              </div>
              <h2 className="text-6xl font-bold mb-6 leading-tight text-gray-900">
                Never lose track
                <br />
                <span className="text-[#7C5FF5]">of an opportunity</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Organize every application with our intuitive stoplight status system. Track interviews, follow-ups, and offers all in one place.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-white/80 rounded-xl p-4 backdrop-blur-xl border border-[#7C5FF5]/10">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">Active</div>
                    <div className="text-gray-600 text-sm">Applications you're actively pursuing with upcoming interviews or responses</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/80 rounded-xl p-4 backdrop-blur-xl border border-[#7C5FF5]/10">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">Pending</div>
                    <div className="text-gray-600 text-sm">Submitted applications waiting for a response or next steps</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/80 rounded-xl p-4 backdrop-blur-xl border border-[#7C5FF5]/10">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-medium mb-1">Closed</div>
                    <div className="text-gray-600 text-sm">Completed applications - offers accepted, rejected, or withdrawn</div>
                  </div>
                </div>
              </div>

              {/* Chrome Extension Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-2xl p-6 text-white shadow-lg mt-8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-3">
                      <span className="text-xs font-semibold">Coming Soon</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Chrome Extension</h3>
                    <p className="text-white/90 leading-relaxed mb-3">
                      Automatically track every job you apply for across Indeed, LinkedIn, and other major job boards. The Career Forward extension saves applications directly to your profile with no manual entry needed.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium">Indeed</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium">LinkedIn</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium">Glassdoor</span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium">ZipRecruiter</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LIGHTCAST REMOVED - Commented out pending future data source decision */}
      {/* Career Exploration Tool */}
      {/* <CareerDial /> */}

      {/* Market Intelligence */}
      {/* <MarketIntelligence /> */}

      {/* Feature 3: AI Career Coach - Compass */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-white via-[#F3E8FF] to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,95,245,0.08),transparent_60%)]" />

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Compass Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C5FF5]/20 to-[#A78BFA]/20 rounded-full blur-3xl" />
                <Image
                  src="/compass-ai.svg"
                  alt="Compass AI Assistant"
                  width={500}
                  height={500}
                  className="relative z-10 w-full max-w-md mx-auto"
                />
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-[#7C5FF5]/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">AI-Powered Career Assistant</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Meet{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                  Compass AI
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your 24/7 AI career assistant that provides instant answers, personalized advice, and expert guidance to help you land your dream job.
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 bg-white/80 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-2xl p-5 shadow-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Resume Optimization</h3>
                    <p className="text-gray-600 text-sm">Get instant feedback on your resume with actionable suggestions to improve your score and ATS compatibility</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4 bg-white/80 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-2xl p-5 shadow-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Interview Preparation</h3>
                    <p className="text-gray-600 text-sm">Practice common interview questions and get personalized coaching tailored to your specific role and industry</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4 bg-white/80 backdrop-blur-xl border border-[#7C5FF5]/20 rounded-2xl p-5 shadow-sm"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">Strategic Career Guidance</h3>
                    <p className="text-gray-600 text-sm">Develop a personalized job search strategy and receive expert guidance on navigating your career path</p>
                  </div>
                </motion.div>
              </div>

              <Button
                size="lg"
                asChild
                className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-10 h-14 text-base shadow-lg shadow-[#7C5FF5]/30 hover:scale-105 transition-all"
              >
                <Link href="/waitlist">
                  Get Early Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats - Subtle inline section */}
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="bg-gradient-to-br from-[#F3E8FF] to-white backdrop-blur-xl border border-[#7C5FF5]/20 rounded-3xl p-12">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-5xl font-bold text-gray-900 mb-3">100-Point</div>
                <div className="text-gray-600">Career Forward Score</div>
                <div className="text-gray-500 text-sm mt-2">Real-time resume analysis</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-5xl font-bold text-gray-900 mb-3">5-Stage</div>
                <div className="text-gray-600">Career Pathway</div>
                <div className="text-gray-500 text-sm mt-2">From discovery to employment</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-5xl font-bold text-[#7C5FF5] mb-3">24/7</div>
                <div className="text-gray-600">AI Career Coach</div>
                <div className="text-gray-500 text-sm mt-2">Personalized guidance anytime</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 mb-6 backdrop-blur-xl">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white">Launching Q2 2027</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Accelerate Your Job Search?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands on the waitlist for exclusive early access to Career Forward.
            </p>
            <p className="text-sm text-white/70 mb-10 max-w-xl mx-auto">
              Be among the first to experience the complete platform when we launch. No payment required.
            </p>

            <Button
              size="lg"
              asChild
              className="bg-white hover:bg-white/90 text-[#7C5FF5] rounded-full px-12 h-14 text-lg font-semibold shadow-2xl hover:scale-105 transition-all"
            >
              <Link href="/waitlist">
                Join the Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#F3E8FF] to-white border-t border-[#7C5FF5]/10 py-16">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <Image
                src="/branding/logo.svg"
                alt="Career Forward"
                width={210}
                height={60}
                className="mb-4"
              />
              <p className="text-[#7C5FF5] font-semibold text-lg mb-3">
                Your Path to Employment
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI-powered tools to help you build resumes, track applications, and land your dream job.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/#how-it-works" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/#features" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#market-data" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Market Data
                  </Link>
                </li>
                <li>
                  <Link href="/waitlist" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Join Waitlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h3 className="text-gray-900 font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@martinbuiltstrategies.com" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#7C5FF5]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Career Forward. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-600">Launching Q2 2027</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
