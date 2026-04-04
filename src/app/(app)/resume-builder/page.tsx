"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  Clock,
  Star,
  Copy,
  Pencil,
  Sparkles,
  Loader2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import {
  ResumeBuilderProvider,
  useResumeBuilder,
  GuidedMode,
} from "@/components/resume-builder/context/resume-builder-context";
import { ResumeWizard } from "@/components/resume-builder/wizard/resume-wizard";
import { ResumeBuilderErrorBoundary } from "@/components/resume-builder/error-boundary";
import { TEMPLATES, TemplateId, ResumeData, WizardStep } from "@/components/resume-builder/types/resume-types";
import { GuidedResumeFlow, GuidedAction } from "@/components/resume-builder/guided-resume-flow";
import { cn } from "@/lib/utils";

interface SavedResume {
  id: string;
  name: string;
  templateId: string;
  content: ResumeData;
  createdAt: string;
  updatedAt: string;
}

function ResumeBuilderContent() {
  const [activeTab, setActiveTab] = useState<"resumes" | "templates">("resumes");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { openWizard, loadResume, openWizardAtStep, loadResumeWithMode } = useResumeBuilder();

  // Data fetching state
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Guided flow state
  const [showGuidedFlow, setShowGuidedFlow] = useState(true);
  const [userExperienceLevel, setUserExperienceLevel] = useState<GuidedMode>(null);
  const [hasCheckedFirstVisit, setHasCheckedFirstVisit] = useState(false);

  // Fetch user's experience level preference
  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data.profile?.resumeExperienceLevel) {
            setUserExperienceLevel(data.profile.resumeExperienceLevel as GuidedMode);
          }
        }
      } catch (err) {
        console.error("Error fetching user preferences:", err);
      }
    };
    fetchUserPreference();
  }, []);

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume?includeContent=true");
      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }
      const data = await response.json();
      setResumes(data.resumes || []);
      setHasCheckedFirstVisit(true);
    } catch (err) {
      setError("Failed to load your resumes. Please try again.");
      console.error("Error fetching resumes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for saving experience level preference
  const handleSaveExperienceLevel = useCallback(async (level: GuidedMode) => {
    setUserExperienceLevel(level);
    try {
      await fetch("/api/profile/experience-level", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeExperienceLevel: level }),
      });
    } catch (err) {
      console.error("Error saving experience level:", err);
    }
  }, []);

  // Handler for guided flow completion
  const handleGuidedAction = useCallback(async (action: GuidedAction) => {
    setShowGuidedFlow(false);

    if (action.type === "browse") {
      setActiveTab("templates");
      return;
    }

    if (action.type === "dismiss") {
      return;
    }

    if (action.type === "create-new") {
      if (action.cloneExisting && resumes.length > 0) {
        // Clone existing resume
        try {
          const response = await fetch(`/api/resume/${resumes[0].id}`);
          if (!response.ok) throw new Error("Failed to fetch resume");
          const resume = await response.json();

          const createResponse = await fetch("/api/resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `${resume.name} (Copy)`,
              templateId: resume.templateId,
              content: resume.content,
            }),
          });

          if (!createResponse.ok) throw new Error("Failed to create resume");

          const newResume = await createResponse.json();
          await fetchResumes();
          await loadResume(newResume.id);
        } catch (err) {
          console.error("Error cloning resume:", err);
        }
      } else {
        // Start fresh
        openWizard({ templateId: "modern" });
      }
      return;
    }

    if (action.type === "full-wizard") {
      if (resumes.length > 0) {
        await loadResumeWithMode(resumes[0].id, action.mode);
      }
      return;
    }

    if (action.type === "edit-section") {
      if (resumes.length > 0) {
        await openWizardAtStep(resumes[0].id, action.section, action.mode);
      }
      return;
    }
  }, [resumes, loadResume, loadResumeWithMode, openWizard, openWizardAtStep]);

  // Determine if guided flow should show
  const shouldShowGuidedFlow =
    !isLoading &&
    hasCheckedFirstVisit &&
    resumes.length >= 1 &&
    showGuidedFlow;

  const handleNewResume = (templateId?: TemplateId) => {
    console.log("[Resume Builder] handleNewResume called with templateId:", templateId);
    openWizard({ templateId: templateId || "modern" });
    console.log("[Resume Builder] openWizard dispatched");
  };

  const handleUploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload the file
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || "Failed to upload resume");
      }

      const uploadData = await uploadResponse.json();

      // Check if parsing failed (upload API already parses the resume)
      if (uploadData.parseError) {
        console.warn("Resume parsing warning:", uploadData.parseError);
        // Continue anyway - we can still create a resume without parsed data
      }

      // Create a new resume with parsed data (or empty if parsing failed)
      const createResponse = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name.replace(/\.[^/.]+$/, "") || "Imported Resume",
          templateId: "modern",
          content: uploadData.parsed || null,
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create resume");
      }

      // Refresh the resume list and open the new resume
      await fetchResumes();
      const newResume = await createResponse.json();
      await loadResume(newResume.id);
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError(err instanceof Error ? err.message : "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleEditResume = async (resumeId: string) => {
    try {
      await loadResume(resumeId);
    } catch (err) {
      console.error("Error loading resume:", err);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    setDeletingId(resumeId);
    try {
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
    } catch (err) {
      console.error("Error deleting resume:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicateResume = async (resumeId: string) => {
    try {
      // First get the resume data
      const response = await fetch(`/api/resume/${resumeId}`);
      if (!response.ok) throw new Error("Failed to fetch resume");
      const resume = await response.json();

      // Create a copy
      const createResponse = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${resume.name} (Copy)`,
          templateId: resume.templateId,
          content: resume.content,
        }),
      });

      if (!createResponse.ok) throw new Error("Failed to duplicate resume");

      // Refresh the list
      fetchResumes();
    } catch (err) {
      console.error("Error duplicating resume:", err);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Stats
  const stats = [
    {
      label: "Resumes Created",
      value: resumes.length,
      icon: FileText,
      color: "#2B8A8A",
    },
    {
      label: "Templates Available",
      value: TEMPLATES.length,
      icon: Sparkles,
      color: "#805AD5",
    },
    { label: "Downloads", value: 0, icon: Download, color: "#38A169" },
    { label: "Popular", value: TEMPLATES.filter((t) => t.popular).length, icon: Star, color: "#D69E2E" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Guided Resume Flow Modal */}
      <AnimatePresence>
        {shouldShowGuidedFlow && resumes[0] && (
          <GuidedResumeFlow
            resume={{
              id: resumes[0].id,
              name: resumes[0].name,
              templateId: resumes[0].templateId,
              content: resumes[0].content,
              updatedAt: resumes[0].updatedAt,
            }}
            userExperienceLevel={userExperienceLevel}
            onComplete={handleGuidedAction}
            onDismiss={() => setShowGuidedFlow(false)}
            onSaveExperienceLevel={handleSaveExperienceLevel}
          />
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-5 rounded-2xl border transition-all ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p
              className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {stat.value}
            </p>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Your Resumes
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Create and manage professional resumes
          </p>
        </div>
        <div className="flex gap-3">
          <label
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-xl cursor-pointer transition-colors",
              isUploading ? "opacity-50 cursor-not-allowed" : "",
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? "Uploading..." : "Upload Resume"}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleUploadResume}
              disabled={isUploading}
            />
          </label>
          <Button
            onClick={() => handleNewResume()}
            className={cn(
              "rounded-xl px-6",
              isDark
                ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
                : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Resume
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`flex gap-1 p-1 rounded-xl w-fit mb-6 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <button
          onClick={() => setActiveTab("resumes")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "resumes"
              ? isDark
                ? "bg-gray-700 text-white shadow-sm"
                : "bg-white text-gray-900 shadow-sm"
              : isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Resumes
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "templates"
              ? isDark
                ? "bg-gray-700 text-white shadow-sm"
                : "bg-white text-gray-900 shadow-sm"
              : isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Templates
        </button>
      </motion.div>

      {activeTab === "resumes" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className={cn("w-8 h-8 animate-spin", isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]")} />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl",
                isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"
              )}
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <Button size="sm" variant="ghost" onClick={fetchResumes}>
                Retry
              </Button>
            </div>
          )}

          {/* Resumes grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Card */}
              <div
                onClick={() => handleNewResume()}
                className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[300px] ${
                  isDark
                    ? "border-gray-700 hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5"
                    : "border-gray-200 hover:border-[#2B8A8A] hover:bg-[#2B8A8A]/5"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                    isDark
                      ? "bg-gray-800 group-hover:bg-[#4FD1C5]/10"
                      : "bg-gray-100 group-hover:bg-[#2B8A8A]/10"
                  }`}
                >
                  <Plus
                    className={`h-8 w-8 ${isDark ? "text-gray-500 group-hover:text-[#4FD1C5]" : "text-gray-400 group-hover:text-[#2B8A8A]"}`}
                  />
                </div>
                <h3
                  className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Create New Resume
                </h3>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Start from scratch or use a template
                </p>
              </div>

              {/* Saved Resumes */}
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className={`rounded-2xl border overflow-hidden transition-all group ${
                    isDark
                      ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                      : "bg-white border-gray-100 hover:shadow-lg hover:border-[#2B8A8A]/30"
                  }`}
                >
                  {/* Preview */}
                  <div
                    className={`aspect-[8.5/11] relative ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                  >
                    <div
                      className={`absolute inset-4 rounded-lg shadow-sm p-4 ${isDark ? "bg-gray-900" : "bg-white"}`}
                    >
                      <div
                        className={`h-4 w-24 rounded mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                      />
                      <div
                        className={`h-2 w-32 rounded mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                      />
                      <div className="space-y-2">
                        <div
                          className={`h-2 w-full rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                        />
                        <div
                          className={`h-2 w-full rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                        />
                        <div
                          className={`h-2 w-3/4 rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
                        />
                      </div>
                    </div>
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditResume(resume.id)}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white text-white hover:bg-white/20"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {resume.name}
                        </h3>
                        <p
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {resume.templateId.charAt(0).toUpperCase() +
                            resume.templateId.slice(1)}{" "}
                          template
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(resume.updatedAt)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDuplicateResume(resume.id)}
                          className={`p-1.5 rounded ${isDark ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className={`p-1.5 rounded ${isDark ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          disabled={deletingId === resume.id}
                          className={`p-1.5 rounded ${isDark ? "text-gray-500 hover:text-red-400 hover:bg-gray-800" : "text-gray-400 hover:text-red-600 hover:bg-gray-100"}`}
                        >
                          {deletingId === resume.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && resumes.length === 0 && (
            <div
              className={cn(
                "text-center py-12 rounded-2xl",
                isDark ? "bg-gray-900" : "bg-gray-50"
              )}
            >
              <FileText
                className={cn(
                  "w-16 h-16 mx-auto mb-4",
                  isDark ? "text-gray-700" : "text-gray-300"
                )}
              />
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                No resumes yet
              </h3>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}
              >
                Create your first professional resume in minutes
              </p>
              <Button
                onClick={() => handleNewResume()}
                className={cn(
                  isDark
                    ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
                    : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`rounded-2xl border overflow-hidden transition-all cursor-pointer group ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                  : "bg-white border-gray-100 hover:shadow-lg hover:border-[#2B8A8A]/30"
              }`}
            >
              <div
                className={`aspect-[8.5/11] flex items-center justify-center relative ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900"
                    : "bg-gradient-to-br from-gray-50 to-gray-100"
                }`}
              >
                <span className="text-6xl">{template.preview}</span>
                {template.popular && (
                  <span
                    className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
                      isDark
                        ? "bg-[#4FD1C5] text-gray-900"
                        : "bg-[#2B8A8A] text-white"
                    }`}
                  >
                    Popular
                  </span>
                )}
                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${
                    isDark ? "bg-[#4FD1C5]/80" : "bg-[#2B8A8A]/80"
                  }`}
                >
                  <Button
                    onClick={() => handleNewResume(template.id)}
                    className={
                      isDark
                        ? "bg-gray-900 text-[#4FD1C5] hover:bg-gray-800"
                        : "bg-white text-[#2B8A8A] hover:bg-gray-100"
                    }
                  >
                    Use Template
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {template.name}
                </h3>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Resume Wizard Modal */}
      <ResumeWizard />
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <ResumeBuilderErrorBoundary>
      <ResumeBuilderProvider>
        <ResumeBuilderContent />
      </ResumeBuilderProvider>
    </ResumeBuilderErrorBoundary>
  );
}
