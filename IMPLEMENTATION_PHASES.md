# HabitTrack Implementation Phases

Implementation is incremental. Keep the app runnable after each phase and check off work only after its validation passes.

## Phase 0: Project Foundation

- [x] Create the Vite React TypeScript project.
- [x] Configure Tailwind CSS, strict TypeScript, scripts, and required dependencies.
- [x] Establish component, page, hook, context, utility, type, and test folders.
- [x] Add a minimal app entry that runs and builds.

**Exit criteria:** The development server and production build both run successfully.

## Phase 1: Application Shell and Visual System

- [x] Responsive dark-first shell, sidebar, branding, navigation, and placeholder routes.
- [x] Header with month controls, Today, theme, notifications, and profile controls.
- [x] Dark/light theme with persistence and mobile navigation.
- [x] Reusable visual tokens matching the supplied dashboard direction.

**Exit criteria:** All routes render through the shared shell at desktop, tablet, and mobile widths.

## Phase 2: Data Model, Persistence, and Sample Data

- [x] Strict types for habits, logs, expenses, settings, and app state.
- [x] Local persistence hooks/context with raw data only.
- [x] Seed the 14 requested habits, September 2026 sample logs, and expenses.
- [x] Reset demo data and persistence across reloads.

**Exit criteria:** Data survives reloads and reset returns to the known demo state.

## Phase 3: Habit Management and Calendar Logic

- [x] Add/edit/delete/archive/reorder habit workflows.
- [x] Habit form with name, icon, target, color, and description.
- [x] Dynamic month dates, weekday labels, and week grouping.
- [x] Interactive accessible matrix with mobile horizontal scrolling and sticky labels.
- [x] Tests for September 2026, February 2028, February 2027, and December 2026.

**Exit criteria:** Habit CRUD, calendar generation, and persisted cell toggles work correctly.

## Phase 4: Dashboard Habit Analytics

- [x] Dynamic KPI cards and per-habit target progress.
- [x] Daily progress chart, weekly cards, Top 10 sorting, and progress donut.
- [x] All analytics update immediately after a habit toggle.
- [x] Tests for monthly, daily, weekly, and leaderboard calculations.

**Exit criteria:** Dashboard statistics are live calculations, never hardcoded values.

## Phase 5: Expense Tracking

- [x] Expense CRUD with confirmation and empty states.
- [x] Indian Rupee formatting, daily aggregation, weekly summaries, and monthly total.
- [x] Expense calculation and formatting tests.

**Exit criteria:** Expenses persist and all totals/charts derive from live records.

## Phase 6: Dedicated Habits and Expenses Pages

- [x] `/habits` list/table with filters and actions.
- [x] `/expenses` search, date/category filters, totals, category breakdown, and charts.
- [x] Reuse forms and calculation utilities across routes.

**Exit criteria:** Core workflows work without relying on the dashboard.

## Phase 7: Analytics and Streaks

- [x] Habit trends, consistency, best/worst habits, and weekly/monthly analytics.
- [x] Current and longest streak calculations with missed-day handling.
- [x] Expense analytics: monthly, category, daily, weekly, highest day, and average day.
- [x] Streak and boundary-case tests.

**Exit criteria:** Analytics and streaks are correct from shared raw data.

## Phase 8: Yearly Overview

- [x] January-December monthly summaries and yearly totals.
- [x] Click a month to navigate to that dashboard month.
- [x] Verify year transitions and leap-year totals.

**Exit criteria:** Yearly reporting is accurate without duplicate derived storage.

## Phase 9: Settings, Import/Export, and Offline Support

- [x] Settings for theme, currency, reset, import, and export.
- [x] Dated JSON backup with validation before replacement.
- [x] Manifest and service worker for basic offline startup where practical.

**Exit criteria:** Data can be safely backed up/restored and core tracking works offline.

## Phase 10: Responsive, Accessibility, and UX Polish

- [x] Verify desktop, laptop, tablet, and mobile layouts.
- [x] Focus states, keyboard navigation, semantic landmarks, contrast, and aria labels.
- [x] Empty states, toasts, restrained transitions, hover feedback, and loading states.
- [x] Check text, controls, charts, and matrix behavior at supported widths.

**Exit criteria:** The app is polished and usable with keyboard, mouse, and touch input.

## Phase 11: Verification and Release Pass

- [x] Run tests, TypeScript checks, and the production build.
- [x] Manually verify all four required date scenarios.
- [x] Verify the critical habit toggle-to-analytics flow.
- [x] Verify expense filters, aggregation, editing, deletion, import, export, and reset.
- [x] Check console errors, network failures, and reference-image alignment.

**Exit criteria:** HabitTrack is a maintainable working application rather than a static mockup.

## Current Status

- [x] Requirements reviewed and restored in `Prompt.md`.
- [x] Phase plan restored.
- [x] Phase 0: Project Foundation
- [x] Phase 1: Application Shell and Visual System
- [x] Phase 2: Data Model, Persistence, and Sample Data
- [x] Phase 3: Habit Management and Calendar Logic
- [x] Phase 4: Dashboard Habit Analytics
- [x] Phase 5: Expense Tracking
- [x] Phase 6: Dedicated Habits and Expenses Pages
- [x] Phase 7: Analytics and Streaks
- [x] Phase 8: Yearly Overview
- [x] Phase 9: Settings, Import/Export, and Offline Support
- [x] Phase 10: Responsive, Accessibility, and UX Polish
- [x] Phase 11: Verification and Release Pass

