"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  Trophy,
  Lock,
  Star,
  Flame,
  Target,
  Award,
  Zap,
  Send,
  FileText,
  Users,
  Clock,
  Sun,
  Moon,
  Rocket,
  Shield,
  Crown,
  Gem,
  Sparkles,
  Heart,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Medal,
  Briefcase,
  UserCheck,
  Calendar,
  RefreshCw,
  Timer,
  Coffee,
  Lightbulb,
  Mountain,
  Compass,
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  category: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  total?: number;
  requirement: string;
}

const rarityConfig = {
  common: {
    label: "Common",
    gradient: "from-gray-400 to-gray-500",
    bgGradient: "from-gray-100 to-gray-200",
    border: "border-gray-300",
    glow: "",
    textColor: "text-gray-600",
  },
  uncommon: {
    label: "Uncommon",
    gradient: "from-green-400 to-emerald-500",
    bgGradient: "from-green-100 to-emerald-200",
    border: "border-green-400",
    glow: "",
    textColor: "text-green-600",
  },
  rare: {
    label: "Rare",
    gradient: "from-blue-400 to-indigo-500",
    bgGradient: "from-blue-100 to-indigo-200",
    border: "border-blue-400",
    glow: "shadow-blue-200",
    textColor: "text-blue-600",
  },
  epic: {
    label: "Epic",
    gradient: "from-purple-400 to-violet-600",
    bgGradient: "from-purple-100 to-violet-200",
    border: "border-purple-400",
    glow: "shadow-purple-200",
    textColor: "text-purple-600",
  },
  legendary: {
    label: "Legendary",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    bgGradient: "from-amber-100 via-orange-100 to-red-100",
    border: "border-amber-400",
    glow: "shadow-amber-300",
    textColor: "text-amber-600",
  },
};

