"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  Target,
  ListTodo,
  MapPin,
  Search,
  Crown,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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

interface CoachProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  organization: string;
  clientCount: number;
  maxClients: number;
}

export function CollapsibleCoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isExpanded, setIsExpanded] = useState(false);
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch coach profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setCoachProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/");
    }
  };

  // Animation variants
  const sidebarVariants = {
    collapsed: { width: "4rem" },
    expanded: { width: "16rem" },
  };

  const contentVariants = {
    collapsed: { opacity: 0, width: 0 },
    expanded: {
      opacity: 1,
      width: "auto",
      transition: { delay: 0.1 }
    },
  };

  return (
    <motion.aside
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen flex flex-col sticky left-0 top-0 border-r transition-colors duration-300 ${
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

      {/* Logo Section */}
      <div className={`px-3 py-3 border-b transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        <Link
          href="/coach/dashboard"
          className="flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          aria-label="Career Forward Coach Portal - Go to dashboard"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <Image
                  src={isDark ? "/career-forward-logo-light.png" : "/career-forward-logo.png"}
                  alt="Career Forward"
                  width={160}
                  height={40}
                />
                <span className={`mt-1 text-xs font-semibold tracking-wide text-center ${isDark ? "text-[#4FD1C5]" : "text-[#0F172A]"}`}>
                  Coach Portal
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="icon-logo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/career-forward-icon.png"
                  alt="CF"
                  width={32}
                  height={32}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Coach Profile Section */}
      <div className={`p-3 mx-3 mt-3 rounded-xl transition-colors relative ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        {/* Premium Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="absolute -top-1 -right-1 z-10"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`rounded-full p-1 ${isDark ? "bg-gradient-to-br from-amber-400 to-yellow-600" : "bg-gradient-to-br from-amber-300 to-yellow-500"}`}>
                <Crown className="w-3 h-3 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Premium Coach Account</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {!isLoading && coachProfile && (
          <>
            <div className="flex items-center gap-3">
              <img
                src={coachProfile.avatar}
                alt={`${coachProfile.firstName} ${coachProfile.lastName}'s profile photo`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <motion.div
                variants={contentVariants}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className={`font-medium truncate ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                  {coachProfile.firstName} {coachProfile.lastName}
                </p>
                <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {coachProfile.organization}
                </p>
              </motion.div>
            </div>

            {/* Caseload Progress */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mt-3 pt-3 border-t transition-colors ${isDark ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div className="flex justify-between text-xs">
                    <span className={isDark ? "text-gray-400" : "text-gray-500"}>Caseload</span>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {coachProfile.clientCount}/{coachProfile.maxClients}
                    </span>
                  </div>
                  <div
                    className={`mt-1 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                    role="progressbar"
                    aria-valuenow={coachProfile.clientCount}
                    aria-valuemin={0}
                    aria-valuemax={coachProfile.maxClients}
                    aria-label={`Caseload: ${coachProfile.clientCount} of ${coachProfile.maxClients} job seekers`}
                  >
                    <motion.div
                      className="h-full bg-[#0D9488] dark:bg-[#4FD1C5] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(coachProfile.clientCount / coachProfile.maxClients) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-1" role="list">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const NavLink = (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-[#0D9488] dark:bg-[#4FD1C5] text-white dark:text-[#0F172A]"
                    : isDark
                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <motion.span
                  variants={contentVariants}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              </Link>
            );

            return (
              <li key={item.name}>
                {!isExpanded ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {NavLink}
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  NavLink
                )}
              </li>
            );
          })}
        </ul>

        {/* Tools Section */}
        <div className="mt-5">
          <AnimatePresence>
            {isExpanded && (
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
                id="tools-nav-heading"
              >
                Tools
              </motion.h3>
            )}
          </AnimatePresence>

          <ul className="space-y-1" role="list" aria-labelledby="tools-nav-heading">
            {tools.map((item) => {
              const isActive = pathname === item.href;
              const ToolLink = (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-[#0D9488] dark:bg-[#4FD1C5] text-white dark:text-[#0F172A]"
                      : isDark
                      ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <motion.span
                    variants={contentVariants}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                </Link>
              );

              return (
                <li key={item.name}>
                  {!isExpanded ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {ToolLink}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    ToolLink
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className={`p-3 border-t transition-colors ${isDark ? "border-gray-800" : "border-gray-100"}`}>
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-1">
          <motion.span
            variants={contentVariants}
            className={`text-sm font-medium overflow-hidden whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Theme
          </motion.span>
          <ThemeToggle variant="icon" />
        </div>

        {/* Settings */}
        {!isExpanded ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/coach/settings"
                className={`flex items-center justify-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isDark
                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/coach/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isDark
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <motion.span
              variants={contentVariants}
              className="overflow-hidden whitespace-nowrap"
            >
              Settings
            </motion.span>
          </Link>
        )}

        {/* Sign Out */}
        {!isExpanded ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center justify-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                  isDark
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-red-600 hover:bg-red-50"
                }`}
                aria-label="Sign out of your account"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
              isDark
                ? "text-red-400 hover:bg-red-500/10"
                : "text-red-600 hover:bg-red-50"
            }`}
            aria-label="Sign out of your account"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <motion.span
              variants={contentVariants}
              className="overflow-hidden whitespace-nowrap"
            >
              Sign Out
            </motion.span>
          </button>
        )}
      </div>

      {/* Expand Indicator */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-12 flex items-center justify-center rounded-full ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            } shadow-lg`}
          >
            <ChevronRight className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
