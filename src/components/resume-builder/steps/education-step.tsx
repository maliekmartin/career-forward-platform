"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeBuilder } from "../context/resume-builder-context";
import { Education, generateId } from "../types/resume-types";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const DEGREE_TYPES = [
  "High School Diploma",
  "GED",
  "Associate of Arts (AA)",
  "Associate of Science (AS)",
  "Associate of Applied Science (AAS)",
  "Bachelor of Arts (BA)",
  "Bachelor of Science (BS)",
  "Bachelor of Business Administration (BBA)",
  "Master of Arts (MA)",
  "Master of Science (MS)",
  "Master of Business Administration (MBA)",
  "Doctor of Philosophy (PhD)",
  "Doctor of Medicine (MD)",
  "Juris Doctor (JD)",
  "Certificate",
  "Professional Certification",
  "Other",
];

export function EducationStep() {
  const { state, addEducation, updateEducation, deleteEducation } =
    useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      school: "",
      degree: "",
      fieldOfStudy: "",
      city: "",
      state: "",
      graduationDate: "",
      gpa: "",
      honors: "",
    };
    addEducation(newEdu);
    setExpandedId(newEdu.id);
  };

  const handleDeleteEducation = (id: string) => {
    deleteEducation(id);
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
          Education
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Add your educational background, starting with your highest degree or most recent education.
        </p>
      </div>

      {/* Education list */}
      <div className="space-y-4">
        {state.data.education.map((edu, index) => (
          <div
            key={edu.id}
            className={cn(
              "rounded-xl border overflow-hidden transition-all",
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200",
              expandedId === edu.id && (isDark ? "ring-1 ring-[#4FD1C5]/30" : "ring-1 ring-[#2B8A8A]/30")
            )}
          >
            {/* Header - always visible */}
            <button
              onClick={() =>
                setExpandedId(expandedId === edu.id ? null : edu.id)
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
                  {edu.school || "School Name"}
                </p>
                <p
                  className={cn(
                    "text-sm truncate",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {edu.degree || "Degree"} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEducation(edu.id);
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
                {expandedId === edu.id ? (
                  <ChevronUp className={isDark ? "text-gray-400" : "text-gray-500"} />
                ) : (
                  <ChevronDown className={isDark ? "text-gray-400" : "text-gray-500"} />
                )}
              </div>
            </button>

            {/* Expanded content */}
            {expandedId === edu.id && (
              <div
                className={cn(
                  "p-4 border-t space-y-4",
                  isDark ? "border-gray-800" : "border-gray-200"
                )}
              >
                {/* School and degree */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <Building2 className="w-3 h-3 inline mr-1" />
                      School/University *
                    </Label>
                    <Input
                      placeholder="University of Washington"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(edu.id, { school: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>
                      <GraduationCap className="w-3 h-3 inline mr-1" />
                      Degree *
                    </Label>
                    <select
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                      className={cn(inputClass, "w-full px-3")}
                    >
                      <option value="">Select degree</option>
                      {DEGREE_TYPES.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field of study */}
                <div>
                  <Label className={labelClass}>Field of Study / Major</Label>
                  <Input
                    placeholder="Computer Science"
                    value={edu.fieldOfStudy}
                    onChange={(e) =>
                      updateEducation(edu.id, { fieldOfStudy: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <MapPin className="w-3 h-3 inline mr-1" />
                      City
                    </Label>
                    <Input
                      placeholder="Seattle"
                      value={edu.city}
                      onChange={(e) =>
                        updateEducation(edu.id, { city: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>State</Label>
                    <select
                      value={edu.state}
                      onChange={(e) =>
                        updateEducation(edu.id, { state: e.target.value })
                      }
                      className={cn(inputClass, "w-full px-3")}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Graduation date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Graduation Date
                    </Label>
                    <Input
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { graduationDate: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>GPA (Optional)</Label>
                    <Input
                      placeholder="3.8"
                      value={edu.gpa || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, { gpa: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Honors */}
                <div>
                  <Label className={labelClass}>
                    <Award className="w-3 h-3 inline mr-1" />
                    Honors & Awards (Optional)
                  </Label>
                  <Input
                    placeholder="Magna Cum Laude, Dean's List"
                    value={edu.honors || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, { honors: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add education button */}
        <Button
          variant="outline"
          onClick={handleAddEducation}
          className={cn(
            "w-full h-14 border-dashed gap-2",
            isDark
              ? "border-gray-700 text-gray-400 hover:text-[#4FD1C5] hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5"
              : "border-gray-300 text-gray-500 hover:text-[#2B8A8A] hover:border-[#2B8A8A] hover:bg-[#2B8A8A]/5"
          )}
        >
          <Plus className="w-5 h-5" />
          Add Education
        </Button>
      </div>

      {/* No education prompt */}
      {state.data.education.length === 0 && (
        <div
          className={cn(
            "text-center py-8 rounded-xl",
            isDark ? "bg-gray-800/50" : "bg-gray-50"
          )}
        >
          <GraduationCap
            className={cn(
              "w-12 h-12 mx-auto mb-3",
              isDark ? "text-gray-600" : "text-gray-300"
            )}
          />
          <p
            className={cn(
              "font-medium mb-1",
              isDark ? "text-gray-300" : "text-gray-700"
            )}
          >
            No education added yet
          </p>
          <p
            className={cn(
              "text-sm",
              isDark ? "text-gray-500" : "text-gray-500"
            )}
          >
            Add your educational background to strengthen your resume
          </p>
        </div>
      )}

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
          Tips for Education
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Include GPA if it's 3.5 or higher (or 3.0+ for recent graduates)</li>
          <li>List relevant coursework or projects if you're a recent graduate</li>
          <li>Include certifications and professional development courses</li>
          <li>For experienced professionals, education can be brief</li>
          <li>You can omit graduation dates if you're concerned about age discrimination</li>
        </ul>
      </div>
    </div>
  );
}
