"use client";

import { useState } from "react";
import { Palette, Type, Layout, Check } from "lucide-react";
import { useResumeBuilder } from "../context/resume-builder-context";
import { TEMPLATES, TemplateId } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

// Predefined color schemes
const COLOR_SCHEMES = [
  { id: "teal", name: "Teal", primary: "#0D9488", secondary: "#4FD1C5" },
  { id: "blue", name: "Blue", primary: "#1e40af", secondary: "#3b82f6" },
  { id: "purple", name: "Purple", primary: "#7c3aed", secondary: "#a78bfa" },
  { id: "green", name: "Green", primary: "#059669", secondary: "#34d399" },
  { id: "red", name: "Red", primary: "#dc2626", secondary: "#f87171" },
  { id: "orange", name: "Orange", primary: "#ea580c", secondary: "#fb923c" },
  { id: "gray", name: "Gray", primary: "#0F172A", secondary: "#6b7280" },
  { id: "black", name: "Black", primary: "#111827", secondary: "#0F172A" },
];

// Font families (ATS-safe)
const FONT_FAMILIES = [
  { id: "arial", name: "Arial", family: "Arial, sans-serif" },
  { id: "calibri", name: "Calibri", family: "Calibri, Arial, sans-serif" },
  { id: "georgia", name: "Georgia", family: "Georgia, serif" },
  { id: "helvetica", name: "Helvetica", family: "'Helvetica Neue', Arial, sans-serif" },
  { id: "times", name: "Times New Roman", family: "'Times New Roman', serif" },
  { id: "verdana", name: "Verdana", family: "Verdana, sans-serif" },
];

export function TemplateCustomizer() {
  const { state, setTemplate } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [selectedColor, setSelectedColor] = useState(COLOR_SCHEMES[0]);
  const [selectedFont, setSelectedFont] = useState(FONT_FAMILIES[0]);
  const [activeTab, setActiveTab] = useState<"template" | "colors" | "fonts">("template");

  const tabs = [
    { id: "template", label: "Template", icon: Layout },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "fonts", label: "Fonts", icon: Type },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className={cn("flex gap-1 p-1 rounded-lg", isDark ? "bg-gray-800" : "bg-gray-100")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-colors",
              activeTab === tab.id
                ? isDark
                  ? "bg-gray-700 text-white"
                  : "bg-white text-[#0F172A] shadow-sm"
                : isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-600 hover:text-[#0F172A]"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Template Selection */}
      {activeTab === "template" && (
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setTemplate(template.id)}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-left",
                state.templateId === template.id
                  ? isDark
                    ? "border-[#4FD1C5] bg-[#4FD1C5]/10"
                    : "border-[#0D9488] bg-[#0D9488]/10"
                  : isDark
                  ? "border-gray-800 hover:border-gray-700"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{template.preview}</span>
                {state.templateId === template.id && (
                  <Check
                    className={cn(
                      "w-4 h-4",
                      isDark ? "text-[#4FD1C5]" : "text-[#0D9488]"
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-[#0F172A]"
                )}
              >
                {template.name}
              </p>
              <p
                className={cn(
                  "text-xs line-clamp-2",
                  isDark ? "text-gray-500" : "text-gray-400"
                )}
              >
                {template.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Color Selection */}
      {activeTab === "colors" && (
        <div className="space-y-3">
          <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
            Accent color for headers and highlights
          </p>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_SCHEMES.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "relative p-2 rounded-lg border-2 transition-all",
                  selectedColor.id === color.id
                    ? isDark
                      ? "border-white"
                      : "border-gray-900"
                    : "border-transparent"
                )}
              >
                <div
                  className="w-full h-8 rounded-md mb-1"
                  style={{
                    background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`,
                  }}
                />
                <p
                  className={cn(
                    "text-xs text-center",
                    isDark ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  {color.name}
                </p>
                {selectedColor.id === color.id && (
                  <div
                    className={cn(
                      "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
                      isDark ? "bg-white" : "bg-gray-900"
                    )}
                  >
                    <Check className={cn("w-2.5 h-2.5", isDark ? "text-[#0F172A]" : "text-white")} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className={cn("text-xs mt-2", isDark ? "text-gray-600" : "text-gray-400")}>
            Note: Color customization applies to PDF export. Preview shows default template colors.
          </p>
        </div>
      )}

      {/* Font Selection */}
      {activeTab === "fonts" && (
        <div className="space-y-2">
          <p className={cn("text-xs mb-3", isDark ? "text-gray-500" : "text-gray-400")}>
            All fonts are ATS-compatible
          </p>
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                selectedFont.id === font.id
                  ? isDark
                    ? "border-[#4FD1C5] bg-[#4FD1C5]/10"
                    : "border-[#0D9488] bg-[#0D9488]/10"
                  : isDark
                  ? "border-gray-800 hover:border-gray-700"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <span
                style={{ fontFamily: font.family }}
                className={cn("text-sm", isDark ? "text-white" : "text-[#0F172A]")}
              >
                {font.name}
              </span>
              {selectedFont.id === font.id && (
                <Check
                  className={cn(
                    "w-4 h-4",
                    isDark ? "text-[#4FD1C5]" : "text-[#0D9488]"
                  )}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
