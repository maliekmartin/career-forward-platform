"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Users,
  Star,
  CheckCircle2,
  PartyPopper,
  Trophy,
  Target,
  Sparkles,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

export type MilestoneType =
  | "phone-screen"
  | "first-interview"
  | "final-interview"
  | "offer"
  | "hired"
  | "assessment-complete";

interface MilestoneCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneType: MilestoneType;
  title?: string;
  subtitle?: string;
  details?: {
    company?: string;
    position?: string;
    date?: string;
    assessmentName?: string;
  };
}

const milestoneConfig: Record<MilestoneType, {
  icon: typeof Phone;
  color: string;
  heading: string;
  message: string;
  celebrationLevel: "medium" | "full";
}> = {
  "phone-screen": {
    icon: Phone,
    color: "#2B8A8A",
    heading: "Phone Screen Scheduled!",
    message: "Great progress! You're moving forward in your job search.",
    celebrationLevel: "medium",
  },
  "first-interview": {
    icon: Users,
    color: "#805AD5",
    heading: "Interview Scheduled!",
    message: "You made it to the interview stage! Prepare with our Interview Prep tools.",
    celebrationLevel: "medium",
  },
  "final-interview": {
    icon: Star,
    color: "#D69E2E",
    heading: "Final Interview!",
    message: "You're in the final round! This is a huge accomplishment.",
    celebrationLevel: "medium",
  },
  "offer": {
    icon: Target,
    color: "#38A169",
    heading: "You Got an Offer!",
    message: "Congratulations! An employer wants you on their team.",
    celebrationLevel: "medium",
  },
  "hired": {
    icon: CheckCircle2,
    color: "#38A169",
    heading: "Quest Complete!",
    message: "Congratulations on landing the job!",
    celebrationLevel: "full",
  },
  "assessment-complete": {
    icon: FileText,
    color: "#2B8A8A",
    heading: "Assessment Complete!",
    message: "You've finished another step toward your career goals.",
    celebrationLevel: "medium",
  },
};

export function MilestoneCelebration({
  isOpen,
  onClose,
  milestoneType,
  title,
  subtitle,
  details,
}: MilestoneCelebrationProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const config = milestoneConfig[milestoneType];
  const Icon = config.icon;
  const isFullCelebration = config.celebrationLevel === "full";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative rounded-3xl p-8 text-center max-w-md w-full ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
              }`}
              aria-label="Close celebration"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon with animation */}
            <motion.div
              animate={isFullCelebration ? {
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              } : {
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: isFullCelebration ? 0.6 : 0.8,
                repeat: isFullCelebration ? Infinity : 2,
                repeatDelay: isFullCelebration ? 0.4 : 0,
              }}
              className="mb-6"
            >
              {isFullCelebration ? (
                <div className="relative inline-block">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: `${config.color}20` }}
                  >
                    <CheckCircle2
                      className="h-16 w-16"
                      style={{ color: config.color }}
                    />
                  </motion.div>
                  {/* Decorative sparkles for full celebration */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -bottom-1 -left-3"
                  >
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-4 -left-4"
                  >
                    <PartyPopper className="h-5 w-5 text-purple-500" />
                  </motion.div>
                </div>
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon
                    className="h-10 w-10"
                    style={{ color: config.color }}
                  />
                </div>
              )}
            </motion.div>

            {/* Heading */}
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {title || config.heading}
            </h2>

            {/* Message */}
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {subtitle || config.message}
            </p>

            {/* Details */}
            {details && (
              <div className={`rounded-xl p-4 mb-6 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                {details.company && (
                  <p className={`font-semibold ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
                    {details.position || "Position"} at {details.company}
                  </p>
                )}
                {details.assessmentName && (
                  <p className={`font-semibold ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}>
                    {details.assessmentName}
                  </p>
                )}
                {details.date && (
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {details.date}
                  </p>
                )}
              </div>
            )}

            {/* Animated dots for full celebration */}
            {isFullCelebration && (
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [-10, 0] }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.08,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ["#2B8A8A", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444"][i]
                    }}
                  />
                ))}
              </div>
            )}

            {/* XP Badge for medium celebrations */}
            {!isFullCelebration && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                  isDark ? "bg-yellow-900/30" : "bg-yellow-50"
                }`}
              >
                <Sparkles className={`h-4 w-4 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                  +25 XP Earned
                </span>
              </motion.div>
            )}

            {/* Full celebration XP badge */}
            {isFullCelebration && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                  isDark ? "bg-green-900/30" : "bg-green-50"
                }`}
              >
                <Trophy className={`h-4 w-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-700"}`}>
                  +500 XP - Quest Complete!
                </span>
              </motion.div>
            )}

            {/* Action button */}
            <Button
              onClick={onClose}
              className={`w-full rounded-xl ${
                isDark
                  ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900"
                  : "bg-[#2B8A8A] hover:bg-[#237070] text-white"
              }`}
            >
              {isFullCelebration ? "View Your Achievement" : "Continue Your Quest"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
