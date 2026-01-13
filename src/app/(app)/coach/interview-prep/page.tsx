"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle2,
  BookOpen,
  Video,
  Users,
  Share2,
  MessageSquare,
  ListTodo,
  X,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { demoClients } from "@/lib/demo-data";

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  videos: number;
  category: string;
}

const categories = [
  { id: "all", name: "All Topics", count: 24 },
  { id: "basics", name: "Interview Basics", count: 6 },
  { id: "behavioral", name: "Behavioral Questions", count: 8 },
  { id: "industry", name: "Industry Specific", count: 10 },
];

const modules: Module[] = [
  {
    id: 1,
    title: "Interview Basics 101",
    description: "Learn the fundamentals of interviewing",
    duration: "15 min",
    videos: 4,
    category: "basics",
  },
  {
    id: 2,
    title: "How to Dress for Success",
    description: "Professional attire for different industries",
    duration: "10 min",
    videos: 3,
    category: "basics",
  },
  {
    id: 3,
    title: "Common Interview Questions",
    description: "Master the most frequently asked questions",
    duration: "25 min",
    videos: 6,
    category: "behavioral",
  },
  {
    id: 4,
    title: "STAR Method Explained",
    description: "Structure your answers effectively",
    duration: "20 min",
    videos: 4,
    category: "behavioral",
  },
  {
    id: 5,
    title: "Healthcare Industry Interviews",
    description: "Specific tips for healthcare roles",
    duration: "30 min",
    videos: 5,
    category: "industry",
  },
  {
    id: 6,
    title: "Tech Industry Interviews",
    description: "Prepare for technical and culture fit",
    duration: "35 min",
    videos: 7,
    category: "industry",
  },
  {
    id: 7,
    title: "Body Language Mastery",
    description: "Non-verbal communication techniques",
    duration: "12 min",
    videos: 3,
    category: "basics",
  },
  {
    id: 8,
    title: "Salary Negotiation Basics",
    description: "How to discuss compensation confidently",
    duration: "18 min",
    videos: 4,
    category: "behavioral",
  },
];

const featuredVideo = {
  title: "Mastering the 'Tell Me About Yourself' Question",
  description:
    "This is often the first question in any interview. Learn how to craft a compelling answer that sets the tone for the rest of your interview.",
  duration: "8:32",
  views: "2.4k",
};

export default function CoachInterviewPrepPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Share modal state
  const [shareModalModule, setShareModalModule] = useState<Module | null>(null);
  const [shareMethod, setShareMethod] = useState<"message" | "task" | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const stats = [
    { label: "Total Modules", value: modules.length, icon: Video, color: "#2B8A8A" },
    { label: "Job Seekers", value: demoClients.length, icon: Users, color: "#805AD5" },
    { label: "Assigned This Week", value: 6, icon: ListTodo, color: "#D69E2E" },
    { label: "Completions", value: 23, icon: TrendingUp, color: "#38A169" },
  ];

  const filteredModules = selectedCategory === "all"
    ? modules
    : modules.filter((m) => m.category === selectedCategory);

  const handleShare = (module: Module) => {
    setShareModalModule(module);
    setShareMethod(null);
    setSelectedClient(null);
  };

  const handleShareConfirm = () => {
    if (!shareModalModule || !shareMethod || !selectedClient) return;

    const client = demoClients.find((c) => c.id === selectedClient);
    if (!client) return;

    // In a real app, this would send the message or create a task
    setShowSuccessToast(
      shareMethod === "message"
        ? `Module shared with ${client.firstName} via message`
        : `Module assigned to ${client.firstName} as a task`
    );
    setShareModalModule(null);
    setShareMethod(null);
    setSelectedClient(null);

    setTimeout(() => setShowSuccessToast(null), 3000);
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
        {shareModalModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShareModalModule(null)}
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
                    Share Module
                  </h3>
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {shareModalModule.title}
                  </p>
                </div>
                <button
                  onClick={() => setShareModalModule(null)}
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
                    How would you like to share this module?
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
          Interview Prep
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Share interview training modules with job seekers to help them succeed
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

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Featured Video Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl overflow-hidden ${
              isDark
                ? "bg-gradient-to-br from-[#4FD1C5] to-[#2B8A8A]"
                : "bg-gradient-to-br from-[#2B8A8A] to-[#1a5a5a]"
            }`}
          >
            <div className="grid grid-cols-2">
              <div className={`p-8 ${isDark ? "text-gray-900" : "text-white"}`}>
                <span className={`inline-block text-xs px-3 py-1 rounded-full mb-4 ${
                  isDark ? "bg-gray-900/20 text-gray-900" : "bg-white/20 text-white"
                }`}>
                  Most Popular
                </span>
                <h2 className="text-xl font-bold mb-3">
                  {featuredVideo.title}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? "text-gray-900/80" : "text-white/80"}`}>
                  {featuredVideo.description}
                </p>
                <div className={`flex items-center gap-4 text-sm ${isDark ? "text-gray-900/70" : "text-white/70"}`}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {featuredVideo.views} views
                  </span>
                </div>
              </div>
              <div className={`relative flex items-center justify-center ${isDark ? "bg-gray-900/20" : "bg-black/20"}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isDark ? "bg-gray-900/20" : "bg-white/20"
                }`}>
                  <Play className={`h-8 w-8 ml-1 ${isDark ? "text-gray-900" : "text-white"}`} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Module List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border overflow-hidden ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            <div className={`p-6 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Training Modules
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Share these modules to help job seekers prepare for interviews
              </p>
            </div>
            <div className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-100"}`}>
              {filteredModules.map((module) => (
                <div
                  key={module.id}
                  className={`p-6 flex items-center gap-4 transition-colors ${
                    isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"
                    }`}
                  >
                    <Video className={`h-6 w-6 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`font-medium mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {module.title}
                    </h3>
                    <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {module.description}
                    </p>
                    <div className={`flex items-center gap-4 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {module.videos} videos
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      }`}>
                        {categories.find((c) => c.id === module.category)?.name || module.category}
                      </span>
                    </div>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(module)}
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
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl border p-6 ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                    selectedCategory === cat.id
                      ? isDark
                        ? "bg-[#4FD1C5]/20 text-[#4FD1C5]"
                        : "bg-[#2B8A8A]/10 text-[#2B8A8A]"
                      : isDark
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="font-medium">{cat.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === cat.id
                      ? isDark
                        ? "bg-[#4FD1C5]/30 text-[#4FD1C5]"
                        : "bg-[#2B8A8A]/20 text-[#2B8A8A]"
                      : isDark
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Job Seekers Ready for Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl border p-6 ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Upcoming Interviews
              </h3>
            </div>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Job seekers with scheduled interviews who could benefit from prep modules
            </p>
            <div className="space-y-3">
              {demoClients
                .filter((c) => c.stats.interviewsScheduled > 0)
                .slice(0, 3)
                .map((client) => (
                  <div
                    key={client.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <img
                      src={client.avatar}
                      alt={`${client.firstName} ${client.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                        {client.firstName} {client.lastName}
                      </p>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {client.stats.interviewsScheduled} interview{client.stats.interviewsScheduled !== 1 ? "s" : ""} scheduled
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl p-6 border ${
              isDark
                ? "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-900/30"
                : "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className={`h-5 w-5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Coach Tip</h3>
            </div>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Job seekers preparing for interviews benefit most from the STAR Method and
              Common Questions modules. Consider assigning these first for anyone with
              upcoming interviews.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