const achievements: Achievement[] = [
  // COMMON TIER - Getting Started
  {
    id: "first-steps",
    name: "First Steps",
    description: "Created your Career Forward account",
    icon: Rocket,
    rarity: "common",
    category: "Getting Started",
    earned: true,
    earnedDate: "Dec 10, 2025",
    requirement: "Sign up for Career Forward",
  },
  {
    id: "resume-drafted",
    name: "Resume Drafted",
    description: "Created your first resume",
    icon: FileText,
    rarity: "common",
    category: "Resume",
    earned: true,
    earnedDate: "Dec 12, 2025",
    requirement: "Create 1 resume",
  },
  {
    id: "first-application",
    name: "Into the Arena",
    description: "Submitted your first job application",
    icon: Send,
    rarity: "common",
    category: "Applications",
    earned: true,
    earnedDate: "Dec 15, 2025",
    requirement: "Apply to 1 job",
  },
  {
    id: "assessment-started",
    name: "Self Discovery",
    description: "Completed your first assessment",
    icon: Compass,
    rarity: "common",
    category: "Assessments",
    earned: true,
    earnedDate: "Dec 20, 2025",
    requirement: "Complete 1 assessment",
  },
  {
    id: "coach-connected",
    name: "Guidance Seeker",
    description: "Connected with a career coach",
    icon: UserCheck,
    rarity: "common",
    category: "Community",
    earned: true,
    earnedDate: "Dec 22, 2025",
    requirement: "Connect with 1 coach",
  },

  // UNCOMMON TIER - Building Momentum
  {
    id: "persistent-5",
    name: "Persistent",
    description: "Applied to 5 different jobs",
    icon: Target,
    rarity: "uncommon",
    category: "Applications",
    earned: false,
    progress: 3,
    total: 5,
    requirement: "Apply to 5 jobs",
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Logged in 7 days in a row",
    icon: Calendar,
    rarity: "uncommon",
    category: "Dedication",
    earned: true,
    earnedDate: "Dec 25, 2025",
    requirement: "7-day login streak",
  },
  {
    id: "resume-polished",
    name: "Resume Architect",
    description: "Created 3 tailored resumes",
    icon: Sparkles,
    rarity: "uncommon",
    category: "Resume",
    earned: false,
    progress: 1,
    total: 3,
    requirement: "Create 3 resumes",
  },
  {
    id: "interview-ready",
    name: "Interview Ready",
    description: "Completed all interview prep modules",
    icon: BookOpen,
    rarity: "uncommon",
    category: "Learning",
    earned: false,
    progress: 2,
    total: 6,
    requirement: "Complete 6 prep modules",
  },
  {
    id: "assessment-explorer",
    name: "Assessment Explorer",
    description: "Completed 10 different assessments",
    icon: Lightbulb,
    rarity: "uncommon",
    category: "Assessments",
    earned: false,
    progress: 4,
    total: 10,
    requirement: "Complete 10 assessments",
  },

  // RARE TIER - Serious Commitment
  {
    id: "dedicated-25",
    name: "Dedicated",
    description: "Applied to 25 jobs",
    icon: Flame,
    rarity: "rare",
    category: "Applications",
    earned: false,
    progress: 3,
    total: 25,
    requirement: "Apply to 25 jobs",
  },
  {
    id: "first-interview",
    name: "Interview Champion",
    description: "Landed your first interview",
    icon: Users,
    rarity: "rare",
    category: "Milestones",
    earned: false,
    requirement: "Get 1 interview invitation",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Applied to a job before 7 AM",
    icon: Sun,
    rarity: "rare",
    category: "Dedication",
    earned: false,
    requirement: "Submit application before 7 AM",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Applied to a job after midnight",
    icon: Moon,
    rarity: "rare",
    category: "Dedication",
    earned: false,
    requirement: "Submit application after midnight",
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Achieved 100% on an assessment",
    icon: CheckCircle2,
    rarity: "rare",
    category: "Assessments",
    earned: false,
    requirement: "Score 100% on any assessment",
  },
  {
    id: "marathon-30",
    name: "Marathon Runner",
    description: "Maintained a 30-day login streak",
    icon: TrendingUp,
    rarity: "rare",
    category: "Dedication",
    earned: false,
    progress: 7,
    total: 30,
    requirement: "30-day login streak",
  },
  {
    id: "quick-draw",
    name: "Quick Draw",
    description: "Applied within 1 hour of job posting",
    icon: Timer,
    rarity: "rare",
    category: "Applications",
    earned: false,
    requirement: "Apply within 1 hour of posting",
  },

  // EPIC TIER - Elite Status
  {
    id: "relentless-50",
    name: "Relentless",
    description: "Applied to 50 jobs",
    icon: Shield,
    rarity: "epic",
    category: "Applications",
    earned: false,
    progress: 3,
    total: 50,
    requirement: "Apply to 50 jobs",
  },
  {
    id: "interview-master",
    name: "Interview Master",
    description: "Received 10 interview invitations",
    icon: Star,
    rarity: "epic",
    category: "Milestones",
    earned: false,
    progress: 0,
    total: 10,
    requirement: "Get 10 interviews",
  },
  {
    id: "assessment-ace",
    name: "Assessment Ace",
    description: "Completed 50 assessments",
    icon: Medal,
    rarity: "epic",
    category: "Assessments",
    earned: false,
    progress: 4,
    total: 50,
    requirement: "Complete 50 assessments",
  },
  {
    id: "blitz-10",
    name: "Application Blitz",
    description: "Applied to 10 jobs in a single day",
    icon: Zap,
    rarity: "epic",
    category: "Applications",
    earned: false,
    requirement: "10 applications in one day",
  },
  {
    id: "comeback-kid",
    name: "Comeback Kid",
    description: "Re-applied after receiving a rejection",
    icon: RefreshCw,
    rarity: "epic",
    category: "Resilience",
    earned: false,
    requirement: "Apply again after rejection",
  },
  {
    id: "offer-received",
    name: "Offer in Hand",
    description: "Received your first job offer",
    icon: Award,
    rarity: "epic",
    category: "Milestones",
    earned: false,
    requirement: "Receive 1 job offer",
  },
  {
    id: "resume-master",
    name: "Resume Master",
    description: "Created 10 tailored resumes",
    icon: FileText,
    rarity: "epic",
    category: "Resume",
    earned: false,
    progress: 1,
    total: 10,
    requirement: "Create 10 resumes",
  },

  // LEGENDARY TIER - The Pinnacle
  {
    id: "application-machine",
    name: "Application Machine",
    description: "Applied to 100 jobs",
    icon: Briefcase,
    rarity: "legendary",
    category: "Applications",
    earned: false,
    progress: 3,
    total: 100,
    requirement: "Apply to 100 jobs",
  },
  {
    id: "lightning-strike",
    name: "Lightning Strike",
    description: "Got hired the same day as your interview",
    icon: Zap,
    rarity: "legendary",
    category: "Milestones",
    earned: false,
    requirement: "Same-day interview + hire",
  },
  {
    id: "quest-complete",
    name: "Quest Complete",
    description: "Successfully landed a job through Career Forward",
    icon: Crown,
    rarity: "legendary",
    category: "Milestones",
    earned: false,
    requirement: "Get hired",
  },
  {
    id: "full-circle",
    name: "Full Circle",
    description: "Got hired by a company that previously rejected you",
    icon: Heart,
    rarity: "legendary",
    category: "Resilience",
    earned: false,
    requirement: "Hired after previous rejection",
  },
  {
    id: "offer-collector",
    name: "Offer Collector",
    description: "Received 3 job offers to choose from",
    icon: Gem,
    rarity: "legendary",
    category: "Milestones",
    earned: false,
    progress: 0,
    total: 3,
    requirement: "Receive 3 job offers",
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Maintained a 100-day login streak",
    icon: Mountain,
    rarity: "legendary",
    category: "Dedication",
    earned: false,
    progress: 7,
    total: 100,
    requirement: "100-day login streak",
  },
];

