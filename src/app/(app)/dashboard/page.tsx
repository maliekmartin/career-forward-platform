"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  MessageSquare,
  Trophy,
  Target,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Flame,
  FileText,
  BookOpen,
  Play,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  ArrowRight,
  Search,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { demoCoach } from "@/lib/demo-data";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

// Demo data
const demoJobSeeker = {
  questProgress: 32,
  stats: { applied: 12, interviewing: 3, offers: 1 },
};

const questStages = [
  { id: "discover", name: "Discover", color: "#2B8A8A", progress: 100, description: "Explore careers and assess skills" },
  { id: "prepare", name: "Prepare", color: "#38A169", progress: 60, description: "Build resume and enhance skills" },
  { id: "search", name: "Search", color: "#D69E2E", progress: 0, description: "Find and apply to opportunities" },
  { id: "interview", name: "Interview", color: "#E53E3E", progress: 0, description: "Ace your interviews" },
  { id: "success", name: "Success", color: "#805AD5", progress: 0, description: "Land your dream job" },
];

const recentApplications = [
  { company: "Tech Corp", position: "Marketing Coordinator", status: "interviewing", date: "2 days ago", logo: "TC" },
  { company: "Innovate Inc", position: "Junior Designer", status: "applied", date: "5 days ago", logo: "II" },
  { company: "StartUp Co", position: "Content Writer", status: "applied", date: "1 week ago", logo: "SC" },
];

const upcomingEvents = [
  { time: "09:00", title: "Interview: Tech Corp", color: "border-l-purple-500", bg: "bg-purple-500/10" },
  { time: "14:00", title: "Resume Review", color: "border-l-[#2B8A8A]", bg: "bg-[#2B8A8A]/10" },
];

