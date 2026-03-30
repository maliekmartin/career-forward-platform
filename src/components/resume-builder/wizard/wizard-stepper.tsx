"use client";

import { Check } from "lucide-react";
import { useResumeBuilder } from "../context/resume-builder-context";
import { WIZARD_STEPS, WizardStep } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function WizardStepper() {
  const { state, goToStep } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const currentStepIndex = WIZARD_STEPS.findIndex(
    (s) => s.id === state.currentStep
  );

  const getStepStatus = (index: number): "completed" | "current" | "upcoming" => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  const handleStepClick = (step: WizardStep, index: number) => {
    // Allow navigation to completed steps or current step
    if (index <= currentStepIndex) {
      goToStep(step);
    }
  };

  return (
    <nav aria-label="Resume wizard progress" className="w-full">
      {/* Mobile stepper - horizontal pills */}
      <div className="md:hidden flex items-center justify-between gap-1 px-2">
        {WIZARD_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id, index)}
              disabled={status === "upcoming"}
              className={cn(
                "flex-1 h-2 rounded-full transition-all",
                status === "completed" && (isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"),
                status === "current" && (isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"),
                status === "upcoming" && (isDark ? "bg-gray-700" : "bg-gray-200")
              )}
              aria-label={`${step.label} - ${status}`}
              aria-current={status === "current" ? "step" : undefined}
            />
          );
        })}
      </div>

      {/* Desktop stepper - vertical list */}
      <div className="hidden md:block">
        <ol className="space-y-2">
          {WIZARD_STEPS.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = index <= currentStepIndex;

            return (
              <li key={step.id}>
                <button
                  onClick={() => handleStepClick(step.id, index)}
                  disabled={!isClickable}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                    isClickable && "cursor-pointer",
                    !isClickable && "cursor-not-allowed opacity-60",
                    status === "current" &&
                      (isDark
                        ? "bg-[#4FD1C5]/10 border border-[#4FD1C5]/30"
                        : "bg-[#2B8A8A]/10 border border-[#2B8A8A]/30"),
                    status === "completed" &&
                      (isDark
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"),
                    status === "upcoming" &&
                      (isDark ? "bg-gray-800/30" : "bg-gray-50")
                  )}
                  aria-current={status === "current" ? "step" : undefined}
                >
                  {/* Step indicator */}
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      status === "completed" &&
                        (isDark
                          ? "bg-[#4FD1C5] text-gray-900"
                          : "bg-[#2B8A8A] text-white"),
                      status === "current" &&
                        (isDark
                          ? "bg-[#4FD1C5]/20 text-[#4FD1C5] border-2 border-[#4FD1C5]"
                          : "bg-[#2B8A8A]/20 text-[#2B8A8A] border-2 border-[#2B8A8A]"),
                      status === "upcoming" &&
                        (isDark
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-200 text-gray-500")
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        status === "current" &&
                          (isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"),
                        status === "completed" &&
                          (isDark ? "text-white" : "text-gray-900"),
                        status === "upcoming" &&
                          (isDark ? "text-gray-400" : "text-gray-500")
                      )}
                    >
                      {step.label}
                    </p>
                    <p
                      className={cn(
                        "text-xs truncate",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Optional badge */}
                  {!step.required && (
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        isDark
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      Optional
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
