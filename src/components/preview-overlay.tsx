"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";

const ADMIN_PASSWORD = "CF@Preview2026!MBS";

interface PreviewOverlayProps {
  children: React.ReactNode;
}

// Value propositions matching landing page
const valueProps = [
  { icon: Target, label: "AI-Powered Job Matching" },
  { icon: Users, label: "Caseload Management" },
  { icon: BarChart3, label: "Outcome Tracking" },
];

const stats = [
  { value: "70%", label: "Placement Rate" },
  { value: "3 wks", label: "Avg Time to Hire" },
  { value: "Free", label: "For Job Seekers" },
];

export function PreviewOverlay({ children }: PreviewOverlayProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unlocked = sessionStorage.getItem("cf_preview_unlocked");
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
    setIsLoading(false);
  }, []);

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
      {/* Gradient Background - matching landing page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 bg-[#2B8A8A]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-[#2B8A8A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl opacity-5 bg-[#2B8A8A]" />
      </div>

      {/* Navigation - matching landing page style */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Image
            src="/career-forward-logo.png"
            alt="Career Forward"
            width={180}
            height={45}
            priority
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2B8A8A]/10 to-[#2B8A8A]/5 rounded-full border border-[#2B8A8A]/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B8A8A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B8A8A]"></span>
            </span>
            <span className="text-[#2B8A8A] text-sm font-semibold">Launching Q3 2026</span>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-8"
              >
                <Sparkles className="h-4 w-4 text-[#2B8A8A]" />
                <span className="text-sm font-medium text-gray-700">Early Access Preview</span>
              </motion.div>

              {/* Headline - matching landing page typography */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-gray-900 mb-4">
                  The Future of
                  <span className="relative inline-block ml-3 text-[#2B8A8A]">
                    Workforce
                    <motion.svg
                      className="absolute -bottom-1 left-0 w-full"
                      viewBox="0 0 200 8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      <motion.path
                        d="M2 6 Q 100 2 198 6"
                        fill="none"
                        stroke="#2B8A8A"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </span>
                  <br />
                  <span className="text-[#2B8A8A]">Development</span>
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Empowering job seekers and career coaches with tools to accelerate career success. Be among the first to experience the platform.
              </motion.p>

              {/* Value Props */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
              >
                {valueProps.map((prop, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <prop.icon className="h-4 w-4 text-[#2B8A8A]" />
                    <span className="text-sm font-medium text-gray-700">{prop.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Login Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md mx-auto lg:mx-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2B8A8A]/10 rounded-xl flex items-center justify-center">
                    <Lock className="h-5 w-5 text-[#2B8A8A]" />
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] transition-all"
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
                    className="w-full py-3.5 bg-[#2B8A8A] hover:bg-[#237070] text-white font-semibold rounded-xl shadow-lg shadow-[#2B8A8A]/25 hover:shadow-xl hover:shadow-[#2B8A8A]/30 transition-all duration-200 flex items-center justify-center gap-2 group"
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
                  <div className="bg-gray-900 rounded-t-2xl pt-3 px-3 pb-0 shadow-2xl">
                    {/* Menu bar dots */}
                    <div className="absolute top-2 left-4 flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-red-500/80 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-green-500/80 rounded-full" />
                    </div>

                    {/* Camera dot */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full" />

                    {/* Screen */}
                    <div className="relative rounded-t-sm overflow-hidden bg-black">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full aspect-video object-cover"
                      >
                        <source src="/hero-b2b.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* MacBook bottom/hinge */}
                  <div className="relative">
                    <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-4 rounded-b-xl" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-900 rounded-b" />
                  </div>

                  {/* Shadow */}
                  <div className="mx-auto w-3/4 h-4 bg-gradient-to-b from-black/10 to-transparent rounded-full blur-md -mt-1" />
                </div>
              </motion.div>

              {/* Stats Row - matching landing page style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center gap-8"
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-[#2B8A8A]">{stat.value}</div>
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
                  <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
                  <span>Free for job seekers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
                  <span>No credit card required</span>
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
