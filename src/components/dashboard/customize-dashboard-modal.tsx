"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  X,
  Check,
  GripVertical,
  Eye,
  EyeOff,
  Crown,
  RotateCcw,
  Sparkles,
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
  Send,
  Target,
  User,
  Flame,
  Bookmark,
  Lightbulb,
  BarChart3,
  Activity,
  CheckSquare,
  Zap,
  Map,
  Briefcase,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DashboardPreferences,
  SectionPreference,
  MetricDefinition,
  SectionDefinition,
  COACH_METRICS,
  JOB_SEEKER_METRICS,
  COACH_SECTIONS,
  JOB_SEEKER_SECTIONS,
  getDefaultDashboardPreferences,
  MAX_METRICS,
  CoachMetricId,
  JobSeekerMetricId,
  CoachSectionId,
  JobSeekerSectionId,
} from "@/lib/types/dashboard";

// Icon mapping for Lucide icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
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
  Send,
  Target,
  User,
  Flame,
  Bookmark,
  Eye,
  Lightbulb,
  BarChart3,
  Activity,
  CheckSquare,
  Zap,
  Map,
  Briefcase,
  Link,
};

interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "coach" | "job_seeker";
  currentPreferences: DashboardPreferences;
  onSave: (preferences: DashboardPreferences) => Promise<void>;
}