const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const currentStageIndex = questStages.findIndex(s => s.progress > 0 && s.progress < 100) || 1;
  const currentStage = questStages[currentStageIndex];

  // Calendar
  const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d: Date) => { const f = new Date(d.getFullYear(), d.getMonth(), 1).getDay(); return f === 0 ? 6 : f - 1; };
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-4">
        {/* Quest Progress */}
        <motion.div
          variants={cardHoverVariants}
          initial="rest"
          whileHover="hover"
          className={`rounded-xl p-4 border shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                <svg className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth="3" />
                  <motion.circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={isDark ? "#4FD1C5" : "#2B8A8A"}
                    strokeWidth="3" strokeLinecap="round"
                    initial={{ strokeDasharray: "0 126" }}
                    animate={{ strokeDasharray: `${(demoJobSeeker.questProgress / 100) * 126} 126` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <Target className={`h-4 w-4 absolute ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{demoJobSeeker.questProgress}%</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Quest Progress</p>
              </div>
            </div>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isDark ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-50"}`}>
              <TrendingUp className="h-3 w-3" />+5%
            </span>
          </div>
        </motion.div>

        {/* Applications */}
        <motion.div
          variants={cardHoverVariants}
          initial="rest"
          whileHover="hover"
          className={`rounded-xl p-4 border shadow-sm ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? "bg-blue-900/30" : "bg-blue-50"}`}>
                <Briefcase className={`h-5 w-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{demoJobSeeker.stats.applied}</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Applications</p>
              </div>
            </div>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isDark ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-50"}`}>
              <TrendingUp className="h-3 w-3" />+3
            </span>
          </div>
        </motion.div>

        {/* Interviews */}
        <Link href="/job-tracker?filter=interviewing">
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className={`rounded-xl p-4 border shadow-sm cursor-pointer ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? "bg-purple-900/30" : "bg-purple-50"}`}>
                  <Calendar className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{demoJobSeeker.stats.interviewing}</p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Interviews</p>
                </div>
              </div>
              {demoJobSeeker.stats.offers > 0 && (
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isDark ? "text-emerald-400 bg-emerald-900/30" : "text-emerald-600 bg-emerald-50"}`}>
                  <Trophy className="h-3 w-3" />{demoJobSeeker.stats.offers} offer
                </span>
              )}
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="grid grid-cols-[1fr_300px] gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Quest Progress Card */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                  <Target className={`h-4 w-4 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                </div>
                <h2 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Your Career Forward</h2>
              </div>
              <Link href="/achievements">
                <Button variant="ghost" size="sm" className={`text-xs h-7 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
                  View Journey <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-4">
              {/* Quest Stages */}
              <div className="flex items-center gap-1.5 mb-3">
                {questStages.map((stage, idx) => {
                  const isComplete = stage.progress === 100;
                  const isCurrent = stage.progress > 0 && stage.progress < 100;
                  return (
                    <div key={stage.id} className="flex items-center flex-1">
                      <div
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isComplete ? "text-white" : isCurrent ? "text-white ring-2 ring-offset-1" : isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"
                        }`}
                        style={{ backgroundColor: isComplete || isCurrent ? stage.color : undefined }}
                        title={stage.name}
                      >
                        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      {idx < questStages.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${isComplete ? "" : isDark ? "bg-gray-800" : "bg-gray-200"}`}
                          style={{ backgroundColor: isComplete ? stage.color : undefined }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stage Labels */}
              <div className="flex justify-between mb-3 text-[10px] font-medium">
                {questStages.map((stage) => (
                  <span key={stage.id} className={stage.progress > 0 ? (isDark ? "text-gray-300" : "text-gray-600") : (isDark ? "text-gray-600" : "text-gray-400")}>
                    {stage.name}
                  </span>
                ))}
              </div>

              {/* Continue CTA */}
              <div className={`p-3 rounded-lg flex items-center justify-between ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${currentStage.color}20` }}>
                    <Play className="h-4 w-4" style={{ color: currentStage.color }} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Continue: {currentStage.name}</p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{currentStage.description}</p>
                  </div>
                </div>
                <Link href={currentStageIndex === 1 ? "/resume-builder" : "/job-board"}>
                  <Button size="sm" className={`h-8 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}>
                    Continue <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"}`}>
                  <Briefcase className={`h-4 w-4 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                </div>
                <h2 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Recent Applications</h2>
              </div>
              <Link href="/job-tracker">
                <Button variant="ghost" size="sm" className={`text-xs h-7 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
                  View All <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
              {recentApplications.map((app, idx) => (
                <div key={idx} className={`px-4 py-3 flex items-center justify-between ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-xs ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                      {app.logo}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{app.position}</p>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>{app.company} · {app.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    app.status === "interviewing"
                      ? isDark ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-600"
                      : isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                  }`}>
                    {app.status === "interviewing" ? "Interview" : "Applied"}
                  </span>
                </div>
              ))}
            </div>

            <div className={`px-4 py-3 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <Link href="/job-board">
                <Button variant="outline" size="sm" className={`w-full h-8 gap-1.5 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}>
                  <Search className="h-3.5 w-3.5" /> Find More Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Motivation Card with Streak */}
          <div className={`rounded-xl p-4 ${isDark ? "bg-gradient-to-br from-[#4FD1C5]/20 to-[#4FD1C5]/5 border border-[#4FD1C5]/20" : "bg-gradient-to-br from-[#2B8A8A]/10 to-[#2B8A8A]/5 border border-[#2B8A8A]/20"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Play className={`h-4 w-4 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Keep the momentum!</h3>
              </div>
              <div className="flex items-center gap-1">
                <Flame className={`h-4 w-4 ${isDark ? "text-orange-400" : "text-orange-500"}`} />
                <span className={`text-xs font-bold ${isDark ? "text-orange-400" : "text-orange-500"}`}>7 days</span>
              </div>
            </div>
            <p className={`text-xs mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              You're in the {currentStage.name} phase. {currentStage.description}.
            </p>
            <Link href={currentStageIndex === 1 ? "/resume-builder" : "/job-board"}>
              <Button size="sm" className={`w-full h-8 gap-1.5 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}>
                Continue Quest <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Calendar + Schedule Combined */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <div className={`px-3 py-2 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <div className="flex gap-0.5">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className={`p-1 rounded transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className={`p-1 rounded transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-7 mb-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className={`text-center text-[10px] font-medium py-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: getFirstDay(currentMonth) }).map((_, i) => <div key={`e-${i}`} className="h-6" />)}
                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();
                  const isSelected = day === selectedDate;
                  const hasEvent = [5, 12, 18, 25].includes(day);
                  return (
                    <button key={day} onClick={() => setSelectedDate(day)}
                      className={`h-6 w-6 rounded text-xs font-medium transition-colors relative mx-auto ${
                        isSelected ? (isDark ? "bg-[#4FD1C5] text-gray-900" : "bg-[#2B8A8A] text-white")
                          : isToday ? (isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900")
                          : isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50"
                      }`}>
                      {day}
                      {hasEvent && !isSelected && <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Today's Events */}
            <div className={`px-3 py-2 border-t space-y-1.5 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Today</p>
              {upcomingEvents.map((e, i) => (
                <div key={i} className={`p-2 rounded-lg border-l-2 ${e.color} ${isDark ? "bg-gray-800/50" : e.bg}`}>
                  <p className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{e.title}</p>
                  <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{formatTime(e.time)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coach + Quick Links Combined */}
          <div className={`rounded-xl border shadow-sm overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            {/* Coach */}
            <div className={`p-3 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <img src={demoCoach.avatar} alt={`${demoCoach.firstName}`} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{demoCoach.firstName} {demoCoach.lastName}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>Available</span>
                  </div>
                </div>
                <Link href="/messages">
                  <Button size="sm" variant="outline" className={`h-7 text-xs ${isDark ? "border-gray-700" : ""}`}>
                    <MessageSquare className="h-3 w-3 mr-1" /> Chat
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-2">
              {[
                { label: "Resume Builder", icon: FileText, href: "/resume-builder", color: "#38A169" },
                { label: "Interview Prep", icon: BookOpen, href: "/interview-prep", color: "#805AD5" },
                { label: "Local Resources", icon: MapPin, href: "/resources", color: "#D69E2E" },
                { label: "Achievements", icon: Trophy, href: "/achievements", color: "#E53E3E" },
              ].map((link) => (
                <Link key={link.label} href={link.href}>
                  <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                    <div className="p-1.5 rounded" style={{ backgroundColor: `${link.color}15` }}>
                      <link.icon className="h-3.5 w-3.5" style={{ color: link.color }} />
                    </div>
                    <span className={`text-xs font-medium flex-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{link.label}</span>
                    <ChevronRight className={`h-3 w-3 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
