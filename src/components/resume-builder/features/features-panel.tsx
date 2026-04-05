"use client";

import { useState } from "react";
import {
  Target,
  Scan,
  Palette,
  Download,
  TrendingUp,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobMatchPanel } from "./job-match-panel";
import { ATSScannerPanel } from "./ats-scanner-panel";
import { TemplateCustomizer } from "./template-customizer";
import { PDFExport } from "./pdf-export";
import { RealtimeScore } from "./realtime-score";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

type FeaturePanel = "score" | "job-match" | "ats-scan" | "customize" | "export" | null;

export function FeaturesPanel() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activePanel, setActivePanel] = useState<FeaturePanel>(null);

  const features = [
    {
      id: "score" as const,
      name: "Resume Score",
      description: "Real-time quality assessment",
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      id: "job-match" as const,
      name: "Job Match",
      description: "Optimize for a job posting",
      icon: Target,
      color: "#3b82f6",
    },
    {
      id: "ats-scan" as const,
      name: "ATS Scan",
      description: "Check ATS compatibility",
      icon: Scan,
      color: "#8b5cf6",
    },
    {
      id: "customize" as const,
      name: "Customize",
      description: "Template, colors & fonts",
      icon: Palette,
      color: "#f59e0b",
    },
    {
      id: "export" as const,
      name: "Export PDF",
      description: "Download your resume",
      icon: Download,
      color: "#ec4899",
    },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case "score":
        return <RealtimeScore />;
      case "job-match":
        return <JobMatchPanel />;
      case "ats-scan":
        return <ATSScannerPanel />;
      case "customize":
        return <TemplateCustomizer />;
      case "export":
        return <PDFExport />;
      default:
        return null;
    }
  };

  if (activePanel) {
    return (
      <div className="h-full flex flex-col">
        {/* Panel header */}
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b",
            isDark ? "border-gray-800" : "border-gray-200"
          )}
        >
          <h3 className={cn("font-semibold", isDark ? "text-white" : "text-[#0F172A]")}>
            {features.find((f) => f.id === activePanel)?.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel(null)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-4">{renderPanel()}</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className={cn("font-semibold text-sm mb-4", isDark ? "text-white" : "text-[#0F172A]")}>
        AI Tools & Features
      </h3>

      {features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => setActivePanel(feature.id)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
            isDark
              ? "bg-gray-900 hover:bg-gray-800 border border-gray-800"
              : "bg-white hover:bg-gray-50 border border-gray-200"
          )}
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <feature.icon className="w-4 h-4" style={{ color: feature.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-[#0F172A]")}>
              {feature.name}
            </p>
            <p className={cn("text-xs truncate", isDark ? "text-gray-500" : "text-gray-400")}>
              {feature.description}
            </p>
          </div>
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform group-hover:translate-x-1",
              isDark ? "text-gray-600" : "text-gray-400"
            )}
          />
        </button>
      ))}
    </div>
  );
}
