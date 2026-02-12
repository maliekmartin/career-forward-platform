"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CollapsibleCoachSidebar } from "@/components/app/coach-sidebar-collapsible";
import { CoachHeader } from "@/components/app/coach-header";
import { ChatProvider } from "@/components/app/chat-widget";
import { DemoToggle } from "@/components/app/demo-toggle";
import { useTheme } from "@/lib/theme-context";
import { CustomizeDashboardModal } from "@/components/dashboard/customize-dashboard-modal";
import { useDashboardPreferences } from "@/lib/hooks/use-dashboard-preferences";
import { DashboardPreferences } from "@/lib/types/dashboard";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const isDashboard = pathname === "/coach/dashboard";

  // Customize modal state
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  // Dashboard preferences (only load on dashboard page)
  const {
    preferences,
    isPremium,
    updatePreferences,
  } = useDashboardPreferences("coach");

  const handleSavePreferences = async (newPreferences: DashboardPreferences) => {
    await updatePreferences(newPreferences);
  };

  return (
    <ChatProvider>
      <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-[#F5F5F5]"}`}>
        <CollapsibleCoachSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <CoachHeader onOpenCustomize={isDashboard && isPremium ? () => setShowCustomizeModal(true) : undefined} />
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

        {/* Premium Customize Dashboard Modal */}
        {preferences && (
          <CustomizeDashboardModal
            isOpen={showCustomizeModal}
            onClose={() => setShowCustomizeModal(false)}
            role="coach"
            currentPreferences={preferences}
            onSave={handleSavePreferences}
          />
        )}
      </div>
    </ChatProvider>
  );
}
