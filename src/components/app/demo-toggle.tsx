"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, X, Users, Briefcase } from "lucide-react";

export function DemoToggle() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const isCoachView = pathname?.startsWith("/coach");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide">Demo Mode</span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Switch between portal views to explore the full platform experience.
              </p>

              <Link
                href="/dashboard"
                onClick={() => setIsExpanded(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  !isCoachView
                    ? "bg-[#2B8A8A]/10 dark:bg-[#4FD1C5]/10 text-[#2B8A8A] dark:text-[#4FD1C5]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  !isCoachView
                    ? "bg-[#2B8A8A] dark:bg-[#4FD1C5]"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}>
                  <Briefcase className={`h-4 w-4 ${
                    !isCoachView ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-400"
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium">Job Seeker Portal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Find jobs & track progress</p>
                </div>
              </Link>

              <Link
                href="/coach/dashboard"
                onClick={() => setIsExpanded(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCoachView
                    ? "bg-[#2B8A8A]/10 dark:bg-[#4FD1C5]/10 text-[#2B8A8A] dark:text-[#4FD1C5]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCoachView
                    ? "bg-[#2B8A8A] dark:bg-[#4FD1C5]"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}>
                  <Users className={`h-4 w-4 ${
                    isCoachView ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-400"
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium">Coach Portal</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage caseload & tasks</p>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                This toggle will be removed in production
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-colors ${
          isExpanded
            ? "bg-gray-800 dark:bg-gray-700 text-white"
            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
        }`}
      >
        <ArrowLeftRight className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isCoachView ? "Coach" : "Job Seeker"}
        </span>
      </motion.button>
    </div>
  );
}
