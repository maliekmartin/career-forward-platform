"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ListChecks, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { WizardStepper } from "./wizard-stepper";
import { WizardNavigation } from "./wizard-navigation";
import { ContactInfoStep } from "../steps/contact-info-step";
import { SummaryStep } from "../steps/summary-step";
import { ExperienceStep } from "../steps/experience-step";
import { EducationStep } from "../steps/education-step";
import { SkillsStep } from "../steps/skills-step";
import { CertificationsStep } from "../steps/certifications-step";
import { ReviewStep } from "../steps/review-step";
import { ResumePreview } from "../preview/resume-preview";
import { FeaturesPanel } from "../features/features-panel";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

type SidebarTab = "steps" | "tools";

export function ResumeWizard() {
  const { state, closeWizard, setResumeName } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.resumeName);
  const [showPreview, setShowPreview] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("steps");

  // Update name input when resume name changes
  useEffect(() => {
    setNameInput(state.resumeName);
  }, [state.resumeName]);

  // Handle ESC key to close wizard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWizard();
      }
    };

    if (state.isWizardOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.isWizardOpen, closeWizard]);

  // Lock body scroll when wizard is open
  useEffect(() => {
    if (state.isWizardOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.isWizardOpen]);

  const handleNameSave = () => {
    if (nameInput.trim()) {
      setResumeName(nameInput.trim());
    } else {
      setNameInput(state.resumeName);
    }
    setIsEditingName(false);
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case "contact":
        return <ContactInfoStep />;
      case "summary":
        return <SummaryStep />;
      case "experience":
        return <ExperienceStep />;
      case "education":
        return <EducationStep />;
      case "skills":
        return <SkillsStep />;
      case "certifications":
        return <CertificationsStep />;
      case "review":
        return <ReviewStep />;
      default:
        return <ContactInfoStep />;
    }
  };

  console.log("[ResumeWizard] Rendering, isWizardOpen:", state.isWizardOpen);

  if (!state.isWizardOpen) return null;

  console.log("[ResumeWizard] Wizard IS open, rendering content");
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeWizard}
        />

        {/* Wizard content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex w-full max-w-7xl mx-auto my-4 rounded-2xl overflow-hidden shadow-2xl",
            isDark ? "bg-gray-950" : "bg-gray-50"
          )}
        >
          {/* Left sidebar - Stepper */}
          <div
            className={cn(
              "hidden md:flex md:w-72 flex-col border-r",
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "p-4 border-b flex items-center gap-3",
                isDark ? "border-gray-800" : "border-gray-200"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl",
                  isDark ? "bg-[#4FD1C5]/10" : "bg-[#2B8A8A]/10"
                )}
              >
                <FileText
                  className={cn(
                    "w-5 h-5",
                    isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                    autoFocus
                    className={cn(
                      "w-full text-sm font-semibold px-2 py-1 rounded border outline-none",
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white focus:border-[#4FD1C5]"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-[#2B8A8A]"
                    )}
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className={cn(
                      "text-sm font-semibold truncate block w-full text-left hover:underline",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                    title="Click to rename"
                  >
                    {state.resumeName}
                  </button>
                )}
                <p
                  className={cn(
                    "text-xs capitalize",
                    isDark ? "text-gray-500" : "text-gray-400"
                  )}
                >
                  {state.templateId} template
                </p>
              </div>
            </div>

            {/* Sidebar Tabs */}
            <div
              className={cn(
                "flex border-b",
                isDark ? "border-gray-800" : "border-gray-200"
              )}
            >
              <button
                onClick={() => setSidebarTab("steps")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2",
                  sidebarTab === "steps"
                    ? isDark
                      ? "border-[#4FD1C5] text-[#4FD1C5]"
                      : "border-[#2B8A8A] text-[#2B8A8A]"
                    : isDark
                    ? "border-transparent text-gray-500 hover:text-gray-300"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <ListChecks className="w-3.5 h-3.5" />
                Steps
              </button>
              <button
                onClick={() => setSidebarTab("tools")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2",
                  sidebarTab === "tools"
                    ? isDark
                      ? "border-[#4FD1C5] text-[#4FD1C5]"
                      : "border-[#2B8A8A] text-[#2B8A8A]"
                    : isDark
                    ? "border-transparent text-gray-500 hover:text-gray-300"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Tools
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              {sidebarTab === "steps" ? (
                <div className="p-4">
                  <WizardStepper />
                </div>
              ) : (
                <FeaturesPanel />
              )}
            </div>

            {/* Toggle preview button */}
            <div
              className={cn(
                "p-4 border-t",
                isDark ? "border-gray-800" : "border-gray-200"
              )}
            >
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  "w-full",
                  isDark
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-100"
                )}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile header */}
            <div
              className={cn(
                "md:hidden flex items-center justify-between p-4 border-b",
                isDark ? "border-gray-800" : "border-gray-200"
              )}
            >
              <div className="flex items-center gap-2">
                <FileText
                  className={cn(
                    "w-5 h-5",
                    isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
                  )}
                />
                <span
                  className={cn(
                    "font-semibold truncate",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {state.resumeName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeWizard}
                className={isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile stepper */}
            <div
              className={cn(
                "md:hidden py-3 border-b",
                isDark ? "border-gray-800" : "border-gray-200"
              )}
            >
              <WizardStepper />
            </div>

            {/* Content with preview split */}
            <div className="flex-1 flex overflow-hidden">
              {/* Step content */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto",
                  showPreview ? "lg:w-1/2" : "w-full"
                )}
              >
                <div className="p-6 max-w-2xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={state.currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderCurrentStep()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Live preview panel */}
              {showPreview && (
                <div
                  className={cn(
                    "hidden lg:block w-1/2 border-l overflow-hidden",
                    isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
                  )}
                >
                  <div className="h-full p-4 overflow-y-auto">
                    <div className="sticky top-0">
                      <ResumePreview />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Close button (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeWizard}
              className={cn(
                "hidden md:flex absolute top-4 right-4",
                isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
              )}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Navigation */}
            <WizardNavigation />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