const categories = [
  "All",
  "Applications",
  "Milestones",
  "Dedication",
  "Resume",
  "Assessments",
  "Learning",
  "Resilience",
  "Community",
  "Getting Started",
];

export default function AchievementsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const filteredAchievements = achievements.filter((a) => {
    const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
    const matchesRarity = !selectedRarity || a.rarity === selectedRarity;
    return matchesCategory && matchesRarity;
  });

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;
  const streak = 7; // Demo value

  // Count by rarity
  const rarityStats = {
    common: achievements.filter((a) => a.rarity === "common" && a.earned).length,
    uncommon: achievements.filter((a) => a.rarity === "uncommon" && a.earned).length,
    rare: achievements.filter((a) => a.rarity === "rare" && a.earned).length,
    epic: achievements.filter((a) => a.rarity === "epic" && a.earned).length,
    legendary: achievements.filter((a) => a.rarity === "legendary" && a.earned).length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Achievements</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Prove your dedication and unlock prestigious badges
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className={`rounded-2xl p-6 text-white ${
          isDark
            ? "bg-gradient-to-br from-[#4FD1C5] to-[#2B8A8A]"
            : "bg-gradient-to-br from-[#2B8A8A] to-[#1a6363]"
        }`}>
          <Trophy className={`h-8 w-8 mb-3 opacity-90 ${isDark ? "text-gray-900" : "text-white"}`} />
          <div className={`text-3xl font-bold mb-1 ${isDark ? "text-gray-900" : "text-white"}`}>{earnedCount}</div>
          <div className={`text-sm ${isDark ? "text-gray-900/70" : "text-white/70"}`}>Badges Earned</div>
        </div>
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <Target className="h-8 w-8 text-gray-400 mb-3" />
          <div className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {totalCount - earnedCount}
          </div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Yet to Unlock</div>
        </div>
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <Flame className="h-8 w-8 text-orange-500 mb-3" />
          <div className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{streak}</div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Day Streak</div>
        </div>
        <div className={`rounded-2xl p-6 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <Star className="h-8 w-8 text-amber-500 mb-3" />
          <div className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {Math.round((earnedCount / totalCount) * 100)}%
          </div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Completion</div>
        </div>
      </motion.div>

      {/* Rarity Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`rounded-2xl border p-6 mb-8 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
      >
        <h2 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Collection Progress</h2>
        <div className="grid grid-cols-5 gap-4">
          {(Object.keys(rarityConfig) as Array<keyof typeof rarityConfig>).map((rarity) => {
            const config = rarityConfig[rarity];
            const total = achievements.filter((a) => a.rarity === rarity).length;
            const earned = rarityStats[rarity];
            const isSelected = selectedRarity === rarity;

            return (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(isSelected ? null : rarity)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected ? config.border : isDark ? "border-gray-700" : "border-gray-100"
                } hover:${config.border}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-2 mx-auto`}
                >
                  <Gem className="h-5 w-5 text-white" />
                </div>
                <p className={`text-sm font-medium ${config.textColor}`}>
                  {config.label}
                </p>
                <p className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {earned}/{total}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-8 overflow-x-auto pb-2"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              cat === selectedCategory
                ? "bg-[#2B8A8A] text-white"
                : isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredAchievements.map((achievement, index) => {
          const config = rarityConfig[achievement.rarity];
          const Icon = achievement.icon;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * Math.min(index, 12) }}
              className={`rounded-2xl border-2 p-6 transition-all relative overflow-hidden ${
                achievement.earned
                  ? `${config.border} hover:shadow-lg ${config.glow} ${isDark ? "bg-gray-900" : "bg-white"}`
                  : isDark
                    ? "border-gray-700 opacity-75 bg-gray-900"
                    : "border-gray-100 opacity-75 bg-white"
              }`}
            >
              {/* Rarity Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white`}
                >
                  {config.label}
                </span>
              </div>

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                      achievement.earned ? config.bgGradient : "from-gray-100 to-gray-200"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 ${
                        achievement.earned ? config.textColor : "text-gray-400"
                      }`}
                    />
                  </div>
                  {!achievement.earned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/60 rounded-2xl">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  {achievement.earned && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold mb-1 pr-16 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {achievement.description}
                  </p>
                  <p className={`text-xs italic ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {achievement.requirement}
                  </p>

                  {/* Progress or Date */}
                  {achievement.earned ? (
                    <p className={`text-xs mt-2 font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
                      Earned {achievement.earnedDate}
                    </p>
                  ) : achievement.progress !== undefined && achievement.total ? (
                    <div className="mt-3">
                      <div className={`flex items-center justify-between text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <span>Progress</span>
                        <span className="font-medium">
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                          style={{
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className={`rounded-2xl border p-12 text-center ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}>
          <Trophy className={`h-12 w-12 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          <h3 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            No achievements found
          </h3>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            Try adjusting your filters to see more achievements
          </p>
        </div>
      )}
    </div>
  );
}
