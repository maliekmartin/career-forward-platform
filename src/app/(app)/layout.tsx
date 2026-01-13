"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { JobSeekerHeader } from "@/components/app/job-seeker-header";
import { DemoToggle } from "@/components/app/demo-toggle";
import { JobApplicationsProvider } from "@/lib/job-applications-context";
import { JobSeekerMessagesProvider } from "@/lib/job-seeker-messages-context";
import { useTheme } from "@/lib/theme-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isCoachRoute = pathname?.startsWith("/coach");

  // Coach routes have their own layout, so skip the job seeker sidebar
  if (isCoachRoute) {
    return (
      <JobApplicationsProvider>
        {children}
      </JobApplicationsProvider>
    );
  }

  return (
    <JobApplicationsProvider>
      <JobSeekerMessagesProvider>
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-[#F5F5F5]"}`}>
          <Sidebar />
          <div className="pl-64 flex flex-col min-h-screen">
            <JobSeekerHeader />
            <main
              id="main-content"
              className="flex-1 p-6 overflow-auto"
              role="main"
              aria-label="Job seeker main content"
            >
              {children}
            </main>
          </div>
          <DemoToggle />
        </div>
      </JobSeekerMessagesProvider>
    </JobApplicationsProvider>
  );
}
