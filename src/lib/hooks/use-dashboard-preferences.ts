"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DashboardPreferences,
  getDefaultDashboardPreferences,
  CoachMetricId,
  JobSeekerMetricId,
  SectionPreference,
} from "@/lib/types/dashboard";

interface UseDashboardPreferencesResult {
  preferences: DashboardPreferences | null;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (newPreferences: Partial<DashboardPreferences>) => Promise<boolean>;
  updateMetrics: (metrics: string[]) => Promise<boolean>;
  updateSections: (sections: SectionPreference[]) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useDashboardPreferences(
  role: 'coach' | 'job_seeker'
): UseDashboardPreferencesResult {
  const [preferences, setPreferences] = useState<DashboardPreferences | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/dashboard/preferences');

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch preferences');
      }

      const data = await res.json();
      setPreferences(data.preferences);
      setIsPremium(data.isPremium);
    } catch (err) {
      console.error('Error fetching dashboard preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
      // Fall back to defaults
      setPreferences(getDefaultDashboardPreferences(role));
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = useCallback(async (
    newPreferences: Partial<DashboardPreferences>
  ): Promise<boolean> => {
    if (!isPremium) {
      setError('Premium subscription required to customize dashboard');
      return false;
    }

    try {
      setError(null);

      const updatedPreferences: DashboardPreferences = {
        ...preferences!,
        ...newPreferences,
        updatedAt: new Date().toISOString(),
      };

      // Send flat fields as expected by the API
      const res = await fetch('/api/dashboard/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: updatedPreferences.metrics,
          sections: updatedPreferences.sections,
          metricsLayout: updatedPreferences.metricsLayout,
          themeOverride: updatedPreferences.themeOverride,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update preferences');
      }

      const data = await res.json();
      setPreferences(data.preferences);
      return true;
    } catch (err) {
      console.error('Error updating dashboard preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
      return false;
    }
  }, [preferences, isPremium]);

  const updateMetrics = useCallback(async (metrics: string[]): Promise<boolean> => {
    return updatePreferences({ metrics });
  }, [updatePreferences]);

  const updateSections = useCallback(async (
    sections: SectionPreference[]
  ): Promise<boolean> => {
    return updatePreferences({ sections });
  }, [updatePreferences]);

  const resetToDefaults = useCallback(async (): Promise<boolean> => {
    const defaults = getDefaultDashboardPreferences(role);
    return updatePreferences(defaults);
  }, [role, updatePreferences]);

  return {
    preferences,
    isPremium,
    isLoading,
    error,
    updatePreferences,
    updateMetrics,
    updateSections,
    resetToDefaults,
    refetch: fetchPreferences,
  };
}

// Helper hook for computing metric values (mock data for now)
export function useMetricValues(
  metricIds: string[],
  role: 'coach' | 'job_seeker'
): Record<string, number> {
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    // Mock values - in production, these would come from API
    const mockCoachValues: Record<CoachMetricId, number> = {
      active_clients: 12,
      tasks_due_today: 4,
      unread_messages: 7,
      placements_this_month: 3,
      interviews_scheduled: 8,
      new_clients_week: 2,
      clients_needing_attention: 3,
      pending_reviews: 5,
      client_success_rate: 78,
      avg_days_to_placement: 45,
    };

    const mockJobSeekerValues: Record<JobSeekerMetricId, number> = {
      career_score: 72,
      applications_sent: 15,
      interviews_scheduled: 2,
      tasks_to_complete: 3,
      quest_progress: 45,
      profile_completion: 85,
      days_active_streak: 7,
      saved_jobs_count: 12,
      resume_views: 23,
      recommendations_pending: 4,
    };

    const mockValues = role === 'coach' ? mockCoachValues : mockJobSeekerValues;

    const filteredValues: Record<string, number> = {};
    metricIds.forEach(id => {
      if (id in mockValues) {
        filteredValues[id] = mockValues[id as keyof typeof mockValues];
      }
    });

    setValues(filteredValues);
  }, [metricIds, role]);

  return values;
}
