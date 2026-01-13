"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Brain,
  Heart,
  Target,
  ExternalLink,
  Clock,
  Sparkles,
  FileText,
  Share2,
  MessageSquare,
  ListTodo,
  CheckCircle2,
  X,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { demoClients } from "@/lib/demo-data";

interface Assessment {
  id: number;
  name: string;
  description: string;
  duration: string;
  questions: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  link: string;
  category: "interests" | "skills" | "personality" | "values";
}

const assessments: Assessment[] = [
  {
    id: 1,
    name: "O*NET Interest Profiler",
    description:
      "Discover interests and how they relate to the world of work. Helps identify careers that match personal interests.",
    duration: "30 min",
    questions: 60,
    icon: Heart,
    color: "#E53E3E",
    link: "https://www.mynextmove.org/explore/ip",
    category: "interests",
  },
  {
    id: 2,
    name: "CareerOneStop Skills Matcher",
    description:
      "Rate skills and find careers that match. Shows what skills might need development for target careers.",
    duration: "20 min",
    questions: 40,
    icon: Target,
    color: "#38A169",
    link: "https://www.careeronestop.org/toolkit/Skills/skills-matcher.aspx",
    category: "skills",
  },
  {
    id: 3,
    name: "Myers-Briggs Type Indicator (MBTI)",
    description:
      "Understand personality type and how it influences career preferences and work style.",
    duration: "15 min",
    questions: 93,
    icon: Brain,
    color: "#805AD5",
    link: "https://www.16personalities.com/",
    category: "personality",
  },
  {
    id: 4,
    name: "Work Values Assessment",
    description:
      "Identify what matters most in a job - from salary to work-life balance to helping others.",
    duration: "10 min",
    questions: 20,
    icon: Compass,
    color: "#2B8A8A",
    link: "https://www.mynextmove.org/explore/ip",
    category: "values",
  },
];

