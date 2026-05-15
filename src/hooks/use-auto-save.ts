"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AutoSaveOptions {
  debounceMs?: number;
  onSave?: () => void;
  onRestore?: (data: unknown) => void;
}

interface AutoSaveReturn<T> {
  data: T | null;
  setData: (data: T) => void;
  savedAt: Date | null;
  isSaving: boolean;
  isDirty: boolean;
  clearDraft: () => Promise<void>;
  restoreDraft: () => Promise<T | null>;
}

export function useAutoSave<T>(
  pageKey: string,
  options: AutoSaveOptions = {}
): AutoSaveReturn<T> {
  const { debounceMs = 2000, onSave, onRestore } = options;

  const [data, setDataState] = useState<T | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedData = useRef<string | null>(null);

  // Save draft to API
  const saveDraft = useCallback(async (draftData: T) => {
    const dataString = JSON.stringify(draftData);

    // Skip if data hasn't changed
    if (dataString === lastSavedData.current) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/session-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftData: {
            pageKey,
            data: draftData,
            savedAt: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        lastSavedData.current = dataString;
        setSavedAt(new Date());
        setIsDirty(false);
        onSave?.();
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsSaving(false);
    }
  }, [pageKey, onSave]);

  // Set data with debounced auto-save
  const setData = useCallback((newData: T) => {
    setDataState(newData);
    setIsDirty(true);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new debounce timer
    debounceTimer.current = setTimeout(() => {
      saveDraft(newData);
    }, debounceMs);
  }, [debounceMs, saveDraft]);

  // Clear draft from API
  const clearDraft = useCallback(async () => {
    try {
      await fetch("/api/session-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearDraft: true }),
      });
      lastSavedData.current = null;
      setIsDirty(false);
      setSavedAt(null);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  }, []);

  // Restore draft from API
  const restoreDraft = useCallback(async (): Promise<T | null> => {
    try {
      const response = await fetch("/api/session-state");
      const result = await response.json();

      if (result.success && result.sessionState?.draftData) {
        const draft = result.sessionState.draftData;

        // Check if the draft is for this page
        if (draft.pageKey === pageKey && draft.data) {
          setDataState(draft.data as T);
          lastSavedData.current = JSON.stringify(draft.data);
          setSavedAt(draft.savedAt ? new Date(draft.savedAt) : null);
          onRestore?.(draft.data);
          return draft.data as T;
        }
      }
      return null;
    } catch (error) {
      console.error("Failed to restore draft:", error);
      return null;
    }
  }, [pageKey, onRestore]);

  // Restore draft on mount
  useEffect(() => {
    if (!isInitialized) {
      restoreDraft().then(() => setIsInitialized(true));
    }
  }, [isInitialized, restoreDraft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    data,
    setData,
    savedAt,
    isSaving,
    isDirty,
    clearDraft,
    restoreDraft,
  };
}
