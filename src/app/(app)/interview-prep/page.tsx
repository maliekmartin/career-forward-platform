"use client";

import { motion } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
  Video,
  Users,
  Briefcase,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

const categories = [
  { id: "all", name: "All Topics", count: 24 },
  { id: "basics", name: "Interview Basics", count: 6 },
  { id: "behavioral", name: "Behavioral Questions", count: 8 },
  { id: "industry", name: "Industry Specific", count: 10 },
];

const modules = [
  {
    id: 1,
    title: "Interview Basics 101",
    description: "Learn the fundamentals of interviewing",
    duration: "15 min",
    videos: 4,
    progress: 100,
    completed: true,
    category: "basics",
  },
  {
    id: 2,
    title: "How to Dress for Success",
    description: "Professional attire for different industries",
    duration: "10 min",
    videos: 3,
    progress: 100,
    completed: true,
    category: "basics",
  },
  {
    id: 3,
    title: "Common Interview Questions",
    description: "Master the most frequently asked questions",
    duration: "25 min",
    videos: 6,
    progress: 60,
    completed: false,
    category: "behavioral",
  },
  {
    id: 4,
    title: "STAR Method Explained",
    description: "Structure your answers effectively",
    duration: "20 min",
    videos: 4,
    progress: 0,
    completed: false,
    category: "behavioral",
  },
  {
    id: 5,
    title: "Healthcare Industry Interviews",
    description: "Specific tips for healthcare roles",
    duration: "30 min",
    videos: 5,
    progress: 0,
    completed: false,
    category: "industry",
    locked: true,
  },
  {
    id: 6,
    title: "Tech Industry Interviews",
    description: "Prepare for technical and culture fit",
    duration: "35 min",
    videos: 7,
    progress: 0,
    completed: false,
    category: "industry",
    locked: true,
  },
];

const featuredVideo = {
  title: "Mastering the 'Tell Me About Yourself' Question",
  description:
    "This is often the first question in any interview. Learn how to craft a compelling answer that sets the tone for the rest of your interview.",
  duration: "8:32",
  views: "2.4k",
};

export default function InterviewPrepPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const stats = [
    { label: "Modules Completed", value: "2/6", icon: CheckCircle2, color: "#38A169" },
    { label: "Videos Watched", value: "7/29", icon: Video, color: "#2B8A8A" },
    { label: "Time Invested", value: "45 min", icon: Clock, color: "#805AD5" },
    { label: "Skill Score", value: "68%", icon: Star, color: "#D69E2E" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Overview Stats */}
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

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Featured Video */}
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
                  Featured
                </span>
                <h2 className="text-xl font-bold mb-3">
                  {featuredVideo.title}
                </h2>
                <p className={`text-sm mb-6 ${isDark ? "text-gray-900/80" : "text-white/80"}`}>
                  {featuredVideo.description}
                </p>
                <div className={`flex items-center gap-4 text-sm mb-6 ${isDark ? "text-gray-900/70" : "text-white/70"}`}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {featuredVideo.views} views
                  </span>
                </div>
                <Button className={`rounded-full ${
                  isDark ? "bg-gray-900 text-[#4FD1C5] hover:bg-gray-800" : "bg-white text-[#2B8A8A] hover:bg-gray-100"
                }`}>
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
              <div className={`relative flex items-center justify-center ${isDark ? "bg-gray-900/20" : "bg-black/20"}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isDark ? "bg-gray-900/20 hover:bg-gray-900/30" : "bg-white/20 hover:bg-white/30"
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
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <div className={`p-6 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Training Modules
              </h2>
            </div>
            <div className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-6 flex items-center gap-4 transition-colors ${
                    module.locked ? "opacity-60" : "cursor-pointer"
                  } ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}
                >
                  {/* Status Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      module.completed
                        ? isDark ? "bg-green-900/30" : "bg-green-100"
                        : module.locked
                        ? isDark ? "bg-gray-800" : "bg-gray-100"
                        : isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"
                    }`}
                  >
                    {module.completed ? (
                      <CheckCircle2 className={`h-6 w-6 ${isDark ? "text-green-400" : "text-green-600"}`} />
                    ) : module.locked ? (
                      <Lock className={`h-6 w-6 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                    ) : (
                      <Video className={`h-6 w-6 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                    )}
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
                    </div>
                  </div>

                  {/* Progress */}
                  {!module.locked && (
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={isDark ? "text-gray-500" : "text-gray-500"}>Progress</span>
                        <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          {module.progress}%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <div
                          className={`h-full rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`}
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <ChevronRight className={`h-5 w-5 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
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
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>{cat.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 border ${
              isDark
                ? "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-900/30"
                : "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className={`h-5 w-5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Quick Tip</h3>
            </div>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Research the company before your interview. Understanding their
              mission, values, and recent news shows genuine interest.
            </p>
            <Button
              variant="outline"
              size="sm"
              className={isDark ? "text-yellow-400 border-yellow-700 hover:bg-yellow-900/30" : "text-yellow-700 border-yellow-300 hover:bg-yellow-100"}
            >
              More Tips
            </Button>
          </motion.div>

          {/* Schedule Practice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl border p-6 ${
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Practice with a Coach
            </h3>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Schedule a mock interview session with a career coach.
            </p>
            <Button className={`w-full rounded-xl ${
              isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
            }`}>
              Schedule Session
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
