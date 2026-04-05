"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Briefcase,
  BookOpen,
  ClipboardList,
  MapPin,
  Trophy,
  MessageSquare,
  Settings,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { formatDistanceToNow } from "date-fns";

interface SessionState {
  lastPath: string;
  lastPathName: string;
  lastVisitedAt: string;
  draftData?: {
    pageKey?: string;
    savedAt?: string;
  } | null;
}

// Icon mapping for different pages
const PAGE_ICONS: Record<string, typeof FileText> = {
  "/resume-builder": FileText,
  "/job-tracker": Briefcase,
  "/job-board": ClipboardList,
  "/interview-prep": BookOpen,
  "/assessments": ClipboardList,
  "/resources": MapPin,
  "/achievements": Trophy,
  "/messages": MessageSquare,
  "/settings": Settings,
  "/ai-coach": Sparkles,
};

// Color mapping for different pages
const PAGE_COLORS: Record<string, string> = {
  "/resume-builder": "#38A169",
  "/job-tracker": "#3182CE",
  "/job-board": "#D69E2E",
  "/interview-prep": "#805AD5",
  "/assessments": "#E53E3E",
  "/resources": "#DD6B20",
  "/achievements": "#D53F8C",
  "/messages": "#0D9488",
  "/settings": "#718096",
  "/ai-coach": "#9F7AEA",
};

export function ContinueCard() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionState();
  }, []);

  const fetchSessionState = async () => {
    try {
      const res = await fetch("/api/session-state");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.sessionState) {
          setSessionState(data.sessionState);
        }
      }
    } catch (error) {
      console.error("Failed to fetch session state:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if loading or no session state
  if (loading || !sessionState) {
    return null;
  }

  // Don't show if last path was dashboard
  if (sessionState.lastPath === "/dashboard") {
    return null;
  }

  const Icon = PAGE_ICONS[sessionState.lastPath] || FileText;
  const color = PAGE_COLORS[sessionState.lastPath] || "#0D9488";
  const hasDraft = sessionState.draftData && sessionState.draftData.pageKey;

  const timeAgo = sessionState.lastVisitedAt
    ? formatDistanceToNow(new Date(sessionState.lastVisitedAt), { addSuffix: true })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border shadow-sm overflow-hidden mb-4 ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="p-3 rounded-xl flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <RotateCcw className="h-5 w-5" style={{ color }} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-[#0F172A]"}`}>
                Pick up where you left off
              </h3>
              {hasDraft && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Unsaved work
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="p-1 rounded"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {sessionState.lastPathName}
              </span>
              {timeAgo && (
                <>
                  <span className={isDark ? "text-gray-600" : "text-gray-300"}>·</span>
                  <span className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {timeAgo}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Link href={sessionState.lastPath}>
            <Button
              className={`gap-2 ${
                isDark
                  ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-[#0F172A]"
                  : "bg-[#F59E0B] hover:bg-[#D97706] text-white"
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