export function CustomizeDashboardModal({
  isOpen,
  onClose,
  role,
  currentPreferences,
  onSave,
}: CustomizeDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "sections">("metrics");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [sections, setSections] = useState<SectionPreference[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Get metrics and sections based on role
  const metricsDefinitions =
    role === "coach" ? COACH_METRICS : JOB_SEEKER_METRICS;
  const sectionsDefinitions =
    role === "coach" ? COACH_SECTIONS : JOB_SEEKER_SECTIONS;

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMetrics([...currentPreferences.metrics]);
      setSections([...currentPreferences.sections]);
      setHasChanges(false);
      setActiveTab("metrics");
    }
  }, [isOpen, currentPreferences]);

  // Track changes
  useEffect(() => {
    const metricsChanged =
      JSON.stringify(selectedMetrics) !==
      JSON.stringify(currentPreferences.metrics);
    const sectionsChanged =
      JSON.stringify(sections) !== JSON.stringify(currentPreferences.sections);
    setHasChanges(metricsChanged || sectionsChanged);
  }, [selectedMetrics, sections, currentPreferences]);

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metricId)) {
        return prev.filter((id) => id !== metricId);
      } else {
        if (prev.length >= MAX_METRICS) {
          return prev;
        }
        return [...prev, metricId];
      }
    });
  };

  const handleReorderMetrics = (newOrder: string[]) => {
    setSelectedMetrics(newOrder);
  };

  const handleToggleSectionVisibility = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  const handleReorderSections = (newOrder: SectionPreference[]) => {
    setSections(
      newOrder.map((section, index) => ({
        ...section,
        order: index,
      }))
    );
  };

  const handleReset = () => {
    const defaults = getDefaultDashboardPreferences(role);
    setSelectedMetrics([...defaults.metrics]);
    setSections([...defaults.sections]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedPreferences: DashboardPreferences = {
        ...currentPreferences,
        metrics: selectedMetrics,
        sections: sections,
        updatedAt: new Date().toISOString(),
      };
      await onSave(updatedPreferences);
      onClose();
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const availableMetrics = Object.values(metricsDefinitions);
  const selectedMetricsObjects = selectedMetrics
    .map((id) => {
      // Type-safe lookup based on role
      if (role === "coach") {
        return COACH_METRICS[id as CoachMetricId];
      }
      return JOB_SEEKER_METRICS[id as JobSeekerMetricId];
    })
    .filter((m): m is MetricDefinition => Boolean(m));
  const unselectedMetrics = availableMetrics.filter(
    (m) => !selectedMetrics.includes(m.id)
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-[#2B8A8A]/5 to-purple-500/5 dark:from-[#2B8A8A]/10 dark:to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2B8A8A] to-purple-600 flex items-center justify-center shadow-lg shadow-[#2B8A8A]/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Customize Dashboard
                  </h2>
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalize your workspace to match your workflow
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="metrics" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Metrics
                  <Badge
                    variant="outline"
                    className="text-xs bg-white dark:bg-gray-800"
                  >
                    {selectedMetrics.length}/{MAX_METRICS}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="sections" className="gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Sections
                  <Badge
                    variant="outline"
                    className="text-xs bg-white dark:bg-gray-800"
                  >
                    {sections.filter((s) => s.visible).length}/{sections.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Metrics Tab Content */}
              <TabsContent value="metrics" className="mt-4 space-y-4">
                <div className="flex-1 overflow-y-auto max-h-[calc(90vh-280px)] space-y-6 pr-2">
                  {/* Selected Metrics */}
                  {selectedMetricsObjects.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        Selected Metrics ({selectedMetrics.length}/{MAX_METRICS})
                      </h3>
                      <Reorder.Group
                        axis="y"
                        values={selectedMetricsObjects}
                        onReorder={(newOrder) =>
                          handleReorderMetrics(newOrder.map((m) => m.id))
                        }
                        className="space-y-2"
                      >
                        {selectedMetricsObjects.map((metric) => (
                          <MetricCard
                            key={metric.id}
                            metric={metric}
                            isSelected={true}
                            onToggle={handleMetricToggle}
                            isDraggable={true}
                          />
                        ))}
                      </Reorder.Group>
                    </div>
                  )}

                  {/* Available Metrics */}
                  {unselectedMetrics.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        Available Metrics
                        {selectedMetrics.length >= MAX_METRICS && (
                          <span className="text-xs font-normal text-amber-600 dark:text-amber-400">
                            (Deselect a metric to add more)
                          </span>
                        )}
                      </h3>
                      <div className="space-y-2">
                        {unselectedMetrics.map((metric) => (
                          <MetricCard
                            key={metric.id}
                            metric={metric}
                            isSelected={false}
                            onToggle={handleMetricToggle}
                            isDraggable={false}
                            isDisabled={selectedMetrics.length >= MAX_METRICS}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Sections Tab Content */}
              <TabsContent value="sections" className="mt-4">
                <div className="flex-1 overflow-y-auto max-h-[calc(90vh-280px)] pr-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Dashboard Sections
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Drag to reorder, toggle visibility
                      </p>
                    </div>
                    <Reorder.Group
                      axis="y"
                      values={sections}
                      onReorder={handleReorderSections}
                      className="space-y-2"
                    >
                      {sections.map((section) => {
                        // Type-safe lookup based on role
                        const definition =
                          role === "coach"
                            ? COACH_SECTIONS[section.id as CoachSectionId]
                            : JOB_SEEKER_SECTIONS[section.id as JobSeekerSectionId];
                        return (
                          <SectionCard
                            key={section.id}
                            section={section}
                            definition={definition}
                            onToggleVisibility={handleToggleSectionVisibility}
                          />
                        );
                      })}
                    </Reorder.Group>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 mt-auto">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className={`gap-2 ${
                    hasChanges && !isSaving
                      ? "bg-gradient-to-r from-[#2B8A8A] to-purple-600 hover:from-[#237070] hover:to-purple-700 text-white shadow-lg shadow-[#2B8A8A]/25"
                      : ""
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Metric Card Component
interface MetricCardProps {
  metric: MetricDefinition;
  isSelected: boolean;
  onToggle: (metricId: string) => void;
  isDraggable: boolean;
  isDisabled?: boolean;
}

function MetricCard({
  metric,
  isSelected,
  onToggle,
  isDraggable,
  isDisabled,
}: MetricCardProps) {
  const Icon = iconMap[metric.icon];

  const content = (
    <div
      className={`group relative rounded-xl border p-4 transition-all cursor-pointer ${
        isSelected
          ? "bg-gradient-to-br from-[#2B8A8A]/5 to-purple-500/5 dark:from-[#2B8A8A]/10 dark:to-purple-500/10 border-[#2B8A8A]/30 dark:border-[#2B8A8A]/50 shadow-md"
          : isDisabled
          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#2B8A8A]/30 dark:hover:border-[#2B8A8A]/50 hover:shadow-md"
      }`}
      onClick={() => !isDisabled && onToggle(metric.id)}
    >
      <div className="flex items-start gap-3">
        {isDraggable && (
          <div className="mt-1 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5" />
          </div>
        )}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${metric.gradient.from}, ${metric.gradient.to})`,
          }}
        >
          {Icon && <Icon className="h-5 w-5 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {metric.label}
            </h4>
            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {metric.description}
          </p>
        </div>
      </div>
    </div>
  );

  if (isDraggable) {
    return (
      <Reorder.Item
        value={metric}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileDrag={{ scale: 1.02, zIndex: 10 }}
      >
        {content}
      </Reorder.Item>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.div>
  );
}

// Section Card Component
interface SectionCardProps {
  section: SectionPreference;
  definition: SectionDefinition;
  onToggleVisibility: (sectionId: string) => void;
}

function SectionCard({
  section,
  definition,
  onToggleVisibility,
}: SectionCardProps) {
  const Icon = iconMap[definition.icon];

  return (
    <Reorder.Item
      value={section}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
    >
      <div
        className={`group relative rounded-xl border p-4 transition-all ${
          section.visible
            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#2B8A8A]/30 dark:hover:border-[#2B8A8A]/50 hover:shadow-md"
            : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2B8A8A] to-purple-600 flex items-center justify-center flex-shrink-0">
            {Icon && <Icon className="h-5 w-5 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {definition.label}
              </h4>
              <Badge
                variant="outline"
                className="text-xs bg-white dark:bg-gray-900"
              >
                Order: {section.order + 1}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {definition.description}
            </p>
          </div>
          <button
            onClick={() => onToggleVisibility(section.id)}
            className={`p-2 rounded-lg transition-colors ${
              section.visible
                ? "text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {section.visible ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}
