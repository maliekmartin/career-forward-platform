"use client";

/**
 * Example usage of StatCard and StatCardGrid components
 *
 * This file demonstrates how to use the premium gradient stat cards
 * with data from the dashboard types.
 */

import { StatCardGrid, StatCardProps } from "./stat-card";
import { COACH_METRICS, JOB_SEEKER_METRICS } from "@/lib/types/dashboard";

// ==================== EXAMPLE: COACH DASHBOARD ====================

export function CoachStatCardsExample() {
  // Example data - in a real app, this would come from your API/state
  const statCards: StatCardProps[] = [
    {
      id: "active_clients",
      label: COACH_METRICS.active_clients.label,
      value: 24,
      icon: COACH_METRICS.active_clients.icon,
      gradient: COACH_METRICS.active_clients.gradient,
      valueType: COACH_METRICS.active_clients.valueType,
      trend: { value: 12, direction: "up" },
    },
    {
      id: "tasks_due_today",
      label: COACH_METRICS.tasks_due_today.label,
      value: 7,
      icon: COACH_METRICS.tasks_due_today.icon,
      gradient: COACH_METRICS.tasks_due_today.gradient,
      valueType: COACH_METRICS.tasks_due_today.valueType,
    },
    {
      id: "unread_messages",
      label: COACH_METRICS.unread_messages.label,
      value: 15,
      icon: COACH_METRICS.unread_messages.icon,
      gradient: COACH_METRICS.unread_messages.gradient,
      valueType: COACH_METRICS.unread_messages.valueType,
      trend: { value: 5, direction: "down" },
    },
    {
      id: "placements_this_month",
      label: COACH_METRICS.placements_this_month.label,
      value: 8,
      icon: COACH_METRICS.placements_this_month.icon,
      gradient: COACH_METRICS.placements_this_month.gradient,
      valueType: COACH_METRICS.placements_this_month.valueType,
      trend: { value: 33, direction: "up" },
    },
    {
      id: "interviews_scheduled",
      label: COACH_METRICS.interviews_scheduled.label,
      value: 12,
      icon: COACH_METRICS.interviews_scheduled.icon,
      gradient: COACH_METRICS.interviews_scheduled.gradient,
      valueType: COACH_METRICS.interviews_scheduled.valueType,
    },
    {
      id: "clients_needing_attention",
      label: COACH_METRICS.clients_needing_attention.label,
      value: 3,
      icon: COACH_METRICS.clients_needing_attention.icon,
      gradient: COACH_METRICS.clients_needing_attention.gradient,
      valueType: COACH_METRICS.clients_needing_attention.valueType,
      onClick: () => console.log("Navigate to clients needing attention"),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Coach Dashboard</h2>
      <StatCardGrid cards={statCards} layout="3x2" />
    </div>
  );
}

// ==================== EXAMPLE: JOB SEEKER DASHBOARD ====================

export function JobSeekerStatCardsExample() {
  // Example data - in a real app, this would come from your API/state
  const statCards: StatCardProps[] = [
    {
      id: "career_score",
      label: JOB_SEEKER_METRICS.career_score.label,
      value: 78,
      icon: JOB_SEEKER_METRICS.career_score.icon,
      gradient: JOB_SEEKER_METRICS.career_score.gradient,
      valueType: JOB_SEEKER_METRICS.career_score.valueType,
      trend: { value: 8, direction: "up" },
    },
    {
      id: "applications_sent",
      label: JOB_SEEKER_METRICS.applications_sent.label,
      value: 42,
      icon: JOB_SEEKER_METRICS.applications_sent.icon,
      gradient: JOB_SEEKER_METRICS.applications_sent.gradient,
      valueType: JOB_SEEKER_METRICS.applications_sent.valueType,
      trend: { value: 15, direction: "up" },
    },
    {
      id: "interviews_scheduled",
      label: JOB_SEEKER_METRICS.interviews_scheduled.label,
      value: 5,
      icon: JOB_SEEKER_METRICS.interviews_scheduled.icon,
      gradient: JOB_SEEKER_METRICS.interviews_scheduled.gradient,
      valueType: JOB_SEEKER_METRICS.interviews_scheduled.valueType,
    },
    {
      id: "tasks_to_complete",
      label: JOB_SEEKER_METRICS.tasks_to_complete.label,
      value: 8,
      icon: JOB_SEEKER_METRICS.tasks_to_complete.icon,
      gradient: JOB_SEEKER_METRICS.tasks_to_complete.gradient,
      valueType: JOB_SEEKER_METRICS.tasks_to_complete.valueType,
      onClick: () => console.log("Navigate to tasks"),
    },
    {
      id: "quest_progress",
      label: JOB_SEEKER_METRICS.quest_progress.label,
      value: 65,
      icon: JOB_SEEKER_METRICS.quest_progress.icon,
      gradient: JOB_SEEKER_METRICS.quest_progress.gradient,
      valueType: JOB_SEEKER_METRICS.quest_progress.valueType,
      trend: { value: 10, direction: "up" },
    },
    {
      id: "profile_completion",
      label: JOB_SEEKER_METRICS.profile_completion.label,
      value: 85,
      icon: JOB_SEEKER_METRICS.profile_completion.icon,
      gradient: JOB_SEEKER_METRICS.profile_completion.gradient,
      valueType: JOB_SEEKER_METRICS.profile_completion.valueType,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Job Seeker Dashboard</h2>
      <StatCardGrid cards={statCards} layout="3x2" />
    </div>
  );
}

// ==================== EXAMPLE: DYNAMIC METRIC CARDS ====================

/**
 * Helper function to convert metric definitions to stat cards
 */
export function createStatCardsFromMetrics(
  metricIds: string[],
  metricValues: Record<string, number>,
  metrics: typeof COACH_METRICS | typeof JOB_SEEKER_METRICS,
  trends?: Record<string, { value: number; direction: "up" | "down" }>,
  onCardClick?: (metricId: string) => void
): StatCardProps[] {
  return metricIds.map((id) => {
    const metric = metrics[id as keyof typeof metrics];
    if (!metric) return null;

    return {
      id,
      label: metric.label,
      value: metricValues[id] || 0,
      icon: metric.icon,
      gradient: metric.gradient,
      valueType: metric.valueType,
      trend: trends?.[id],
      onClick: onCardClick ? () => onCardClick(id) : undefined,
    };
  }).filter(Boolean) as StatCardProps[];
}

// ==================== EXAMPLE: USING THE HELPER ====================

export function DynamicStatCardsExample() {
  // Example: Selected metric IDs (could come from user preferences)
  const selectedMetricIds = [
    "career_score",
    "applications_sent",
    "interviews_scheduled",
    "quest_progress",
    "profile_completion",
    "days_active_streak",
  ];

  // Example: Actual values (would come from API)
  const metricValues = {
    career_score: 78,
    applications_sent: 42,
    interviews_scheduled: 5,
    quest_progress: 65,
    profile_completion: 85,
    days_active_streak: 14,
  };

  // Example: Trend data (optional)
  const trends = {
    career_score: { value: 8, direction: "up" as const },
    applications_sent: { value: 15, direction: "up" as const },
    quest_progress: { value: 10, direction: "up" as const },
  };

  // Create stat cards from metrics
  const statCards = createStatCardsFromMetrics(
    selectedMetricIds,
    metricValues,
    JOB_SEEKER_METRICS,
    trends,
    (metricId) => console.log(`Clicked on ${metricId}`)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dynamic Stat Cards</h2>
      <StatCardGrid cards={statCards} layout="2x3" />
    </div>
  );
}
