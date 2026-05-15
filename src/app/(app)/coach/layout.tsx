"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CollapsibleCoachSidebar } from "@/components/app/coach-sidebar-collapsible";
import { CoachHeader } from "@/components/app/coach-header";
import { ChatProvider } from "@/components/app/chat-widget";
import { DemoToggle } from "@/components/app/demo-toggle";
import { useTheme } from "@/lib/theme-context";
import { CustomizeDashboardModal } from "@/components/dashboard/customize-dashboard-modal";
import { useDashboardPreferences } from "@/lib/hooks/use-dashboard-preferences";
import { DashboardPreferences } from "@/lib/types/dashboard";
import { Loader2, ShieldAlert } from "lucide-react";

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const isDashboard = pathname === "/coach/dashboard";

  // Role-based access control
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Coach portal temporarily disabled - redirect all users to job seeker dashboard
    router.replace("/dashboard");
  }, [router]);

  // Show loading state while checking authorization
  if (isChecking) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950" : "bg-[#F5F5F5]"}`}>
        <div className="text-center">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto mb-4 ${isDark ? "text-[#4FD1C5]" : "text-[#0D9488]"}`} />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message
  if (isAuthorized === false) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-950" : "bg-[#F5F5F5]"}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-red-900/30" : "bg-red-100"}`}>
            <ShieldAlert className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-600"}`} />
          </div>
          <h1 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-[#0F172A]"}`}>
            Access Restricted
          </h1>
          <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            The Coach Portal is only available to authorized career coaches.
          </p>
          <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

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
