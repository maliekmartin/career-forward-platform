"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Award,
  Building2,
  Calendar,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeBuilder } from "../context/resume-builder-context";
import { Certification, generateId } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { WhyThisMatters, useBeginnerMode } from "../beginner-mode-helpers";

export function CertificationsStep() {
  const { state, addCertification, updateCertification, deleteCertification } =
    useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { guidedMode } = state;
  const isBeginnerMode = useBeginnerMode(guidedMode);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      dateObtained: "",
      expirationDate: "",
      credentialId: "",
    };
    addCertification(newCert);
    setExpandedId(newCert.id);
  };

  const handleDeleteCertification = (id: string) => {
    deleteCertification(id);
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const inputClass = cn(
    "h-10 rounded-lg transition-colors",
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]/20"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
  );

  const labelClass = cn(
    "text-xs font-medium mb-1 block",
    isDark ? "text-gray-400" : "text-gray-600"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Certifications
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Add professional certifications, licenses, or credentials.
          This section is optional but can strengthen your resume.
        </p>
      </div>

      {/* Optional badge */}
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
          isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        )}
      >
        <span className="text-xs">Optional</span>
        <span>•</span>
        <span className="text-xs">Skip if you don't have certifications</span>
      </div>

      {/* Beginner Mode: Why This Matters */}
      {isBeginnerMode && <WhyThisMatters step="certifications" isDark={isDark} />}

      {/* Certifications list */}
      <div className="space-y-4">
        {state.data.certifications.map((cert, index) => (
          <div
            key={cert.id}
            className={cn(
              "rounded-xl border overflow-hidden transition-all",
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200",
              expandedId === cert.id && (isDark ? "ring-1 ring-[#4FD1C5]/30" : "ring-1 ring-[#2B8A8A]/30")
            )}
          >
            {/* Header - always visible */}
            <button
              onClick={() =>
                setExpandedId(expandedId === cert.id ? null : cert.id)
              }
              className={cn(
                "w-full flex items-center gap-3 p-4 text-left transition-colors",
                isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
              )}
            >
              <GripVertical
                className={cn(
                  "w-5 h-5 cursor-grab",
                  isDark ? "text-gray-600" : "text-gray-300"
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium truncate",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {cert.name || "Certification Name"}
                </p>
                <p
                  className={cn(
                    "text-sm truncate",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {cert.issuer || "Issuing Organization"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCertification(cert.id);
                  }}
                  className={cn(
                    "h-8 w-8",
                    isDark
                      ? "text-gray-500 hover:text-red-400 hover:bg-red-900/20"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedId === cert.id ? (
                  <ChevronUp className={isDark ? "text-gray-400" : "text-gray-500"} />
                ) : (
                  <ChevronDown className={isDark ? "text-gray-400" : "text-gray-500"} />
                )}
              </div>
            </button>

            {/* Expanded content */}
            {expandedId === cert.id && (
              <div
                className={cn(
                  "p-4 border-t space-y-4",
                  isDark ? "border-gray-800" : "border-gray-200"
                )}
              >
                {/* Name and issuer */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <Award className="w-3 h-3 inline mr-1" />
                      Certification Name *
                    </Label>
                    <Input
                      placeholder="PMP, AWS Solutions Architect, etc."
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(cert.id, { name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      <Building2 className="w-3 h-3 inline mr-1" />
                      Issuing Organization *
                    </Label>
                    <Input
                      placeholder="Project Management Institute"
                      value={cert.issuer}
                      onChange={(e) =>
                        updateCertification(cert.id, { issuer: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Date Obtained
                    </Label>
                    <Input
                      type="month"
                      value={cert.dateObtained}
                      onChange={(e) =>
                        updateCertification(cert.id, { dateObtained: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      Expiration Date (if applicable)
                    </Label>
                    <Input
                      type="month"
                      value={cert.expirationDate || ""}
                      onChange={(e) =>
                        updateCertification(cert.id, { expirationDate: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Credential ID */}
                <div>
                  <Label className={labelClass}>
                    <Hash className="w-3 h-3 inline mr-1" />
                    Credential ID (Optional)
                  </Label>
                  <Input
                    placeholder="ABC123XYZ"
                    value={cert.credentialId || ""}
                    onChange={(e) =>
                      updateCertification(cert.id, { credentialId: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add certification button */}
        <Button
          variant="outline"
          onClick={handleAddCertification}
          className={cn(
            "w-full h-14 border-dashed gap-2",
            isDark
              ? "border-gray-700 text-gray-400 hover:text-[#4FD1C5] hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5"
              : "border-gray-300 text-gray-500 hover:text-[#2B8A8A] hover:border-[#2B8A8A] hover:bg-[#2B8A8A]/5"
          )}
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </Button>
      </div>

      {/* Common certifications suggestion */}
      <div
        className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
        )}
      >
        <p
          className={cn(
            "font-medium text-sm mb-3",
            isDark ? "text-gray-300" : "text-gray-700"
          )}
        >
          Common Certifications by Industry
        </p>
        <div className="space-y-3">
          <CertCategory
            title="Technology"
            certs={["AWS Certified", "Google Cloud", "CompTIA A+", "PMP", "Scrum Master"]}
            isDark={isDark}
          />
          <CertCategory
            title="Healthcare"
            certs={["BLS/CPR", "ACLS", "CNA", "RN License", "HIPAA Training"]}
            isDark={isDark}
          />
          <CertCategory
            title="Finance"
            certs={["CPA", "CFA", "Series 7", "Series 63", "CFP"]}
            isDark={isDark}
          />
          <CertCategory
            title="Marketing"
            certs={["Google Analytics", "HubSpot", "Facebook Blueprint", "Google Ads"]}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Tips */}
      <div
        className={cn(
          "p-4 rounded-xl",
          isDark ? "bg-[#4FD1C5]/5 border border-[#4FD1C5]/20" : "bg-[#2B8A8A]/5 border border-[#2B8A8A]/20"
        )}
      >
        <h4
          className={cn(
            "font-medium mb-2 text-sm",
            isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
          )}
        >
          Tips for Certifications
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Only include relevant, current certifications</li>
          <li>List certifications that are required or preferred for your target role</li>
          <li>Include credential IDs if they can be verified online</li>
          <li>If a certification has expired, consider removing it or noting it's expired</li>
        </ul>
      </div>
    </div>
  );
}

function CertCategory({
  title,
  certs,
  isDark,
}: {
  title: string;
  certs: string[];
  isDark: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "text-xs font-medium mb-1",
          isDark ? "text-gray-400" : "text-gray-500"
        )}
      >
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {certs.map((cert) => (
          <span
            key={cert}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              isDark
                ? "bg-gray-800 text-gray-300"
                : "bg-white text-gray-600 border border-gray-200"
            )}
          >
            {cert}
          </span>
        ))}
      </div>
    </div>
  );
}
