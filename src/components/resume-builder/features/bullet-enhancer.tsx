"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface BulletEnhancerProps {
  bullet: string;
  jobTitle?: string;
  onAccept: (newBullet: string) => void;
  onClose: () => void;
}

interface Enhancements {
  conservative: string;
  moderate: string;
  aggressive: string;
}

export function BulletEnhancer({ bullet, jobTitle, onAccept, onClose }: BulletEnhancerProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isLoading, setIsLoading] = useState(false);
  const [enhancements, setEnhancements] = useState<Enhancements | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<keyof Enhancements>("moderate");
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/enhance-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet, jobTitle }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to enhance");
      }

      const data = await response.json();
      setEnhancements(data.enhancements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enhance bullet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (enhancements) {
      onAccept(enhancements[selectedLevel]);
    }
  };

  const levels: { key: keyof Enhancements; label: string; description: string }[] = [
    { key: "conservative", label: "Light", description: "Minor improvements" },
    { key: "moderate", label: "Balanced", description: "Recommended" },
    { key: "aggressive", label: "Strong", description: "Maximum impact" },
  ];

  return (
    <div
      className={cn(
        "p-4 rounded-xl border shadow-lg",
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={cn("w-4 h-4", isDark ? "text-purple-400" : "text-purple-600")} />
          <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>
            Enhance Bullet
          </span>
        </div>
        <button
          onClick={onClose}
          className={cn("p-1 rounded hover:bg-gray-100", isDark && "hover:bg-gray-800")}
        >
          <X className={cn("w-4 h-4", isDark ? "text-gray-500" : "text-gray-400")} />
        </button>
      </div>

      {/* Original bullet */}
      <div className={cn("p-2 rounded-lg mb-3 text-sm", isDark ? "bg-gray-800" : "bg-gray-50")}>
        <span className={cn("text-xs block mb-1", isDark ? "text-gray-500" : "text-gray-400")}>
          Original:
        </span>
        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{bullet}</span>
      </div>

      {!enhancements && !isLoading && (
        <Button
          onClick={handleEnhance}
          className={cn(
            "w-full gap-2",
            isDark
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        >
          <Sparkles className="w-4 h-4" />
          Generate Enhancements
        </Button>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className={cn("w-5 h-5 animate-spin", isDark ? "text-purple-400" : "text-purple-600")} />
          <span className={cn("ml-2 text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            Enhancing...
          </span>
        </div>
      )}

      {error && (
        <div className={cn("p-2 rounded-lg text-sm mb-3", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
          {error}
          <Button size="sm" variant="ghost" onClick={handleEnhance} className="ml-2">
            <RotateCcw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {enhancements && (
        <div className="space-y-3">
          {/* Enhancement level selector */}
          <div className="flex gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
            {levels.map((level) => (
              <button
                key={level.key}
                onClick={() => setSelectedLevel(level.key)}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors",
                  selectedLevel === level.key
                    ? isDark
                      ? "bg-purple-600 text-white"
                      : "bg-purple-600 text-white"
                    : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div
            className={cn(
              "p-3 rounded-lg border-2",
              isDark
                ? "bg-purple-900/20 border-purple-500/30"
                : "bg-purple-50 border-purple-200"
            )}
          >
            <span className={cn("text-xs block mb-1", isDark ? "text-purple-400" : "text-purple-600")}>
              Enhanced ({levels.find((l) => l.key === selectedLevel)?.description}):
            </span>
            <span className={cn("text-sm", isDark ? "text-white" : "text-gray-900")}>
              {enhancements[selectedLevel]}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleEnhance}
              variant="outline"
              size="sm"
              className={cn("flex-1", isDark && "border-gray-700")}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Regenerate
            </Button>
            <Button
              onClick={handleAccept}
              size="sm"
              className={cn(
                "flex-1",
                isDark
                  ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
                  : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
              )}
            >
              <Check className="w-3 h-3 mr-1" />
              Use This
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
