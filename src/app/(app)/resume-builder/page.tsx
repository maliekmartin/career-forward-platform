"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  MoreHorizontal,
  Clock,
  Star,
  Copy,
  Pencil,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

const savedResumes = [
  {
    id: 1,
    name: "Professional Resume",
    template: "Modern",
    lastEdited: "2 hours ago",
    starred: true,
  },
  {
    id: 2,
    name: "Tech Industry Resume",
    template: "Clean",
    lastEdited: "3 days ago",
    starred: false,
  },
  {
    id: 3,
    name: "Entry Level Resume",
    template: "Classic",
    lastEdited: "1 week ago",
    starred: false,
  },
];

const templates = [
  { id: 1, name: "Modern", preview: "🎨", popular: true },
  { id: 2, name: "Classic", preview: "📄", popular: false },
  { id: 3, name: "Clean", preview: "✨", popular: true },
  { id: 4, name: "Professional", preview: "💼", popular: false },
  { id: 5, name: "Creative", preview: "🎯", popular: false },
  { id: 6, name: "Executive", preview: "👔", popular: true },
];

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<"resumes" | "templates">("resumes");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Stats for the dashboard-within-dashboard feel
  const stats = [
    { label: "Resumes Created", value: savedResumes.length, icon: FileText, color: "#2B8A8A" },
    { label: "Templates Available", value: templates.length, icon: Sparkles, color: "#805AD5" },
    { label: "Downloads", value: 8, icon: Download, color: "#38A169" },
    { label: "Starred", value: savedResumes.filter(r => r.starred).length, icon: Star, color: "#D69E2E" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
            <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
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
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Your Resumes
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Create and manage professional resumes
          </p>
        </div>
        <Button className={`rounded-xl px-6 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}>
          <Plus className="h-4 w-4 mr-2" />
          New Resume
        </Button>
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
              ? isDark ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
              : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Resumes
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "templates"
              ? isDark ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
              : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Templates
        </button>
      </motion.div>

      {activeTab === "resumes" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-6"
        >
          {/* Create New Card */}
          <div className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[300px] ${
            isDark
              ? "border-gray-700 hover:border-[#4FD1C5] hover:bg-[#4FD1C5]/5"
              : "border-gray-200 hover:border-[#2B8A8A] hover:bg-[#2B8A8A]/5"
          }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isDark
                ? "bg-gray-800 group-hover:bg-[#4FD1C5]/10"
                : "bg-gray-100 group-hover:bg-[#2B8A8A]/10"
            }`}>
              <Plus className={`h-8 w-8 ${isDark ? "text-gray-500 group-hover:text-[#4FD1C5]" : "text-gray-400 group-hover:text-[#2B8A8A]"}`} />
            </div>
            <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Create New Resume
            </h3>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Start from scratch or use a template
            </p>
          </div>

          {/* Saved Resumes */}
          {savedResumes.map((resume) => (
            <div
              key={resume.id}
              className={`rounded-2xl border overflow-hidden transition-all group ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                  : "bg-white border-gray-100 hover:shadow-lg hover:border-[#2B8A8A]/30"
              }`}
            >
              {/* Preview */}
              <div className={`aspect-[8.5/11] relative ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className={`absolute inset-4 rounded-lg shadow-sm p-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
                  <div className={`h-4 w-24 rounded mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className={`h-2 w-32 rounded mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                  <div className="space-y-2">
                    <div className={`h-2 w-full rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                    <div className={`h-2 w-full rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                    <div className={`h-2 w-3/4 rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                  </div>
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
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
                    <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {resume.name}
                    </h3>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {resume.template} template
                    </p>
                  </div>
                  <button className={`p-1 rounded ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                    {resume.starred ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Star className={`h-4 w-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    <Clock className="h-3 w-3" />
                    {resume.lastEdited}
                  </span>
                  <div className="flex gap-1">
                    <button className={`p-1.5 rounded ${isDark ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className={`p-1.5 rounded ${isDark ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>
                      <Download className="h-4 w-4" />
                    </button>
                    <button className={`p-1.5 rounded ${isDark ? "text-gray-500 hover:text-red-400 hover:bg-gray-800" : "text-gray-400 hover:text-red-600 hover:bg-gray-100"}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-6"
        >
          {templates.map((template) => (
            <div
              key={template.id}
              className={`rounded-2xl border overflow-hidden transition-all cursor-pointer group ${
                isDark
                  ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                  : "bg-white border-gray-100 hover:shadow-lg hover:border-[#2B8A8A]/30"
              }`}
            >
              <div className={`aspect-[8.5/11] flex items-center justify-center relative ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 to-gray-900"
                  : "bg-gradient-to-br from-gray-50 to-gray-100"
              }`}>
                <span className="text-6xl">{template.preview}</span>
                {template.popular && (
                  <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${
                    isDark ? "bg-[#4FD1C5] text-gray-900" : "bg-[#2B8A8A] text-white"
                  }`}>
                    Popular
                  </span>
                )}
                {/* Hover overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${
                  isDark ? "bg-[#4FD1C5]/80" : "bg-[#2B8A8A]/80"
                }`}>
                  <Button className={isDark ? "bg-gray-900 text-[#4FD1C5] hover:bg-gray-800" : "bg-white text-[#2B8A8A] hover:bg-gray-100"}>
                    Use Template
                  </Button>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{template.name}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
