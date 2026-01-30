"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Target,
  Building2,
  Users,
  BarChart3,
  Sparkles,
  CheckCircle2,
  FileText,
  MessageSquare,
  Briefcase,
} from "lucide-react";

const ADMIN_PASSWORD = "CFAdminPanel123!";

interface PreviewOverlayProps {
  children: React.ReactNode;
}

// Value propositions for each audience
const seekerValueProps = [
  { icon: FileText, label: "Resume Builder" },
  { icon: Briefcase, label: "Job Tracker" },
  { icon: MessageSquare, label: "Interview Prep" },
];

const orgValueProps = [
  { icon: Target, label: "AI-Powered Job Matching" },
  { icon: Users, label: "Caseload Management" },
  { icon: BarChart3, label: "Outcome Tracking" },
];

const seekerStats = [
  { value: "70%", label: "Placement Rate" },
  { value: "3 wks", label: "Avg Time to Hire" },
  { value: "Free", label: "For Job Seekers" },
];

const orgStats = [
  { value: "40%", label: "More Placements" },
  { value: "8 hrs", label: "Saved Weekly" },
  { value: "96%", label: "Coach Satisfaction" },
];

const heroContent = {
  seekers: {
    headline: "Land Your Dream Job",
    headlineAccent: "Faster",
    subheadline: "Build resumes, track applications, and prep for interviews. All in one place. Completely free.",
    video: "/hero-b2c.mp4",
  },
  organizations: {
    headline: "The Future of Workforce",
    headlineAccent: "Development",
    subheadline: "Empowering job seekers and career coaches with tools to accelerate career success.",
    video: "/hero-b2b.mp4",
  },
};

