"use client";

import { Sparkles, Lightbulb, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WizardStep } from "./types/resume-types";
import { SECTION_EXPLANATIONS } from "./guided-resume-flow";

interface WhyThisMattersProps {
  step: WizardStep;
  isDark: boolean;
}

export function WhyThisMatters({ step, isDark }: WhyThisMattersProps) {
  const explanation = SECTION_EXPLANATIONS[step];

  if (!explanation) return null;

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl mb-6",
        isDark
          ? "bg-teal-500/10 border border-teal-500/20"
          : "bg-teal-50 border border-teal-200"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          isDark ? "bg-teal-500/20" : "bg-teal-100"
        )}
      >
        <Lightbulb className={cn("w-4 h-4", isDark ? "text-teal-400" : "text-teal-600")} />
      </div>
      <div>
        <h3 className={cn("font-semibold text-sm mb-1", isDark ? "text-teal-400" : "text-teal-700")}>
          Why this matters
        </h3>
        <p className={cn("text-sm", isDark ? "text-teal-300/80" : "text-teal-600")}>
          {explanation}
        </p>
      </div>
    </div>
  );
}

interface AIHelpButtonProps {
  label?: string;
  onClick: () => void;
  isLoading?: boolean;
  isDark: boolean;
  className?: string;
}

export function AIHelpButton({ label = "Help me write this", onClick, isLoading, isDark, className }: AIHelpButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "gap-2",
        isDark
          ? "border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
          : "border-teal-500/30 text-teal-600 hover:bg-teal-50 hover:text-teal-700",
        className
      )}
    >
      <Sparkles className="w-4 h-4" />
      {isLoading ? "Generating..." : label}
    </Button>
  );
}

interface ProgressEncouragementProps {
  currentStepIndex: number;
  totalSteps: number;
  isDark: boolean;
}

export function ProgressEncouragement({ currentStepIndex, totalSteps, isDark }: ProgressEncouragementProps) {
  const messages = [
    "Great start! Let's build your resume.",
    "Nice progress! Keep going.",
    "You're doing amazing!",
    "Almost halfway there!",
    "More than halfway done!",
    "Almost finished!",
    "Final step! You've got this.",
  ];

  const message = messages[Math.min(currentStepIndex, messages.length - 1)];

  return (
    <div className={cn("text-center text-sm py-3", isDark ? "text-gray-500" : "text-gray-400")}>
      <span>
        Step {currentStepIndex + 1} of {totalSteps} - {message}
      </span>
    </div>
  );
}

interface FieldTipProps {
  tip: string;
  isDark: boolean;
}

export function FieldTip({ tip, isDark }: FieldTipProps) {
  return (
    <div className={cn(
      "flex items-start gap-2 mt-1.5 text-xs",
      isDark ? "text-gray-500" : "text-gray-400"
    )}>
      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
      <span>{tip}</span>
    </div>
  );
}

interface ExampleHintProps {
  examples: string[];
  isDark: boolean;
}

export function ExampleHint({ examples, isDark }: ExampleHintProps) {
  return (
    <div className={cn(
      "mt-2 text-xs",
      isDark ? "text-gray-500" : "text-gray-400"
    )}>
      <span className="font-medium">Examples: </span>
      {examples.join(", ")}
    </div>
  );
}

// Hook to determine if we should show beginner mode elements
export function useBeginnerMode(guidedMode: "beginner" | "expert" | null): boolean {
  return guidedMode === "beginner";
}
