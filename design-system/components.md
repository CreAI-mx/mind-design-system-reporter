# Components

> Descriptive inventory of real UI components in `console/`, as of 2026-07-29. Two layers coexist throughout: the vendored **`@fleetbase/ember-ui`** addon (older, Bootstrap-era class conventions like `btn-{type}-{size}`, `next-drawer`, `flb--modal-backdrop`) and the **Lipu-specific layer** at `app/components/lipu/ui/` and various domain folders (Tailwind-based). The Lipu layer is what real screens are built with; the vendor primitives are documented here because some code still touches them, not as the recommended pattern. Machine-readable version: [`components.json`](./components.json).

## Buttons

**Canonical**: `Lipu::Ui::Button` — `console/app/components/lipu/ui/button.js` + `button.hbs`.

| Variant | Classes |
|---|---|
| `primary` (default) | `bg-lipu-500 text-lipu-text hover:bg-lipu-600` |
| `secondary` | `text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600` |
| `danger` | `bg-red-600 text-white hover:bg-red-700` |
| `inline` | `border-0 bg-transparent shadow-none text-lipu-500 dark:text-lipu-400 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-lipu-500` |
| `ghost` | `border-0 bg-transparent shadow-none text-lipu-600 dark:text-lipu-400 hover:text-lipu-700` |

Sizes: `sm` (`px-3 py-2 text-xs`), `md` (`px-4 py-2.5 text-sm`, default), `lg` (`px-5 py-3 text-sm`) — ignored for `inline`/`ghost`, which force `px-0 py-0 text-sm`.

Base class: `lipu-ui-button [lipu-ui-button--inline] cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors [shadow-sm] {sizeClass} {variantClass}`. Renders `<LinkTo>` when `@route` is passed, else `<button>` — both share the same icon/label/spinner composition.

**Legacy primitive**: `@fleetbase/ember-ui`'s `button.hbs` uses `btn {btn-is-loading} {btn-outline} btn-{type|default} btn-{size|sm}` — a different, non-Tailwind class convention still underlying some vendored screens.

## Badges & Pills

- **Vendor `Badge`** (`node_modules/@fleetbase/ember-ui/addon/components/badge.hbs`): `status-badge {type|status|'info'}-status-badge`, inner span with `rounded`/`rounded-full` + `text-xs font-medium`. Color comes from vendor CSS class combinations, not inline Tailwind color utilities.
- **Vendor `Pill`** (`pill.hbs`): `fleetbase-pill` → `a.flex.flex-row.space-x-2`, avatar `w-7 h-7 rounded-full ring-2`, title `text-sm`, subtitle `text-xs text-gray-400`.
- **Domain: `contract-status-badge`** (`app/components/lipu/display/contract-status-badge.hbs`) — variants `success` (`bg-green-100 text-green-600`), `warning` (`bg-yellow-100 text-yellow-800`), `danger` (`bg-red-100 text-red-800`), `default` (`bg-gray-100 text-gray-800`); sizes `sm/md/lg` (`text-xs px-2 py-0.5` → `text-base px-3 py-1.5`); base `inline-flex items-center rounded-full font-medium`.
- **Domain: `point-badge`** (`app/components/lipu/locations/point-badge.hbs`) — active state `bg-[#E8F0B8] text-[#5B6A0E] dark:bg-lipu-800 dark:text-lipu-100`, inactive `bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200`; base `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold`; includes a hover-triggered coordinate tooltip.

No single shared "Badge" component is used everywhere — status semantics (success/warning/danger) are re-implemented per domain component rather than composed from one source.

## Cards

No canonical `Card` component — roughly **40 independent `*-card.*` files** exist, almost all domain-specific (KPI cards, plant cards, trace-drawer cards, approval cards, notification cards). The closest thing to a reference pattern:

```hbs
<!-- app/components/client/kpi-card.hbs -->
<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{{@title}}</p>
  <h2 class="text-gray-900 dark:text-white" style="font-size:30px;font-weight:500;line-height:150%;">{{@value}}</h2>
  <div class="flex items-center space-x-6"> <!-- metrics row --> </div>
</div>
```

Note the inline `style` attribute on the value — one more instance of the "no type scale" gap from [`foundations.md`](./foundations.md) leaking into a component that otherwise uses Tailwind utilities everywhere else.

## Inputs & forms

| Component | File | Pattern |
|---|---|---|
| `InputGroup` | `@fleetbase/ember-ui/addon/components/input-group.hbs` | `div.input-group` → `Input.w-full.form-input`; no explicit error/focus styling in the template — relies on `.form-input` CSS + native `:disabled`. |
| `Toggle` | `.../toggle.hbs` | Track `{activeColorClass|'bg-gray-200'} absolute h-4 w-9 mx-auto rounded-full`; thumb `{translate-x-5|translate-x-0} absolute left-0 h-5 w-5 border rounded-full bg-white shadow group-focus:shadow-outline group-focus:border-blue-300`; disabled → wrapper `opacity-50`. Active color follows `bg-{color}-400` (default green). |
| `Select` | `.../select.hbs` | State expressed via semantic classes (`form-select`, `has--selection`, `has--placeholder`, `disabled`), not raw Tailwind utilities. |
| `ModelSelect` | `.../model-select.hbs` | Wrapper `fleetbase-model-select fleetbase-power-select ember-model-select`; loading state `ember-model-select__loading`. |

Real focus-state example (`app/components/lipu/ui/data-table/column-filter-popover.hbs`):

