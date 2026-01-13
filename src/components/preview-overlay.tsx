"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const ADMIN_PASSWORD = "careerforward2026";

interface PreviewOverlayProps {
  children: React.ReactNode;
}

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <div className="min-h-screen flex flex-col lg:flex-row">

          {/* Left side - Content */}
          <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Image
                  src="/career-forward-logo-light.png"
                  alt="Career Forward"
                  width={320}
                  height={100}
                  className="h-12 md:h-14 w-auto"
                  priority
                />
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  The Future of
                  <span className="block text-teal-400">Workforce Development</span>
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Empowering job seekers and career coaches with AI-driven tools to accelerate career success.
                </p>
              </motion.div>

              {/* Launch badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10"
              >
                <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-teal-500/10 border border-teal-500/20 rounded-full">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span className="text-teal-400 font-medium">
                    Launching Q3 2026
                  </span>
                </div>
              </motion.div>

              {/* Login form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-sm"
              >
                <p className="text-sm text-gray-500 mb-3">Early access preview</p>
                <form onSubmit={handleUnlock} className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 group"
                  >
                    Login
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Right side - Video in MacBook */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-4xl"
            >
              {/* MacBook Frame */}
              <div className="relative">
                {/* Screen bezel */}
                <div className="bg-[#1a1a1a] rounded-t-2xl pt-4 px-4 pb-0 shadow-2xl">
                  {/* Menu bar dots */}
                  <div className="absolute top-2.5 left-5 flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500/80 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-yellow-500/80 rounded-full" />
                    <div className="w-2.5 h-2.5 bg-green-500/80 rounded-full" />
                  </div>

                  {/* Camera dot */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full" />

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
                  <div className="bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] h-5 rounded-b-xl shadow-lg" />
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#0d0d0d] rounded-b-lg" />
                </div>

                {/* Reflection/shadow */}
                <div className="mx-auto w-4/5 h-4 bg-gradient-to-b from-black/20 to-transparent rounded-full blur-sm -mt-1" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 lg:px-16">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>© 2026 Career Forward. All rights reserved.</span>
            <span>A Martin Built Strategies Product</span>
          </div>
        </div>
      </div>
    </div>
  );
}
