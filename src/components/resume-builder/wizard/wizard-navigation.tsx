"use client";

import { ChevronLeft, ChevronRight, Save, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { WIZARD_STEPS } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface WizardNavigationProps {
  onDownload?: () => void;
}

export function WizardNavigation({ onDownload }: WizardNavigationProps) {
  const { state, nextStep, prevStep, saveResume, closeWizard } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const currentStepIndex = WIZARD_STEPS.findIndex(
    (s) => s.id === state.currentStep
  );
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      // Final step - save and close or download
      await saveResume();
      if (onDownload) {
        onDownload();
      } else {
        closeWizard();
      }
    } else {
      nextStep();
    }
  };

  const handleSaveAndExit = async () => {
    await saveResume();
    closeWizard();
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-t",
        isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
      )}
    >
      {/* Left side - Back button */}
      <div>
        {!isFirstStep ? (
          <Button
            variant="ghost"
            onClick={prevStep}
            className={cn(
              "gap-2",
              isDark
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-600 hover:text-[#0F172A] hover:bg-gray-100"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={closeWizard}
            className={cn(
              isDark
                ? "text-gray-400 hover:text-white hover:bg-gray-800"
                : "text-gray-500 hover:text-[#0F172A] hover:bg-gray-100"
            )}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Center - Save status */}
      <div className="flex items-center gap-2 text-sm">
        {state.isSaving ? (
          <>
            <Loader2 className={cn("w-4 h-4 animate-spin", isDark ? "text-gray-400" : "text-gray-500")} />
            <span className={isDark ? "text-gray-400" : "text-gray-500"}>
              Saving...
            </span>
          </>
        ) : state.lastSaved ? (
          <span className={isDark ? "text-gray-500" : "text-gray-400"}>
            Saved {formatTimeSince(state.lastSaved)}
          </span>
        ) : state.hasUnsavedChanges ? (
          <span className={isDark ? "text-yellow-400/80" : "text-yellow-600"}>
            Unsaved changes
          </span>
        ) : null}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        {/* Save button - always visible */}
        <Button
          variant="outline"
          onClick={handleSaveAndExit}
          disabled={state.isSaving}
          className={cn(
            "gap-2",
            isDark
              ? "border-gray-700 text-gray-300 hover:bg-gray-800"
              : "border-gray-200 text-gray-600 hover:bg-gray-100"
          )}
        >
          <Save className="w-4 h-4" />
          Save & Exit
        </Button>

        {/* Next/Finish button */}
        <Button
          onClick={handleNext}
          disabled={state.isSaving}
          className={cn(
            "gap-2",
            isDark
              ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-[#0F172A]"
              : "bg-[#F59E0B] hover:bg-[#D97706] text-white"
          )}
        >
          {isLastStep ? (
            <>
              {onDownload ? (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Finish
                </>
              )}
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Helper function to format time since last save
function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