export function PreviewOverlay({ children }: PreviewOverlayProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [audience, setAudience] = useState<"seekers" | "organizations">("seekers");

  useEffect(() => {
    const unlocked = sessionStorage.getItem("cf_preview_unlocked");
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
    setIsLoading(false);
  }, []);

  const accentColor = audience === "seekers" ? "#2B8A8A" : "#374151";
  const currentContent = heroContent[audience];
  const currentValueProps = audience === "seekers" ? seekerValueProps : orgValueProps;
  const currentStats = audience === "seekers" ? seekerStats : orgStats;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      sessionStorage.setItem("cf_preview_unlocked", "true");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2B8A8A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFBFC]">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
          animate={{ backgroundColor: accentColor }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          animate={{ backgroundColor: accentColor }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={180}
              height={45}
              priority
            />
          </Link>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              background: `linear-gradient(to right, ${accentColor}10, ${accentColor}05)`,
              borderColor: `${accentColor}20`
            }}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentColor }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: accentColor }}></span>
            </span>
            <span className="text-sm font-semibold" style={{ color: accentColor }}>Launching Q3 2026</span>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              {/* Audience Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center lg:justify-start mb-8"
              >
                <div className="relative bg-white rounded-2xl p-1.5 shadow-xl shadow-gray-200/50 border border-gray-100">
                  <motion.div
                    className="absolute top-1.5 bottom-1.5 rounded-xl"
                    initial={false}
                    animate={{
                      x: audience === "seekers" ? 0 : "100%",
                      backgroundColor: accentColor,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    style={{ width: "calc(50% - 3px)", left: "6px" }}
                  />
                  <div className="relative flex">
                    <button
                      onClick={() => setAudience("seekers")}
                      className="relative z-10"
                    >
                      <div className="flex items-center gap-2 px-5 py-3">
                        <Target className={`w-4 h-4 transition-colors duration-300 ${
                          audience === "seekers" ? "text-white" : "text-gray-400"
                        }`} />
                        <div className="text-left">
                          <p className={`font-semibold text-sm transition-colors duration-300 ${
                            audience === "seekers" ? "text-white" : "text-gray-700"
                          }`}>
                            Job Seeker
                          </p>
                        </div>
                      </div>
                    </button>
                    <div className="w-px bg-gray-200 my-2" />
                    <button
                      onClick={() => setAudience("organizations")}
                      className="relative z-10"
                    >
                      <div className="flex items-center gap-2 px-5 py-3">
                        <Building2 className={`w-4 h-4 transition-colors duration-300 ${
                          audience === "organizations" ? "text-white" : "text-gray-400"
                        }`} />
                        <div className="text-left">
                          <p className={`font-semibold text-sm transition-colors duration-300 ${
                            audience === "organizations" ? "text-white" : "text-gray-700"
                          }`}>
                            Organization
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-6"
              >
                <Sparkles className="h-4 w-4" style={{ color: accentColor }} />
                <span className="text-sm font-medium text-gray-700">
                  {audience === "seekers" ? "100% Free for Job Seekers" : "Early Access Preview"}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6"
              >
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={audience}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-gray-900 mb-4"
                  >
                    {currentContent.headline}
                    <br />
                    <span className="relative inline-block" style={{ color: accentColor }}>
                      {currentContent.headlineAccent}
                      <motion.svg
                        className="absolute -bottom-1 left-0 w-full"
                        viewBox="0 0 200 8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        <motion.path
                          d="M2 6 Q 100 2 198 6"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </motion.svg>
                    </span>
                  </motion.h1>
                </AnimatePresence>
              </motion.div>

              {/* Subheadline */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${audience}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
                >
                  {currentContent.subheadline}
                </motion.p>
              </AnimatePresence>

              {/* Value Props */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-10"
              >
                <p className="text-sm font-medium text-gray-500 mb-3 text-center lg:text-left">
                  {audience === "seekers" ? "Everything you need:" : "Tools for your team:"}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {currentValueProps.map((prop, i) => (
                    <div
                      key={`${audience}-${i}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <prop.icon className="h-4 w-4" style={{ color: accentColor }} />
                      <span className="text-sm font-medium text-gray-700">{prop.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Login Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md mx-auto lg:mx-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}10` }}
                  >
                    <Lock className="h-5 w-5" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Preview Access</h3>
                    <p className="text-sm text-gray-500">Enter password to continue</p>
                  </div>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter preview password"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                      style={{
                        "--tw-ring-color": `${accentColor}20`,
                      } as React.CSSProperties}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 10px 25px ${accentColor}25`
                    }}
                  >
                    Access Preview
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Right Side - Video in MacBook with Stats */}
            <div className="flex flex-col items-center gap-8">
              {/* MacBook Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-2xl"
              >
                <div className="relative">
                  {/* Screen bezel */}
                  <div className="bg-[#1a1a1a] rounded-t-2xl p-2 pb-0 shadow-2xl">
                    {/* Menu bar */}
                    <div className="flex items-center justify-between px-2 pb-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-[#ff5f57] rounded-full" />
                        <div className="w-3 h-3 bg-[#febc2e] rounded-full" />
                        <div className="w-3 h-3 bg-[#28c840] rounded-full" />
                      </div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full" />
                      <div className="w-[54px]" />
                    </div>

                    {/* Screen */}
                    <div className="relative overflow-hidden bg-black rounded-sm">
                      <AnimatePresence mode="wait">
                        <motion.video
                          key={audience}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full aspect-video object-cover block"
                        >
                          <source src={currentContent.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </motion.video>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* MacBook bottom/hinge */}
                  <div className="relative">
                    <div className="bg-gradient-to-b from-[#3d3d3d] to-[#262626] h-5 rounded-b-xl" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#1a1a1a] rounded-b-lg" />
                  </div>

                  {/* Shadow */}
                  <div className="mx-auto w-4/5 h-4 bg-gradient-to-b from-black/15 to-transparent rounded-full blur-lg mt-1" />
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center gap-8"
              >
                {currentStats.map((stat, i) => (
                  <div key={`${audience}-stat-${i}`} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold" style={{ color: accentColor }}>{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: accentColor }} />
                  <span>{audience === "seekers" ? "Free for job seekers" : "Easy onboarding"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: accentColor }} />
                  <span>{audience === "seekers" ? "No credit card required" : "Real-time tracking"}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <span>© 2026 Career Forward. All rights reserved.</span>
          <span>A Martin Built Strategies Product</span>
        </div>
      </div>
    </div>
  );
}
