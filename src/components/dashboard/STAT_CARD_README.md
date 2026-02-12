# StatCard Components

Premium gradient stat card components with MoCrypto-style visual energy for the Career Quest Platform dashboard.

## Components

### StatCard

A single premium stat card with gradient backgrounds, icon glow effects, and smooth animations.

#### Features

- Gradient backgrounds with customizable from/to colors
- Icon with animated glow effect
- Smooth hover animations (scale + lift)
- Animated number counter using Framer Motion springs
- Trend indicators (up/down with percentage)
- Support for different value types (number, percentage, days)
- Light/dark mode support
- Click handler support
- Premium visual polish with shadows and depth

#### Props

```typescript
interface StatCardProps {
  id: string;                    // Unique identifier
  label: string;                 // Display label
  value: number;                 // Numeric value to display
  icon: string;                  // Lucide icon name (e.g., "Users", "Trophy")
  gradient: {                    // Gradient colors
    from: string;                // Start color (hex)
    to: string;                  // End color (hex)
  };
  valueType: 'number' | 'percentage' | 'days';  // How to format the value
  trend?: {                      // Optional trend indicator
    value: number;               // Percentage change
    direction: 'up' | 'down';    // Direction of trend
  };
  onClick?: () => void;          // Optional click handler
}
```

#### Usage

```tsx
import { StatCard } from "@/components/dashboard/stat-card";

<StatCard
  id="active_clients"
  label="Active Clients"
  value={24}
  icon="Users"
  gradient={{ from: "#2B8A8A", to: "#38A169" }}
  valueType="number"
  trend={{ value: 12, direction: "up" }}
  onClick={() => console.log("Card clicked")}
/>
```

### StatCardGrid

A responsive grid container that arranges stat cards in either 3x2 or 2x3 layout with staggered animations.

#### Features

- Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
- Configurable layout (3x2 or 2x3)
- Staggered entrance animations
- Smooth reorder animations with Framer Motion layout
- Consistent gap spacing

#### Props

```typescript
interface StatCardGridProps {
  cards: StatCardProps[];        // Array of stat cards to display
  layout?: '3x2' | '2x3';        // Grid layout (default: '3x2')
  onReorder?: (cards: StatCardProps[]) => void;  // Optional reorder callback
}
```

#### Usage

```tsx
import { StatCardGrid } from "@/components/dashboard/stat-card";

const cards = [
  {
    id: "card1",
    label: "Active Clients",
    value: 24,
    icon: "Users",
    gradient: { from: "#2B8A8A", to: "#38A169" },
    valueType: "number",
  },
  // ... more cards
];

<StatCardGrid cards={cards} layout="3x2" />
```

### Loading States

Skeleton components for loading states:

```tsx
import { StatCardSkeleton, StatCardGridSkeleton } from "@/components/dashboard/stat-card";

// Single skeleton
<StatCardSkeleton />

// Grid of skeletons
<StatCardGridSkeleton count={6} layout="3x2" />
```

## Integration with Dashboard Types

The components are designed to work seamlessly with the dashboard type definitions:

```tsx
import { COACH_METRICS, JOB_SEEKER_METRICS } from "@/lib/types/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";

// Using predefined metrics
<StatCard
  id="active_clients"
  label={COACH_METRICS.active_clients.label}
  value={24}
  icon={COACH_METRICS.active_clients.icon}
  gradient={COACH_METRICS.active_clients.gradient}
  valueType={COACH_METRICS.active_clients.valueType}
/>
```

### Helper Function

Use the `createStatCardsFromMetrics` helper to convert metric definitions to stat cards:

```tsx
import { createStatCardsFromMetrics } from "@/components/dashboard/stat-card-example";
import { JOB_SEEKER_METRICS } from "@/lib/types/dashboard";

const metricIds = ["career_score", "applications_sent", "interviews_scheduled"];
const metricValues = {
  career_score: 78,
  applications_sent: 42,
  interviews_scheduled: 5,
};

const statCards = createStatCardsFromMetrics(
  metricIds,
  metricValues,
  JOB_SEEKER_METRICS
);

<StatCardGrid cards={statCards} />
```

## Supported Icons

The following Lucide icons are available:

- `Users` - User groups
- `CheckCircle` - Tasks/completion
- `MessageSquare` - Messages/chat
- `Trophy` - Achievements/placements
- `Calendar` - Events/schedules
- `UserPlus` - New users
- `AlertTriangle` - Warnings/attention needed
- `FileText` - Documents/reviews
- `TrendingUp` - Success/growth
- `Clock` - Time/duration
- `Sparkles` - Special/premium
- `Send` - Applications/submissions
- `Target` - Goals/progress
- `User` - Profile/individual
- `Flame` - Streaks/activity
- `Bookmark` - Saved items
- `Eye` - Views/visibility
- `Lightbulb` - Ideas/recommendations

To add more icons, import them from `lucide-react` and add to the `iconMap` in `stat-card.tsx`.

## Value Types

### number
Displays as a formatted number with commas:
```
1234 → 1,234
```

### percentage
Displays with a % symbol:
```
75 → 75%
```

### days
Displays with a 'd' suffix:
```
14 → 14d
```

## Animations

### Number Counter
- Uses Framer Motion springs for smooth counting animation
- Triggers when card enters viewport
- Respects user motion preferences

### Hover Effects
- 2% scale increase
- 4px vertical lift
- Increased glow intensity
- Bottom gradient shine effect
- All with smooth 200-300ms transitions

### Grid Entrance
- Staggered fade-in with 100ms delay between cards
- 20px upward slide animation
- 400ms duration with ease-out timing

## Theme Support

Components automatically adapt to light/dark mode using the `useTheme` hook:

- **Light Mode**: White backgrounds, subtle shadows, darker text
- **Dark Mode**: Dark gray backgrounds, enhanced shadows, lighter text

## Accessibility

- Semantic HTML structure
- Keyboard navigation support (when onClick is provided)
- Respects `prefers-reduced-motion` for animations
- Proper contrast ratios for text and icons

## Examples

See `/src/components/dashboard/stat-card-example.tsx` for:

- Coach dashboard example
- Job seeker dashboard example
- Dynamic stat cards with helper function
- Custom click handlers
- Trend indicators

## Performance Considerations

- Components use React.memo internally for optimized re-renders
- Framer Motion's `layout` prop enables automatic reordering animations
- Icon mapping uses static imports for better tree-shaking
- Spring animations are GPU-accelerated

## Customization

### Custom Gradients

Define custom gradients using hex colors:

```tsx
gradient={{ from: "#FF6B6B", to: "#4ECDC4" }}
```

### Custom Icons

To use a custom icon not in the default set:

1. Import the icon from `lucide-react`
2. Add it to the `iconMap` in `stat-card.tsx`
3. Use the icon name in your props

```tsx
// In stat-card.tsx
import { YourCustomIcon } from "lucide-react";

const iconMap = {
  // ... existing icons
  YourCustomIcon,
};
```

## Best Practices

1. **Limit to 6 cards**: For optimal UX, display maximum 6 stat cards
2. **Use consistent metrics**: Stick to metrics defined in dashboard types
3. **Provide trends**: Add trend data when available for better insights
4. **Add click handlers**: Make cards interactive when relevant
5. **Use appropriate layouts**: 3x2 for desktop-focused, 2x3 for mobile-first

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern browser features:
- CSS Grid
- CSS Custom Properties
- CSS Backdrop Filter
- JavaScript ES2020+
