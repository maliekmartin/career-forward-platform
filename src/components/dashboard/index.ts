/**
 * Dashboard Components Index
 *
 * Centralized exports for all dashboard components
 */

// Stat Card Components
export {
  StatCard,
  StatCardGrid,
  StatCardSkeleton,
  StatCardGridSkeleton,
  type StatCardProps,
  type StatCardGridProps,
} from './stat-card';

// Stat Card Examples & Helpers
export {
  CoachStatCardsExample,
  JobSeekerStatCardsExample,
  DynamicStatCardsExample,
  createStatCardsFromMetrics,
} from './stat-card-example';

// Score Card (existing)
export { ScoreCard } from './score-card';

// Continue Card (session resume)
export { ContinueCard } from './continue-card';