```
w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm
focus:border-[#b8c700] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d0df00]/35
dark:border-gray-600 dark:bg-gray-700/80
```

The focus ring hex (`#d0df00`) is a literal duplicate of `lipu-600` rather than a reference to it — same brand color, expressed two different ways in the same codebase.

## Tables

Real system: `console/app/components/lipu/ui/data-table/` — `column-filter-popover.hbs`, `empty-body-row.hbs` (+ `.js`), `header-cell.hbs`, `pagination.hbs`. (`@fleetbase/ember-ui`'s own `table.hbs`/`table.js` exist but aren't what real Lipu screens are built with.)

- **Header cell** active state: `border-b-[3px] border-[#c9d82e] bg-[#fafaf3] text-slate-800 dark:border-[#d0df00] dark:bg-[#d0df00]/10` vs inactive `bg-transparent text-slate-700 dark:text-slate-200`.
- **Pagination** wrapper: `rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 border-t border-gray-200 bg-gray-50 px-2 py-2 dark:bg-gray-800/80`; nav buttons `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white disabled:cursor-not-allowed disabled:opacity-40`; active page `border-lipu-500 bg-lipu-500 text-gray-900 shadow-sm`.
- **Empty body row** — see [Empty states](#empty-states) below, it's the table-scoped instance of that pattern.

## Modals & drawers

The vendor primitives (`@fleetbase/ember-ui`'s `modal.hbs` and `drawer.hbs`) are Bootstrap-era composition shells (`flb--modal-backdrop`, `next-drawer` class families) with no Tailwind involvement. **Real Lipu modals and drawers bypass them entirely** with hand-built markup:

```hbs
<!-- app/components/modals/add-client-modal.hbs -->
<div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"> <!-- overlay --> </div>
<div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl w-full max-w-4xl">
  <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4"> <!-- header --> </div>
</div>
```

```hbs
<!-- app/components/lipu/management/user-detail-drawer.hbs -->
<div class="absolute inset-0 bg-black/40 dark:bg-black/60"> <!-- backdrop --> </div>
<aside class="absolute right-0 top-0 flex h-full w-[min(100%,440px)] flex-col overflow-hidden
              border-l border-gray-200 bg-white shadow-[rgba(0,0,0,0.12)_-4px_0px_24px]
              dark:border-gray-700 dark:bg-gray-800">
  <!-- tabs use border-b-2 border-lipu-500 for the active tab -->
</aside>
```

There are ~20+ files under `app/components/modals/` and several `*-drawer.hbs` under `app/components/lipu/management/` (`create-role-drawer`, `create-user-drawer`, `edit-role-drawer`) following the same overlay + panel structure. Z-index values for these overlays are inconsistent — see [`layout.md`](./layout.md#z-index).

## Empty states

**No shared `EmptyState` component exists.** Two independent, non-reused patterns:

1. Table-scoped: `app/components/lipu/ui/data-table/empty-body-row.hbs` — `td.{cellClass|'px-4 py-16 text-center'}` → icon circle (`w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4`) → title (`text-base font-semibold text-gray-900 dark:text-white mb-1`) → description (`text-sm text-gray-500 dark:text-gray-400`) → optional `Lipu::Ui::Button @variant="primary"`.
2. Feature-local: `app/components/lipu/operations/approvals/empty-state.hbs` — visually near-identical pattern (`p-12 text-center`, same icon-circle/title/message structure) but implemented independently, not by reusing (1).

Both use the same visual language by convention rather than by sharing code — a natural candidate for extraction into one `Lipu::Ui::EmptyState`, not yet done.

## Loading & skeletons

Two skeleton components, both `animate-pulse` + flat gray blocks (no custom shimmer keyframes):

- `app/components/lipu/ui/kpi-skeleton.hbs` — `div.animate-pulse.rounded-xl.border...p-4.space-y-3` with bars at `h-3`, `h-7`, and two `h-2.5` widths.
- `app/components/lipu/ui/table-skeleton.hbs` — `div.animate-pulse.space-y-2.py-4` looping 30 rows of an 8-column grid, cells `h-4 bg-gray-200 dark:bg-gray-700 rounded-md`.

Separately, `animate-spin` (~25 occurrences) is used for inline loading spinners on submit buttons and async actions — a distinct pattern from the two skeleton components above, not a shared "loading" abstraction. Neither respects `prefers-reduced-motion` — see [`motion.md`](./motion.md).

## Tooltips

`Lipu::Ui::InfoTooltip` (`app/components/lipu/ui/info-tooltip.js` + `.hbs`):

- Trigger: `button.inline-flex.items-center.justify-center.w-3.5.h-3.5.rounded-full.text-gray-400.hover:text-gray-600.dark:hover:text-gray-300.cursor-help.align-middle` wrapping a `circle-info` FontAwesome icon (FontAwesome is the dominant icon system app-wide, not a rare exception here — see [`foundations.md`](./foundations.md#iconography)).
- Positioning is **JS-computed**, not CSS/popper-based: reads `getBoundingClientRect()`, clamps horizontal position to a 140px half-width from viewport edges, sets `top: rect.bottom + 8`.
- Popup: `fixed z-[9999] pointer-events-none w-[280px] rounded-lg border border-green-500 bg-green-50 dark:bg-green-950/95 dark:border-green-600 px-3 py-2.5 shadow-md`, `role="tooltip"`.

This is the only generic tooltip in the app — domain components needing tooltip-like behavior (e.g. `point-badge`'s coordinate hover) implement it independently rather than reusing this component.
