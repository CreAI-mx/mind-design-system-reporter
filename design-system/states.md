# Component States

> How interactive and async states are expressed in `console/` as of 2026-07-29. States are not fully consistent across the codebase — this documents the dominant patterns used in the Lipu UI layer, which is what new screens should follow.

---

## Buttons

| State | Visual expression |
|---|---|
| Default | Variant base class (see [`components.md`](./components.md#buttons)) |
| Hover | `hover:bg-lipu-600` (primary), `hover:bg-gray-50 dark:hover:bg-gray-600` (secondary), `hover:bg-red-700` (danger) |
| Focus | `focus-visible:ring-2 focus-visible:ring-lipu-500` |
| Disabled | `disabled:cursor-not-allowed disabled:opacity-50` — both cursor and opacity, always together |
| Loading | Button disabled + spinner (`animate-spin`) prepended to the label, copy changes to past-progressive: "Guardando…" |
| Active/pressed | No explicit `active:` utility used — browser default or `scale-95` in some cases |

```html
<!-- Loading state pattern -->
<button disabled class="... disabled:opacity-50 disabled:cursor-not-allowed">
  <svg class="animate-spin h-4 w-4 mr-2" .../>
  Guardando…
</button>
```

---

## Inputs & text fields

| State | Visual expression |
|---|---|
| Default | `border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800` |
| Focus | `focus:border-[#b8c700] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d0df00]/35` — note: hex is a duplicate of `lipu-600`; new code should use `focus:ring-lipu-600/35` |
| Hover | No explicit hover state on text inputs |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed` or `opacity-50` on the wrapper |
| Error | `border-red-500 focus:ring-red-500` + error message below the field in `text-red-600 dark:text-red-400 text-xs` |
| Read-only | `bg-gray-50 dark:bg-gray-700/50 cursor-default` — visually distinct from disabled but not interactive |

```html
<!-- Focus state (from data-table/column-filter-popover.hbs) -->
<input class="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm
              focus:border-lipu-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lipu-600/35
              dark:border-gray-600 dark:bg-gray-700/80" />
```

---

## Toggles

| State | Visual expression |
|---|---|
| Off | Thumb `translate-x-0`, track `bg-gray-200` |
| On | Thumb `translate-x-5`, track `bg-{color}-400` (default `bg-green-400`) |
| Disabled | Wrapper `opacity-50`, pointer events removed |
| Focus | `group-focus:shadow-outline group-focus:border-blue-300` on the thumb |

Transition: `transition-transform duration-200 ease-in-out` on the thumb.

---

## Select / dropdown

State is expressed via semantic classes (`has--selection`, `has--placeholder`, `disabled`), not raw Tailwind utilities — these come from the vendor layer and map to CSS rules in the vendor stylesheet. For new Lipu-layer selects built with Tailwind directly, follow the input pattern above.

---

## Table rows & cells

| State | Visual expression |
|---|---|
| Default | No background |
| Row hover | `hover:bg-gray-50 dark:hover:bg-gray-800/50` |
| Selected row | `bg-lipu-500/10 dark:bg-lipu-500/10` |
| Column header — default | `bg-transparent text-slate-700 dark:text-slate-200` |
| Column header — active/sorted | `border-b-[3px] border-[#c9d82e] bg-[#fafaf3] text-slate-800 dark:border-lipu-600 dark:bg-lipu-600/10` |
| Pagination button — default | `border border-gray-300 bg-white dark:bg-gray-700` |
| Pagination button — active | `border-lipu-500 bg-lipu-500 text-gray-900 shadow-sm` |
| Pagination button — disabled | `disabled:cursor-not-allowed disabled:opacity-40` |

---

## Navigation / tabs

| State | Visual expression |
|---|---|
| Default tab | No underline, `text-gray-500 dark:text-gray-400` |
| Active tab | `border-b-2 border-lipu-500 text-gray-900 dark:text-white` |
| Hover tab | `text-gray-700 dark:text-gray-300` |
| Active sidebar item | `bg-lipu-600/15 text-lipu-700 dark:text-lipu-300 font-medium` (or similar lipu tint) |
| Inactive sidebar item | `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800` |

---

## Loading states

Two distinct patterns in use — do not mix them:

### Skeleton screens (content not yet loaded)
Used for whole-section loading when the structure is predictable (tables, KPI grids).

```html
<!-- Table skeleton -->
<div class="animate-pulse space-y-2 py-4">
  <!-- 30 rows of 8-column grid, each cell: h-4 bg-gray-200 dark:bg-gray-700 rounded-md -->
</div>

<!-- KPI skeleton -->
<div class="animate-pulse rounded-xl border p-4 space-y-3">
  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  <div class="h-7 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
</div>
```

### Inline spinner (in-progress action)
Used inside buttons or next to async status indicators.

```html
<!-- Tailwind utility used: animate-spin -->
<svg class="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
</svg>
```

`animate-spin` appears in ~25 files. Neither skeleton nor spinner respects `prefers-reduced-motion` — see [`motion.md`](./motion.md) and [`accessibility.md`](./accessibility.md).

---

## Error states

| Context | Expression |
|---|---|
| Form field error | `border-red-500` on input + `text-red-600 dark:text-red-400 text-xs mt-1` message below |
| Toast / notification error | `bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300` |
| Empty state after failed load | Same structure as empty state pattern (icon + title + retry CTA) — title should indicate the failure: "Error al cargar los datos" |
| Full-page error (no recovery) | Not a standardized pattern today; use the modal structure with a danger-zone title and contact/retry instructions |

---

## Drag & interactive map states

Specific to operations screens:

| State | Expression |
|---|---|
| Draggable item | `cursor-grab` default, `cursor-grabbing` while held |
| Drop target — valid | `border-2 border-dashed border-lipu-500 bg-lipu-500/5` |
| Drop target — invalid | `border-2 border-dashed border-red-400 bg-red-50` |
| Map marker — selected | Ring or scale effect; implementation varies per component |

---

## Accessibility notes on states

- Focus rings must always be visible — `outline-none` without a replacement ring is a regression. The focus pattern is `focus-visible:ring-2 focus-visible:ring-lipu-500`.
- Disabled states must communicate the reason when the user might not know why — a tooltip on the trigger element is acceptable.
- Loading states should include `aria-busy="true"` on the container and `aria-label` on spinners — not currently implemented consistently, but new code should add it.
- See [`accessibility.md`](./accessibility.md) for the full gap inventory.
