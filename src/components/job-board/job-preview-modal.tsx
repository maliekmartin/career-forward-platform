"use client";

import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ExternalLink,
  Laptop,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Briefcase,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Job, formatPay, formatJobDate, getSourceInfo } from "@/lib/job-data";
import { cn } from "@/lib/utils";

interface JobPreviewModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
  isApplied: boolean;
  isApplying: boolean;
  isDark: boolean;
}

export function JobPreviewModal({
  job,
  isOpen,
  onClose,
  onApply,
  isApplied,
  isApplying,
  isDark,
}: JobPreviewModalProps) {
  if (!job) return null;

  const sourceInfo = getSourceInfo(job.source);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col",
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start gap-4">
            {/* Company Logo Placeholder */}
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                isDark ? "bg-gray-800" : "bg-gray-100"
              )}
            >
              <Building2 className="h-7 w-7 text-gray-400" />
            </div>

            <div className="flex-1 min-w-0">
              <DialogTitle
                className={cn(
                  "text-xl font-semibold leading-tight",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                {job.title}
              </DialogTitle>
              <p
                className={cn(
                  "font-medium mt-1",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}
              >
                {job.company}
              </p>
            </div>

            {/* Source Badge */}
            <span
              className={cn(
                "text-xs px-3 py-1 rounded-full flex-shrink-0",
                sourceInfo.bgColor
              )}
              style={{ color: sourceInfo.color }}
            >
              {sourceInfo.name}
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {/* Quick Info */}
          <div
            className={cn(
              "grid grid-cols-2 gap-3 py-4 border-b",
              isDark ? "border-gray-800" : "border-gray-100"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                isDark ? "text-gray-300" : "text-gray-600"
              )}
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              {job.location}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                isDark ? "text-gray-300" : "text-gray-600"
              )}
            >
              <DollarSign className="h-4 w-4 text-gray-400" />
              {formatPay(job)}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                isDark ? "text-gray-300" : "text-gray-600"
              )}
            >
              <Clock className="h-4 w-4 text-gray-400" />
              {job.hoursType.charAt(0).toUpperCase() + job.hoursType.slice(1)}
              {job.hoursPerWeek && ` (${job.hoursPerWeek} hrs/wk)`}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 text-sm",
                isDark ? "text-gray-300" : "text-gray-600"
              )}
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              Posted {formatJobDate(job.datePosted)}
            </div>
            {job.remote && (
              <div className="flex items-center gap-2 text-sm text-[#2B8A8A]">
                <Laptop className="h-4 w-4" />
                Remote Position
              </div>
            )}
          </div>

          {/* Description */}
          <div className="py-4">
            <h4
              className={cn(
                "font-medium mb-3",
                isDark ? "text-gray-200" : "text-gray-800"
              )}
            >
              Job Description
            </h4>
            <div
              className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap",
                isDark ? "text-gray-400" : "text-gray-600"
              )}
            >
              {job.description || "No description available."}
            </div>
          </div>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div
              className={cn(
                "py-4 border-t",
                isDark ? "border-gray-800" : "border-gray-100"
              )}
            >
              <h4
                className={cn(
                  "font-medium mb-3",
                  isDark ? "text-gray-200" : "text-gray-800"
                )}
              >
                Benefits
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full",
                      isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Apply Button */}
        <div
          className={cn(
            "flex items-center justify-between pt-4 border-t flex-shrink-0",
            isDark ? "border-gray-800" : "border-gray-100"
          )}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className={cn(
              "rounded-xl",
              isDark
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            Close
          </Button>

          {isApplied ? (
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium">
              <CheckCircle2 className="h-5 w-5" />
              Already Applied
            </span>
          ) : (
            <Button
              onClick={() => onApply(job)}
              disabled={isApplying}
              className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl px-6 py-3 h-auto"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding to Tracker...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
