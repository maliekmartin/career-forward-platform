"use client";

import { useEffect, useState } from "react";
import { StatCard, StatCardGrid, StatCardGridSkeleton, StatCardProps } from "./stat-card";
import { useDashboardPreferences, useMetricValues } from "@/lib/hooks/use-dashboard-preferences";
import {
  COACH_METRICS,
  JOB_SEEKER_METRICS,
  CoachMetricId,
  JobSeekerMetricId,
} from "@/lib/types/dashboard";

interface PremiumStatCardsProps {
  role: "coach" | "job_seeker";
  fallbackCards?: StatCardProps[];
}

export function PremiumStatCards({ role, fallbackCards }: PremiumStatCardsProps) {
  const { preferences, isPremium, isLoading } = useDashboardPreferences(role);
  const metricIds = preferences?.metrics || [];
  const metricValues = useMetricValues(metricIds, role);

  // Get metric definitions based on role
  const metricsDefinitions = role === "coach" ? COACH_METRICS : JOB_SEEKER_METRICS;

  // Show loading state
  if (isLoading) {
    return <StatCardGridSkeleton count={6} layout="3x2" />;
  }

  // If not premium and fallback cards provided, show fallback
  if (!isPremium && fallbackCards) {
    return <StatCardGrid cards={fallbackCards} layout="3x2" />;
  }

  // Build stat cards from preferences
  const cards: StatCardProps[] = metricIds
    .map((id): StatCardProps | null => {
      const metric = role === "coach"
        ? COACH_METRICS[id as CoachMetricId]
        : JOB_SEEKER_METRICS[id as JobSeekerMetricId];

      if (!metric) return null;

      return {
        id: metric.id,
        label: metric.label,
        value: metricValues[id] || metric.defaultValue || 0,
        icon: metric.icon,
        gradient: metric.gradient,
        valueType: metric.valueType,
      };
    })
    .filter((card): card is StatCardProps => card !== null);

  // If no cards configured, use defaults
  if (cards.length === 0) {
    const defaultIds = role === "coach"
      ? ["active_clients", "tasks_due_today", "placements_this_month", "interviews_scheduled", "unread_messages", "new_clients_week"]
      : ["career_score", "applications_sent", "interviews_scheduled", "tasks_to_complete", "quest_progress", "profile_completion"];

    const defaultCards: StatCardProps[] = defaultIds
      .map((id): StatCardProps | null => {
        const metric = role === "coach"
          ? COACH_METRICS[id as CoachMetricId]
          : JOB_SEEKER_METRICS[id as JobSeekerMetricId];

        if (!metric) return null;

        return {
          id: metric.id,
          label: metric.label,
          value: metricValues[id] || metric.defaultValue || 0,
          icon: metric.icon,
          gradient: metric.gradient,
          valueType: metric.valueType,
        };
      })
      .filter((card): card is StatCardProps => card !== null);

    return <StatCardGrid cards={defaultCards} layout="3x2" />;
  }

  return (
    <StatCardGrid
      cards={cards}
      layout={preferences?.metricsLayout || "3x2"}
    />
  );
}