export default function CoachAssessmentsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Share modal state
  const [shareModalAssessment, setShareModalAssessment] = useState<Assessment | null>(null);
  const [shareMethod, setShareMethod] = useState<"message" | "task" | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Stats for the dashboard-within-dashboard feel
  const stats = [
    { label: "Available", value: assessments.length, icon: FileText, color: "#2B8A8A" },
    { label: "Job Seekers", value: demoClients.length, icon: Users, color: "#805AD5" },
    { label: "Assigned This Week", value: 8, icon: ListTodo, color: "#D69E2E" },
    { label: "Completions", value: 14, icon: TrendingUp, color: "#38A169" },
  ];

  const handleShare = (assessment: Assessment) => {
    setShareModalAssessment(assessment);
    setShareMethod(null);
    setSelectedClient(null);
  };

  const handleShareConfirm = () => {
    if (!shareModalAssessment || !shareMethod || !selectedClient) return;

    const client = demoClients.find((c) => c.id === selectedClient);
    if (!client) return;

    // In a real app, this would send the message or create a task
    setShowSuccessToast(
      shareMethod === "message"
        ? `Assessment shared with ${client.firstName} via message`
        : `Assessment assigned to ${client.firstName} as a task`
    );
    setShareModalAssessment(null);
    setShareMethod(null);
    setSelectedClient(null);

    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const getCategoryLabel = (category: Assessment["category"]) => {
    switch (category) {
      case "interests":
        return "Interests";
      case "skills":
        return "Skills";
      case "personality":
        return "Personality";
      case "values":
        return "Values";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <p className="font-medium">{showSuccessToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShareModalAssessment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>
                    Share Assessment
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {shareModalAssessment.name}
                  </p>
                </div>
                <button
                  onClick={() => setShareModalAssessment(null)}
                  className={`p-1 rounded-lg transition-colors ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              </div>

              {/* Share Method Selection */}
              {!shareMethod && (
                <div className="space-y-3">
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    How would you like to share this assessment?
                  </p>
                  <button
                    onClick={() => setShareMethod("message")}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isDark
                        ? "border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                      <MessageSquare className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        Send via Message
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Share with a clickable link in messages
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setShareMethod("task")}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isDark
                        ? "border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                      <ListTodo className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        Assign as Task
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Add to job seeker's task list
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Client Selection */}
              {shareMethod && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => {
                        setShareMethod(null);
                        setSelectedClient(null);
                      }}
                      className={`text-sm ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"} hover:underline`}
                    >
                      Back
                    </button>
                    <span className={isDark ? "text-gray-600" : "text-gray-300"}>/</span>
                    <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {shareMethod === "message" ? "Send via Message" : "Assign as Task"}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Select a job seeker:
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {demoClients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          selectedClient === client.id
                            ? isDark
                              ? "bg-[#4FD1C5]/20 border-[#4FD1C5] border"
                              : "bg-[#2B8A8A]/10 border-[#2B8A8A] border"
                            : isDark
                            ? "border border-gray-700 hover:bg-gray-700"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={client.avatar}
                          alt={`${client.firstName} ${client.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="text-left flex-1">
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {client.firstName} {client.lastName}
                          </p>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {client.currentMilestone.replace("-", " ")}
                          </p>
                        </div>
                        {selectedClient === client.id && (
                          <CheckCircle2 className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={handleShareConfirm}
                    disabled={!selectedClient}
                    className={`w-full mt-4 rounded-xl ${
                      selectedClient
                        ? "bg-[#2B8A8A] hover:bg-[#237070] text-white"
                        : isDark
                        ? "bg-gray-700 text-gray-500"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {shareMethod === "message" ? "Send Message" : "Assign Task"}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Assessments
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Share career assessments with job seekers to help them discover their strengths
        </p>
      </motion.div>

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
                ? "bg-gray-800 border-gray-700"
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

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-6 ${
          isDark
            ? "bg-gradient-to-r from-[#4FD1C5]/20 to-[#805AD5]/20 border border-[#4FD1C5]/30"
            : "bg-gradient-to-r from-[#2B8A8A]/10 to-purple-100 border border-[#2B8A8A]/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/20"}`}>
            <Sparkles className={`h-6 w-6 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
          </div>
          <div>
            <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              How Assessments Help
            </h3>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Career assessments help job seekers understand their interests, skills, personality, and values.
              Share these with your caseload to help them make informed career decisions.
              View completion status and results in each job seeker's profile.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-2 gap-6">
        {assessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
            className={`rounded-2xl border p-6 transition-all ${
              isDark
                ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                : "bg-white border-gray-100 hover:shadow-lg hover:border-gray-200"
            }`}
          >
            <div className="flex gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${assessment.color}15` }}
              >
                <assessment.icon
                  className="h-7 w-7"
                  style={{ color: assessment.color }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {assessment.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}>
                      {getCategoryLabel(assessment.category)}
                    </span>
                  </div>
                </div>
                <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {assessment.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-4 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {assessment.duration}
                    </span>
                    <span>{assessment.questions} questions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`mt-5 pt-5 flex items-center justify-between border-t ${
              isDark ? "border-gray-700" : "border-gray-100"
            }`}>
              <a
                href={assessment.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm flex items-center gap-1.5 ${
                  isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ExternalLink className="h-4 w-4" />
                Preview Assessment
              </a>
              <button
                onClick={() => handleShare(assessment)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark
                    ? "text-[#4FD1C5] hover:bg-[#4FD1C5]/10 border border-gray-700 hover:border-[#4FD1C5]/50"
                    : "text-[#2B8A8A] hover:bg-[#2B8A8A]/10 border border-gray-200 hover:border-[#2B8A8A]/50"
                }`}
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Share Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mt-8 rounded-2xl p-6 ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
        }`}
      >
        <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Recently Active Job Seekers
        </h3>
        <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Job seekers who might benefit from completing assessments
        </p>
        <div className="grid grid-cols-5 gap-3">
          {demoClients
            .filter((c) => c.daysInactive < 3)
            .slice(0, 5)
            .map((client) => (
              <div
                key={client.id}
                className={`p-3 rounded-xl text-center ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <img
                  src={client.avatar}
                  alt={`${client.firstName} ${client.lastName}`}
                  className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                />
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {client.firstName}
                </p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {client.lastLogin}
                </p>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
