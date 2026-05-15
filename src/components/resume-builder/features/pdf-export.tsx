"use client";

import { useState, useRef } from "react";
import { Download, Loader2, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeBuilder } from "../context/resume-builder-context";
import { ModernTemplate } from "../templates/modern-template";
import { ClassicTemplate } from "../templates/classic-template";
import { ProfessionalTemplate } from "../templates/professional-template";
import { CleanTemplate } from "../templates/clean-template";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function PDFExport() {
  const { state } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow pop-ups to download your resume");
      }

      // Get the template HTML
      const templateHtml = printRef.current?.innerHTML || "";

      // Write the print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${state.resumeName} - Resume</title>
            <style>
              @page {
                size: letter;
                margin: 0;
              }
              @media print {
                html, body {
                  width: 8.5in;
                  height: 11in;
                  margin: 0;
                  padding: 0;
                }
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ${templateHtml}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          setExportSuccess(true);
          setTimeout(() => setExportSuccess(false), 3000);
        }, 250);
      };
    } catch (error) {
      console.error("Export failed:", error);
      alert(error instanceof Error ? error.message : "Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden template for printing */}
      <div
        ref={printRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "8.5in",
          minHeight: "11in",
          background: "white",
        }}
      >
        {renderTemplate()}
      </div>

      {/* Export UI */}
      <div className={cn("p-4 rounded-xl", isDark ? "bg-gray-900" : "bg-white border border-gray-200")}>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("p-2 rounded-lg", isDark ? "bg-[#4FD1C5]/10" : "bg-[#0D9488]/10")}>
            <FileText className={cn("w-5 h-5", isDark ? "text-[#4FD1C5]" : "text-[#0D9488]")} />
          </div>
          <div>
            <h4 className={cn("font-medium text-sm", isDark ? "text-white" : "text-[#0F172A]")}>
              Download Resume
            </h4>
            <p className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
              Export as PDF for job applications
            </p>
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className={cn(
            "w-full gap-2",
            exportSuccess
              ? "bg-green-600 hover:bg-green-700 text-white"
              : isDark
              ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-[#0F172A]"
              : "bg-[#F59E0B] hover:bg-[#D97706] text-white"
          )}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing PDF...
            </>
          ) : exportSuccess ? (
            <>
              <Check className="w-4 h-4" />
              PDF Ready!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
        </Button>

        <p className={cn("text-xs text-center mt-2", isDark ? "text-gray-600" : "text-gray-400")}>
          Your browser's print dialog will open. Select "Save as PDF" as the destination.
        </p>
      </div>

      {/* Tips */}
      <div className={cn("p-3 rounded-lg text-xs", isDark ? "bg-gray-800/50" : "bg-gray-50")}>
        <p className={cn("font-medium mb-1", isDark ? "text-gray-300" : "text-gray-700")}>
          PDF Export Tips:
        </p>
        <ul className={cn("space-y-0.5 list-disc list-inside", isDark ? "text-gray-500" : "text-gray-500")}>
          <li>Use "Save as PDF" in the print dialog</li>
          <li>Keep margins set to "None" for best results</li>
          <li>PDF format is preferred by most ATS systems</li>
        </ul>
      </div>
    </div>
  );
}