## Future Work

These are optional improvements beyond the completed implementation phases. They are ordered from the highest-value near-term work to advanced product capabilities.

### Near-Term Polish

- [ ] Add real PWA icons in multiple sizes and verify install prompts on Chrome, Edge, and mobile browsers.
- [ ] Add a small toast system for save, delete, import, export, reset, and error feedback.
- [ ] Add skeleton states for charts, dashboard panels, and route transitions.
- [ ] Add a first-run welcome state with a choice between demo data and an empty workspace.
- [ ] Replace remaining placeholder copy with finalized product language and contextual empty states.
- [ ] Add keyboard shortcuts for month navigation, habit completion, search, and opening the Add Habit form.
- [ ] Add a confirmation dialog component instead of relying on browser `window.confirm`.
- [ ] Add an accessible month picker instead of the current display-only month selector.

### Performance and Maintainability

- [ ] Code-split chart-heavy routes with lazy-loaded route modules.
- [ ] Reduce the Recharts bundle warning through route-level loading or a lighter chart strategy.
- [ ] Memoize large matrix rows and use more targeted selectors when the habit dataset grows.
- [ ] Add virtualization for very large habit lists and long expense histories.
- [ ] Add a typed storage schema version and migrations for future data-model changes.
- [ ] Add runtime validation with a schema library such as Zod when import formats become more complex.
- [ ] Add error boundaries around route-level features and chart rendering.
- [ ] Add CI checks for build, lint, tests, and production artifact generation.

### Testing and Quality

- [ ] Add component tests for habit toggling, CRUD forms, filters, import/export, and theme persistence.
- [ ] Add browser end-to-end tests for the critical habit-cell-to-analytics flow.
- [ ] Add visual regression screenshots for desktop, tablet, and mobile layouts.
- [ ] Add accessibility automation with axe or equivalent tooling.
- [ ] Expand date tests for timezone boundaries, year transitions, and months with different starting weekdays.
- [ ] Add property-based tests for calendar grouping, capped progress, expense aggregation, and streak calculations.
- [ ] Test offline reload and service-worker cache behavior in a production preview environment.

### Data Safety and Offline Reliability

- [ ] Add IndexedDB as an optional storage adapter for larger datasets and safer transactional writes.
- [ ] Add backup metadata, schema version, export timestamp, and human-readable validation errors.
- [ ] Add automatic periodic local backups with a configurable retention limit.
- [ ] Add conflict-safe import modes: replace, merge, and preview changes before applying them.
- [ ] Add a storage quota warning and recovery flow for unavailable or corrupted local storage.
- [ ] Improve the service worker with explicit cache versioning, update notifications, and stale-cache cleanup.
- [ ] Add offline/online status indicators and retry handling for future remote integrations.

### Habit and Productivity Features

- [ ] Add habit notes, reminders, schedules, start dates, and optional rest days.
- [ ] Support habits with weekly targets, weekday schedules, and multiple completion events per day where appropriate.
- [ ] Add streak freeze, grace days, milestone badges, and completion celebrations with reduced-motion support.
- [ ] Add habit templates and quick-start routines for common goals.
- [ ] Add custom habit groups, tags, and filtering across the dashboard.
- [ ] Add a daily journal or reflection note linked to each date.
- [ ] Add configurable dashboard widgets and saved analytics views.

### Expense and Reporting Features

- [ ] Add custom expense categories and category colors.
- [ ] Add recurring expenses and planned budgets.
- [ ] Add budget-versus-actual reporting and overspend alerts.
- [ ] Add CSV export in addition to JSON backup export.
- [ ] Add date-range reports, calendar heatmaps, and printable monthly summaries.
- [ ] Add optional tax, payment method, merchant, and receipt attachment fields.
- [ ] Add currency conversion only if multi-currency support becomes a real requirement.

### Security and Account Infrastructure

- [ ] Add Google Authentication (GAuth) after the local personal-use login is replaced by a backend-backed account system.
- [ ] Add an optional backend API and database adapter without changing the local domain model.
- [ ] Add authentication, per-user data isolation, and secure session handling for cloud sync.
- [ ] Add encrypted backups or client-side encryption for sensitive exported data.
- [ ] Add server-side validation, rate limiting, audit logs, and account deletion workflows.
- [ ] Add conflict resolution and multi-device synchronization for offline edits.
- [ ] Document the threat model and privacy guarantees before collecting any cloud data.

### Advanced Platform Capabilities

- [ ] Add Web Push notifications for reminders only with explicit user permission.
- [ ] Add background sync for queued remote changes when connectivity returns.
- [ ] Add installable desktop/mobile packaging only if the web PWA no longer covers the target workflow.
- [ ] Add a plugin or integration layer for calendar providers, task managers, or finance imports.
- [ ] Add observability for production errors, performance, storage failures, and service-worker updates without collecting unnecessary personal data.
- [ ] Add a public API and webhook events if external automation becomes a supported product feature.

### Suggested Order

1. Finish near-term UX feedback, month picker, PWA icons, and confirmation dialogs.
2. Add component/end-to-end/accessibility tests and route code splitting.
3. Add storage versioning, IndexedDB, stronger import/merge flows, and offline update handling.
4. Add habit scheduling, budgets, recurring expenses, and richer reporting.
5. Add backend sync, authentication, encryption, and integrations only after the local-first workflow is stable.