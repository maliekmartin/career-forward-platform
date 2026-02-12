"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

// Map of paths to human-readable names
const PAGE_NAMES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/resume-builder": "Resume Builder",
  "/job-tracker": "Job Tracker",
  "/job-board": "Job Board",
  "/interview-prep": "Interview Prep",
  "/assessments": "Assessments",
  "/resources": "Local Resources",
  "/achievements": "Achievements",
  "/messages": "Messages",
  "/settings": "Settings",
  "/ai-coach": "AI Coach",
};

// Pages to skip tracking (don't track dashboard as "last visited")
const SKIP_TRACKING = ["/dashboard"];

export function usePageTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackPage = useCallback(async (path: string) => {
    // Skip dashboard and already tracked paths
    if (SKIP_TRACKING.includes(path) || path === lastTrackedPath.current) {
      return;
    }

    // Get human-readable name
    const pageName = PAGE_NAMES[path] || path.split("/").pop()?.replace(/-/g, " ") || "Page";

    try {
      await fetch("/api/session-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastPath: path,
          lastPathName: pageName,
        }),
      });
      lastTrackedPath.current = path;
    } catch (error) {
      console.error("Failed to track page:", error);
    }
  }, []);

  useEffect(() => {
    // Debounce to avoid rapid tracking during navigation
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      trackPage(pathname);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pathname, trackPage]);
}
