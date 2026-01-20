"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Compass,
  Trophy,
  Settings,
  LogOut,
  Mail,
  BookOpen,
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/lib/theme-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Messages", href: "/messages", icon: Mail },
  { name: "Job Board", href: "/job-board", icon: Search },
];

const tools = [
  { name: "Compass", href: "/ai-coach", icon: Sparkles, premium: true },
  { name: "Resume Builder", href: "/resume-builder", icon: FileText },
  { name: "Job Tracker", href: "/job-tracker", icon: Briefcase },
  { name: "Interview Prep", href: "/interview-prep", icon: BookOpen },
  { name: "Assessments", href: "/assessments", icon: Compass },
  { name: "Local Resources", href: "/resources", icon: MapPin },
];

const questStages = [
  { name: "Discover", progress: 100, color: "#2B8A8A" },
  { name: "Prepare", progress: 60, color: "#38A169" },
  { name: "Search", progress: 0, color: "#D69E2E" },
  { name: "Interview", progress: 0, color: "#E53E3E" },
  { name: "Success", progress: 0, color: "#805AD5" },
];

// Demo job seeker data
const demoJobSeeker = {
  firstName: "Marcus",
  lastName: "Thompson",
  email: "marcus.thompson@email.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  questProgress: 32,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-64 flex flex-col border-r transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-100"
      }`}
      role="navigation"
      aria-label="Job seeker sidebar navigation"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Logo */}
      <div className={`p-6 border-b transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        <Link
          href="/dashboard"
          className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          aria-label="Career Forward Job Seeker Portal - Go to dashboard"
        >
          <Image
            src={isDark ? "/career-forward-logo-light.png" : "/career-forward-logo.png"}
            alt="Career Forward"
            width={180}
            height={45}
          />
          <span className={`mt-1 text-xs font-semibold tracking-wide ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
            Job Seeker Portal
          </span>
        </Link>
      </div>

      {/* Quest Progress Card */}
      <div className={`p-4 mx-4 mt-4 rounded-xl transition-colors ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Your Quest
          </span>
          <span className={`text-xs font-semibold ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
            {demoJobSeeker.questProgress}%
          </span>
        </div>
        <div className="flex gap-1">
          {questStages.map((stage, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
              title={stage.name}
              role="progressbar"
              aria-valuenow={stage.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${stage.name}: ${stage.progress}% complete`}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stage.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                style={{ backgroundColor: stage.color }}
              />
            </div>
          ))}
        </div>
        <div className={`flex justify-between mt-2 text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {questStages.map((stage, idx) => (
            <span key={idx} className={stage.progress > 0 ? (isDark ? "text-gray-300" : "text-gray-600") : ""}>
              {idx === 0 || idx === questStages.length - 1 ? stage.name : "•"}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-1" role="list">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-[#2B8A8A] dark:bg-[#4FD1C5] text-white dark:text-gray-900"
                      : isDark
                      ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Tools Section */}
        <div className="mt-8">
          <h3
            className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
            id="tools-nav-heading"
          >
            Tools
          </h3>
          <ul className="space-y-1" role="list" aria-labelledby="tools-nav-heading">
            {tools.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-[#2B8A8A] dark:bg-[#4FD1C5] text-white dark:text-gray-900"
                        : isDark
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Achievements */}
        <div className="mt-8">
          <Link
            href="/achievements"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              pathname === "/achievements"
                ? "bg-[#2B8A8A] dark:bg-[#4FD1C5] text-white dark:text-gray-900"
                : isDark
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Trophy className="h-5 w-5" aria-hidden="true" />
            Achievements
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className={`p-4 border-t transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-2 mb-2">
          <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Theme
          </span>
          <ThemeToggle variant="icon" />
        </div>

        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            isDark
              ? "text-gray-400 hover:bg-gray-800 hover:text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
            isDark
              ? "text-red-400 hover:bg-red-500/10"
              : "text-red-600 hover:bg-red-50"
          } ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label="Sign out of your account"
        >
          <LogOut className={`h-5 w-5 ${isSigningOut ? "animate-spin" : ""}`} aria-hidden="true" />
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>

      {/* User Profile */}
      <div className={`p-4 border-t transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        <div className="flex items-center gap-3">
          <img
            src={demoJobSeeker.avatar}
            alt={`${demoJobSeeker.firstName} ${demoJobSeeker.lastName}'s profile photo`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
              {demoJobSeeker.firstName} {demoJobSeeker.lastName}
            </p>
            <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {demoJobSeeker.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
