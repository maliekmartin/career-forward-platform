"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  Users,
  CheckCircle,
  MessageSquare,
  Trophy,
  Calendar,
  UserPlus,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  Send,
  Target,
  User,
  Flame,
  Bookmark,
  Eye,
  Lightbulb,
} from "lucide-react";

// ==================== ICON MAPPING ====================

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  CheckCircle,
  MessageSquare,
  Trophy,
  Calendar,
  UserPlus,
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  Sparkles,
  Send,
  Target,
  User,
  Flame,
  Bookmark,
  Eye,
  Lightbulb,
};

// ==================== INTERFACES ====================

export interface StatCardProps {
  id: string;
  label: string;
  value: number;
  icon: string; // Lucide icon name
  gradient: { from: string; to: string };
  valueType: "number" | "percentage" | "days";
  trend?: { value: number; direction: "up" | "down" };
  onClick?: () => void;
}

export interface StatCardGridProps {
  cards: StatCardProps[];
  layout?: "3x2" | "2x3";
  onReorder?: (cards: StatCardProps[]) => void;
}

// ==================== ANIMATED NUMBER COUNTER ====================

function AnimatedNumber({ value, valueType }: { value: number; valueType: "number" | "percentage" | "days" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const display = useTransform(spring, (current) => {
    if (valueType === "percentage") {
      return `${Math.round(current)}%`;
    } else if (valueType === "days") {
      return `${Math.round(current)}d`;
    }
    return Math.round(current).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <motion.span
      ref={ref}
      className="text-3xl font-bold"
    >
      {display}
    </motion.span>
  );
}

// ==================== STAT CARD COMPONENT ====================

export function StatCard({
  id,
  label,
  value,
  icon,
  gradient,
  valueType,
  trend,
  onClick,
}: StatCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [isHovered, setIsHovered] = useState(false);

  // Get icon component
  const IconComponent = iconMap[icon] || Sparkles;

  // Generate CSS for gradient
  const gradientStyle = {
    background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        ${onClick ? "cursor-pointer" : ""}
        ${isDark ? "bg-gray-900/50" : "bg-white"}
        backdrop-blur-sm
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        boxShadow: isDark
          ? "0 4px 20px rgba(0, 0, 0, 0.4)"
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Gradient Background Overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={gradientStyle}
        animate={{
          opacity: isHovered ? 0.15 : 0.10,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl" style={{
        background: `linear-gradient(135deg, ${gradient.from}40 0%, ${gradient.to}40 100%)`,
        padding: "1px",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }} />

      {/* Content */}
      <div className="relative p-6">
        {/* Icon with Glow Effect */}
        <div className="mb-4 flex items-start justify-between">
          <motion.div
            className="relative"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-xl blur-xl"
              style={gradientStyle}
              animate={{
                opacity: isHovered ? 0.5 : 0.3,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon Container */}
            <div
              className="relative w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                ...gradientStyle,
                boxShadow: `0 4px 12px ${gradient.from}40`,
              }}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Trend Indicator */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                trend.direction === "up"
                  ? isDark
                    ? "bg-green-500/20 text-green-400"
                    : "bg-green-100 text-green-700"
                  : isDark
                  ? "bg-red-500/20 text-red-400"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className={`mb-2 ${isDark ? "text-white" : "text-[#0F172A]"}`}>
          <AnimatedNumber value={value} valueType={valueType} />
        </div>

        {/* Label */}
        <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {label}
        </p>

        {/* Bottom Shine Effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${gradient.from}80, ${gradient.to}80, transparent)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// ==================== STAT CARD GRID COMPONENT ====================

export function StatCardGrid({ cards, layout = "3x2", onReorder }: StatCardGridProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Determine grid layout classes
  const gridClass = layout === "3x2"
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2";

  return (
    <motion.div
      className={`grid ${gridClass} gap-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          layout
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ==================== SKELETON LOADING STATE ====================

export function StatCardSkeleton() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`
        rounded-2xl p-6
        ${isDark ? "bg-gray-900/50" : "bg-white"}
        animate-pulse
      `}
      style={{
        boxShadow: isDark
          ? "0 4px 20px rgba(0, 0, 0, 0.4)"
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
        />
      </div>
      <div className={`h-8 w-20 rounded mb-2 ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
      <div className={`h-4 w-32 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
    </div>
  );
}

export function StatCardGridSkeleton({ count = 6, layout = "3x2" }: { count?: number; layout?: "3x2" | "2x3" }) {
  const gridClass = layout === "3x2"
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
