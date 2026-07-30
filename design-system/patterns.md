# Page Patterns

> Recurring page-level layouts observed in `console/` as of 2026-07-29. These are not formalized templates — each screen composes its own shell per page (see [`layout.md`](./layout.md#app-shell)) — but these structures appear consistently enough that new screens should follow them rather than invent new ones. "Don't assume mobile/tablet layouts have been considered" applies here: these patterns are desktop-first.

## List / Table page

The most common page type in the app. Structure top-to-bottom:

```
┌─────────────────────────────────────────────────────┐
│ Page header                                         │
│   Title (text-lg font-semibold)                     │
│   Subtitle / count (text-xs text-gray-400)          │
│   Actions: primary button + optional secondary      │
├─────────────────────────────────────────────────────┤
│ Filters row (optional)                              │
│   Search input + select filters, flex gap-2/gap-3   │
├─────────────────────────────────────────────────────┤
│ Data table (lipu/ui/data-table)                     │
│   Sticky header cells, sortable columns             │
│   Pagination bar at bottom                          │
│   Empty state when no rows                          │
└─────────────────────────────────────────────────────┘
```

**Real example:** `app/templates/lipu/operations/*.hbs`

Key classes: outer `p-6` or `px-6 py-8`, table container `rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden`.

---

## Detail / Drawer page

A side drawer that slides in from the right, triggered by a row action. Keeps the list page visible behind a backdrop.

```
┌──────────────────┬──────────────────────────────────┐
│ List page        │ Backdrop (black/40 dark:black/60) │
│ (still visible)  ├──────────────────────────────────┤
│                  │ Drawer panel (440px or 100% max)  │
│                  │   Header: title + close button    │
│                  │   Tab bar (border-b-2 lipu-500)   │
│                  │   Content body (overflow-y-auto)  │
│                  │   Footer actions (optional)       │
└──────────────────┴──────────────────────────────────┘
```

**Real example:** `app/components/lipu/management/user-detail-drawer.hbs`

Drawer width: `w-[min(100%,440px)]`. Z-index: `z-[60]` or `z-[70]` (see [`layout.md`](./layout.md#z-index)).

---

## Modal / Form dialog

Centered overlay for confirmations, short forms, and actions that require focus. Not used for long multi-step flows — those get a drawer instead.

```
┌─────────────────────────────────────────────────────┐
│ Overlay (bg-gray-500/75 dark:bg-gray-900/75)        │
│   ┌───────────────────────────────────────────────┐ │
│   │ Panel (rounded-lg bg-white dark:bg-gray-800)  │ │
│   │   Header (border-b px-6 py-4)                 │ │
│   │     Title + optional subtitle                 │ │
│   │     X close button (top-right)                │ │
│   │   Body (px-6 py-4 space-y-4)                  │ │
│   │     Form fields / content                     │ │
│   │   Footer (border-t px-6 py-4 flex gap-3)      │ │
│   │     Cancel (secondary) + Confirm (primary)    │ │
│   └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Real example:** `app/components/modals/add-client-modal.hbs`

Max width varies by form complexity: `max-w-lg` for short forms, `max-w-4xl` for multi-column forms. Z-index: `z-[9999]`.

---

## Dashboard / KPI page

Landing page for a module. Leads with summary metrics, then detail tables or secondary content below.

```
┌─────────────────────────────────────────────────────┐
│ Page header (title + date range / filter)           │
├──────────┬──────────┬──────────┬────────────────────┤
│ KPI card │ KPI card │ KPI card │ KPI card            │
│ (rounded-xl border p-6)                             │
├─────────────────────────────────────────────────────┤
│ Secondary content (table, chart, or list)           │
└─────────────────────────────────────────────────────┘
```

KPI card pattern (from `kpi-card.hbs`):
```html
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Label</p>
  <h2 class="text-gray-900 dark:text-white" style="font-size:30px;font-weight:500;line-height:150%;">Value</h2>
  <!-- metrics row: flex items-center space-x-6 -->
</div>
```

KPI grid: `grid grid-cols-2 sm:grid-cols-4 gap-4`.

---

## Empty state

Used both inside tables and as full-page states when a module has no data yet. One visual pattern, two implementations (not a shared component — see [`components.md`](./components.md#empty-states)).

```
┌─────────────────────────────────────────────────────┐
│                  [Icon circle]                      │
│               w-16 h-16 rounded-full                │
│              bg-gray-100 dark:bg-gray-700           │
│                                                     │
│              Title (font-semibold)                  │
│           Description (text-sm text-gray-500)       │
│                                                     │
│              [Primary CTA button]  (optional)       │
└─────────────────────────────────────────────────────┘
```

Table-scoped version: centered inside `td` with `py-16 text-center`.
Full-page version: centered in the content area with `p-12 text-center`.

---

## Settings / Management page

Used for configuration screens (roles, users, integrations). Two-column with a nav sidebar on the left and content panel on the right, or a tab bar at the top.

```
┌──────────────────────────────────────────────────────┐
│ Page header (title + description)                    │
├──────────────┬───────────────────────────────────────┤
│ Nav sidebar  │ Content panel                         │
│ (w-48/w-56)  │   Section title                       │
│ nav items    │   Form or table body                  │
│ border-r     │   Save button (sticky bottom, opt.)   │
└──────────────┴───────────────────────────────────────┘
```

When sections are few (< 4), a horizontal tab bar replaces the sidebar (`border-b-2 border-lipu-500` for active tab, same pattern as drawers).

---

## Patterns to avoid

- **Full-page forms without a modal/drawer**: long forms that navigate away from the list break the operational flow.
- **Custom grid for single-metric displays**: use the KPI card grid, don't invent a new one.
- **Non-standard widths for drawers**: `440px` is the established drawer width. Only go wider for exceptional cases.
- **Multiple nested drawers**: the z-index stack is already fragile (see [`layout.md`](./layout.md#z-index)); nested drawers compound the problem.
