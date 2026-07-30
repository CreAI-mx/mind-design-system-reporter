# Spacing

> Descriptive snapshot of how spacing is applied in `console/` as of 2026-07-29. **There is no custom spacing scale** — the app uses Tailwind's default 4px base grid throughout, with a handful of custom large-width tokens that are not spacing in the traditional sense. This file documents what's actually used and when, not a prescriptive proposal.

---

## Base unit

Tailwind's default spacing scale, based on a **4px increment** (`1 unit = 0.25rem = 4px`):

| Tailwind token | px equivalent | Rem |
|---|---|---|
| `1` | 4px | 0.25rem |
| `2` | 8px | 0.5rem |
| `3` | 12px | 0.75rem |
| `4` | 16px | 1rem |
| `5` | 20px | 1.25rem |
| `6` | 24px | 1.5rem |
| `8` | 32px | 2rem |
| `10` | 40px | 2.5rem |
| `12` | 48px | 3rem |

In practice, most components use multiples of 2 (`p-2`, `p-4`, `p-6`) — the effective rhythm is **8px**, not 4px. Use 4px-increment tokens (`p-1`, `p-3`, `gap-1`) only for fine-tuning icon padding or tight inline alignment.

---

## Page-level spacing

These are the observed conventions for outermost containers — not formally enforced, but consistent across most screens.

| Context | Classes | px |
|---|---|---|
| Page outer padding | `px-6 py-8` | 24px horizontal / 32px vertical |
| Page outer padding (compact) | `p-6` | 24px all sides |
| Section gap (between major page blocks) | `space-y-6` or `space-y-8` | 24–32px |
| Header-to-content gap | `mb-6` | 24px |

---

## Component-level spacing

### Cards
```html
<!-- Standard card -->
<div class="rounded-xl border border-gray-200 dark:border-gray-700 p-6">

<!-- Compact card (KPI, stat) -->
<div class="rounded-xl border p-4">
```

| Variant | Padding | Use |
|---|---|---|
| Standard | `p-6` (24px) | Detail cards, form sections |
| Compact | `p-4` (16px) | KPI cards, tight grid items |
| Table container | `p-0` (no padding) | Table fills edge-to-edge inside its card |

### Tables
- Table header cells: `px-4 py-2.5`
- Table body cells: `px-4 py-3`
- Pagination bar: `px-2 py-2`

### Modals & drawers
- Modal header: `px-6 py-4`
- Modal body: `px-6 py-4`
- Modal footer: `px-6 py-4`
- Drawer body: no standard — varies per screen (`p-4` to `p-6`)

### Forms
- Between fields: `space-y-4` (16px)
- Field internal: `px-3 py-2` for inputs (`text-sm`), matching Tailwind's `form-input` baseline
- Label to input gap: `mt-1` (4px) — label above, gap minimal

### Buttons
| Size | Padding |
|---|---|
| `sm` | `px-3 py-2` |
| `md` (default) | `px-4 py-2.5` |
| `lg` | `px-5 py-3` |
| `inline`/`ghost` | `px-0 py-0` |

### Inline / row layouts
- Between icon and label: `gap-2` (8px)
- Between sibling actions: `gap-2` or `gap-3`
- Between filter controls: `gap-2` or `gap-3`
- Between KPI cards in a grid: `gap-4` (16px)

---

## Large-dimension tokens (width/height only)

`tailwind.config.js` adds five custom spacing entries that are **re-used as container widths**, not as padding or margin:

| Token | Value | Use |
|---|---|---|
| `70` | 18rem (288px) | Narrow sidebar or panel |
| `74` | 22rem (352px) | Medium panel |
| `78` | 26rem (416px) | Medium-wide panel |
| `82` | 28rem (448px) | Near-drawer width |
| `86` | 30rem (480px) | Wide panel |

These appear as `w-70`, `w-74`, etc. — **do not use them as padding** (e.g. `p-70` would produce 18rem of padding, which is almost certainly wrong).

---

## Empty-state spacing

```html
<!-- Table-scoped empty state -->
<td class="px-4 py-16 text-center">

<!-- Full-page / section empty state -->
<div class="p-12 text-center">
```

Icon circle inside empty state: `w-16 h-16 mb-4` (64px diameter, 16px below icon before text).

---

## Spacing anti-patterns seen in the codebase

| Anti-pattern | Where it appears | Better |
|---|---|---|
| `style="margin-top: 20px"` | Legacy modal components | `mt-5` |
| Inline `padding: 12px 16px` | Some vendor-layer components | `px-4 py-3` |
| Mixed `space-x-*` and `gap-*` in the same flex row | A few management screens | Pick one; prefer `gap-*` |
| Asymmetric card padding (`px-6 py-5`) | Some domain cards | `p-6` unless the asymmetry has a visual reason |

---

## When to deviate

- **Density requirements**: operational data tables sometimes need tighter rows — `px-3 py-2` cells instead of `px-4 py-3` is acceptable when the data volume demands it.
- **Map / canvas areas**: full-bleed, no padding from the page wrapper.
- **Floating UI** (tooltips, dropdowns): internal padding `px-3 py-2` or `px-3 py-2.5`, independent of the page rhythm.
