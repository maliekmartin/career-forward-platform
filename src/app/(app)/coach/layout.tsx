"use client";

import { CoachSidebar } from "@/components/app/coach-sidebar";
import { CoachHeader } from "@/components/app/coach-header";
import { ChatProvider } from "@/components/app/chat-widget";
import { DemoToggle } from "@/components/app/demo-toggle";
import { useTheme } from "@/lib/theme-context";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ChatProvider>
      <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-[#F5F5F5]"}`}>
        <CoachSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <CoachHeader />
          <main
            id="main-content"
            className="flex-1 p-4 overflow-auto"
            role="main"
            aria-label="Coach dashboard main content"
          >
            {children}
          </main>
        </div>
        <DemoToggle />
      </div>
    </ChatProvider>
  );
}
