# Layout

> Descriptive snapshot of app shell structure, grid/flex conventions, responsive usage, and z-index as they actually exist in `console/` (2026-07-29). No shell/breakpoint/z-index scale is documented in code today — this file is the first attempt to write one down, based on what's observed, not a proposal for what should change.

## App shell

- `app/templates/application.hbs` — outermost Ember route template.
- `app/templates/console.hbs` — Fleetbase console shell (the platform this app is built on top of).
- `app/templates/lipu.hbs` — the Lipu-specific shell: top nav, dark-mode toggle, sidebar mount point.
- Sidebar: `app/components/lipu/navigation/operations-sidebar.js` / `.hbs`, backed by `app/services/lipu-sidebar.js` (collapsed/expanded state, active section).

There is no documented content-width or shell-composition convention (e.g. no shared `.lipu-content-shell` class) — `docs/auditoria-ux-ui-2026-06-29.md` (finding B-01) explicitly proposes one that doesn't exist yet. Screens compose their own top-level container per page.

## Grid & flex

No custom `gridTemplateColumns` scale beyond one addition: `theme.extend.gridTemplateColumns.span` (`tailwind.config.js:91`) adds a `span 1` → `span 12` column-span utility set. Otherwise grid/flex layout is ad hoc Tailwind (`grid grid-cols-N`, `flex items-center gap-N`) chosen per component — consistent with the rest of the spacing story in [`foundations.md`](./foundations.md).

## Responsive breakpoints

No custom `screens` config — Tailwind's defaults are used as-is: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

Actual usage across `app/**/*.hbs` (496 files):

| Prefix | Occurrences | Files using it |
|---|---|---|
| `sm:` | 454 | 70 |
| `md:` | 302 | 51 |
| `lg:` | 97 | 37 |
| `xl:` | 12 | 8 |
| `2xl:` | 0 | 0 |

Only **~23% of templates** use any responsive prefix at all, and usage drops steeply past `md:`. `2xl:` is never used. Responsive handling concentrates in auth pages and a handful of dashboard/grid layouts; the dense operational screens (monitoring, routes, planning tables) are effectively fixed-width/desktop-only — consistent with this being an internal ops tool, not a public responsive product. Don't assume mobile/tablet layouts have been considered for a given screen unless you can see `sm:`/`md:` classes on it.

## Z-index

**There is no z-index scale.** 40 distinct values are in active use across CSS and Tailwind `z-*` utilities, ranging from `0` to `2147483646`. No shared constant, Tailwind `zIndex` theme extension, or naming convention enforces any of it — comments occasionally reference informal ranges (e.g. "map chrome z ~80-90", "Leaflet panes ~400-1000") but nothing is checked or generated from them.

Informal tiers observed in practice (not enforced, reconstructed from usage patterns):

| Tier | Value(s) | Where |
|---|---|---|
| Boot overlay | `2147483646` | `.overloader.lipu-boot-loader` (`console.css:49`) — deliberately maxed above everything, including 3rd-party widgets |
| Generic "sit above sibling" | `z-10` (106 occurrences) | Cards, modal internals, dropdown triggers |
| De-facto modal overlay standard | `z-[9999]` (92 occurrences) | Nearly every file under `app/components/modals/*.hbs` |
| Auth pages / panel headers | `z-50` | `templates/auth/*.hbs`, a few floating panels |
| Drawers | `z-[60]`, `z-[70]` | `create-user-drawer`, `create-role-drawer`, `zone-drawer`, `logbook` |
| Stacked/nested overlays (highest manual tier) | `z-[10000]`–`z-[10051]` | `operations/routes/edit.hbs` manually stacks 4 overlays in one file |
| Map panes (Leaflet-relative) | `500, 900, 999, 1000, 1100, 1110, 1200` | Map/trace-drawer components, mirroring Leaflet's own pane z-indices |

**Dead code note:** `app/utils/lipu-overlay-z.js` defines `LIPU_OVERLAY_Z_BASE = 9999`, `LIPU_OVERLAY_Z_STEP = 1`, and a `lipuOverlayZFromDepth(depth)` helper meant to compute z-index dynamically for a manual overlay stack — but it has **zero callers anywhere in `app/`**. It was written and never wired in. Worth knowing about before writing a "the fix already exists" doc — it doesn't, not yet.

Full per-file z-index inventory (CSS + inline + Tailwind) is captured in [`tokens.json`](./tokens.json#zIndex) for anything consuming this programmatically.
