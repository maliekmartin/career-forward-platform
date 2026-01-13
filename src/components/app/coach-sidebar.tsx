"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  Target,
  ListTodo,
  MapPin,
  Search,
  ArrowRight,
} from "lucide-react";
import { demoCoach } from "@/lib/demo-data";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/lib/theme-context";

const navigation = [
  { name: "Caseload", href: "/coach/dashboard", icon: Users },
  { name: "Tasks", href: "/coach/tasks", icon: ListTodo },
  { name: "Messages", href: "/coach/messages", icon: MessageSquare },
  { name: "Reports", href: "/coach/reports", icon: BarChart3 },
];

const tools = [
  { name: "Job Board", href: "/coach/job-board", icon: Search },
  { name: "Interview Prep", href: "/coach/interview-prep", icon: BookOpen },
  { name: "Assessments", href: "/coach/assessments", icon: Target },
  { name: "Local Resources", href: "/coach/resources", icon: MapPin },
];

export function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/");
    }
  };

  return (
    <aside
      className={`w-64 h-screen flex flex-col sticky left-0 top-0 border-r transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-100"
      }`}
      role="navigation"
      aria-label="Coach sidebar navigation"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Logo */}
      <div className={`px-4 py-3 border-b transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        <Link
          href="/coach/dashboard"
          className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          aria-label="Career Forward Coach Portal - Go to dashboard"
        >
          <Image
            src={isDark ? "/career-forward-logo-light.png" : "/career-forward-logo.png"}
            alt="Career Forward"
            width={180}
            height={45}
          />
          <span className={`mt-1 text-xs font-semibold tracking-wide ${isDark ? "text-[#4FD1C5]" : "text-[#374151]"}`}>
            Coach Portal
          </span>
        </Link>
      </div>

      {/* Coach Info */}
      <div className={`p-3 mx-4 mt-3 rounded-xl transition-colors ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="flex items-center gap-3">
          <img
            src={demoCoach.avatar}
            alt={`${demoCoach.firstName} ${demoCoach.lastName}'s profile photo`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
              {demoCoach.firstName} {demoCoach.lastName}
            </p>
            <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {demoCoach.organization}
            </p>
          </div>
        </div>
        <div className={`mt-3 pt-3 border-t transition-colors ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-gray-400" : "text-gray-500"}>Caseload</span>
            <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {demoCoach.clientCount}/{demoCoach.maxClients}
            </span>
          </div>
          <div
            className={`mt-1 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            role="progressbar"
            aria-valuenow={demoCoach.clientCount}
            aria-valuemin={0}
            aria-valuemax={demoCoach.maxClients}
            aria-label={`Caseload: ${demoCoach.clientCount} of ${demoCoach.maxClients} job seekers`}
          >
            <motion.div
              className="h-full bg-[#2B8A8A] dark:bg-[#4FD1C5] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(demoCoach.clientCount / demoCoach.maxClients) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-1" role="list">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
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
        <div className="mt-5">
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
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
      </nav>

      {/* Bottom */}
      <div className={`p-3 border-t transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-1">
          <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Theme
          </span>
          <ThemeToggle variant="icon" />
        </div>

        <Link
          href="/coach/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
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
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
            isDark
              ? "text-red-400 hover:bg-red-500/10"
              : "text-red-600 hover:bg-red-50"
          }`}
          aria-label="Sign out of your account"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
