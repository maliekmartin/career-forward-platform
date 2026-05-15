"use client";

import { useResumeBuilder } from "../context/resume-builder-context";
import { ModernTemplate } from "../templates/modern-template";
import { ClassicTemplate } from "../templates/classic-template";
import { ProfessionalTemplate } from "../templates/professional-template";
import { CleanTemplate } from "../templates/clean-template";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function ResumePreview() {
  const { state } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Render the appropriate template
  const renderTemplate = () => {
    switch (state.templateId) {
      case "modern":
        return <ModernTemplate data={state.data} />;
      case "classic":
        return <ClassicTemplate data={state.data} />;
      case "professional":
        return <ProfessionalTemplate data={state.data} />;
      case "clean":
        return <CleanTemplate data={state.data} />;
      default:
        return <ModernTemplate data={state.data} />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Preview header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            "font-medium text-sm",
            isDark ? "text-gray-400" : "text-gray-500"
          )}
        >
          Live Preview
        </h3>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full",
            isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
          )}
        >
          {state.templateId.charAt(0).toUpperCase() + state.templateId.slice(1)}
        </span>
      </div>

      {/* Resume preview container - scaled to fit */}
      <div
        className={cn(
          "relative rounded-xl overflow-hidden shadow-xl",
          isDark ? "bg-gray-800" : "bg-gray-200"
        )}
        style={{ aspectRatio: "8.5/11" }}
      >
        {/* Scale container */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: "scale(0.5)",
            width: "200%",
            height: "200%",
          }}
        >
          <div className="w-full h-full bg-white overflow-auto">
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Zoom note */}
      <p
        className={cn(
          "text-xs text-center mt-2",
          isDark ? "text-gray-500" : "text-gray-400"
        )}
      >
        Preview scaled to 50%
      </p>
    </div>
  );
}
