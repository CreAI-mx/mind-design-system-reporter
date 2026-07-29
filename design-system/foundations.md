# Foundations

> Descriptive snapshot of colors, typography, spacing, borders, shadows, dark mode, and iconography as they actually exist in `console/` today (2026-07-29). This is **not** a prescriptive spec — where the codebase is inconsistent, that inconsistency is documented, not smoothed over. Machine-readable version: [`tokens.json`](./tokens.json).
>
> Source of truth: `console/tailwind.config.js` + `console/app/styles/*.css`. There is no SCSS and no separate token layer — Tailwind's config *is* the token system.

## Color

The palette lives entirely in `theme.extend.colors` (`tailwind.config.js:29-89`). Stock Tailwind colors (`gray`, `red`, `green`, `yellow`, `blue`, etc.) are also used directly and freely throughout components — the custom palette below extends, but does not replace, Tailwind's defaults.

| Group | Shades | Purpose (inferred from usage) |
|---|---|---|
| `lipu` | 500 `#A3B500`, 600 `#D0DF00`, text `#63666A` | **Brand color.** `lipu-600` (`#D0DF00`) is the signature yellow-green used for primary buttons, active states, active tabs, focus rings. |
| `fleetbase-green` | 500/600/700 | Legacy Fleetbase brand green, still present from the platform this app is built on. |
| `fleetbase-gray` | 100/300/500/700/900 | Legacy Fleetbase neutral ramp. |
| `sky` | 100-900 | Blue ramp, used in some dashboards/charts. |
| `nightsky` | 100-400 | Dark blue-black ramp. |
| `night` | 801-805, 901-905 | Dark neutral ramp (two sub-scales, `80x` and `90x`). |
| `midnight` | 100-700 | Another dark neutral ramp. |
| `moregray` | 750, 850 | Two more dark grays. |

**Known inconsistency:** there is no documented rule for when to use `night` vs `midnight` vs `moregray` vs Tailwind's own `gray-800`/`gray-900` in dark mode — all five coexist and are chosen per-component, not per a shared decision. Treat this as an open cleanup opportunity, not an intentional multi-scale design.

Component code also hardcodes one-off hex values outside the palette when a shade doesn't exist in Tailwind's scale, e.g. `bg-[#E8F0B8]` in `point-badge.hbs`, `border-[#c9d82e]` in the table header-cell active state, and `focus:ring-[#d0df00]/35` in the column-filter input (which duplicates `lipu-600` as a literal hex instead of referencing the token).

## Typography

**Known inconsistency, not a two-font system:** `console/app/styles/lipu.css` hardcodes `font-family: Roboto` (lines 3, 9, 14, all `!important`), while `console/app/styles/lipu-management.css` hardcodes `font-family: Inter` (lines 50, 69, also `!important`). Tailwind's config only registers a `roboto` font family (`tailwind.config.js:27`) — `Inter` isn't wired through Tailwind at all. Which font actually renders on a given screen depends on CSS load order and specificity, not a deliberate choice per screen type.

There is no named type scale (no `text-xs`/`text-sm`-equivalent custom tokens, no line-height or font-weight scale). Font sizes and weights are hardcoded per-rule with `!important`, e.g.:

```css
/* lipu.css:443-444 */
font-size: 12px !important;
font-weight: 500 !important;

/* lipu.css:568 */
font-size: 18px !important;

/* lipu-management.css:51-52 */
font-weight: 600 !important;
font-size: 16px !important;
```

Observed sizes across the codebase: `10px, 12px, 14px, 16px, 18px`. Observed weights: `500, 600`. There's no evidence these map to a deliberate scale (e.g. no 1.25 ratio, no semantic naming like `heading-sm`) — they're chosen ad hoc per rule. Components that use Tailwind's own `text-xs/sm/base/lg/xl` utilities (the majority of newer `lipu/ui/*` and `lipu/*` components) are more consistent than the legacy `!important`-laden CSS files, but the two systems coexist on the same pages.

## Spacing

No custom spacing scale exists beyond Tailwind's default. `theme.extend.spacing` (`tailwind.config.js:122-143`) mostly **re-declares Tailwind's own default values** (a no-op) and adds five real custom sizes — `70: 18rem`, `74: 22rem`, `78: 26rem`, `82: 28rem`, `86: 30rem` — which duplicate the same five values already added under `theme.extend.width`. In practice, spacing across the app is whatever Tailwind utility (`p-4`, `gap-2`, `space-x-6`, etc.) felt right per component; there's no enforced rhythm.

## Borders & radius

No `borderRadius` customization exists — components use Tailwind's stock scale directly (`rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` all appear in real markup, chosen per component rather than per a documented rule, e.g. cards tend toward `rounded-xl`, badges/pills toward `rounded-full` or `rounded`, buttons toward `rounded-lg`).

## Shadows

Unlike typography and spacing, shadows **are** a real, deliberate, reusable scale (`tailwind.config.js:96-114`):

| Token | Value | Apparent use |
|---|---|---|
| `xs` | `0 0 0 1px rgba(0,0,0,0.05)` | Hairline emphasis |
| `light-xs` → `light-3xl` | Progressive `rgba(212,220,236,…)` blur/spread ramp | Light-mode elevation ramp (cards, dropdowns, modals) |
| `pop`, `pop-less`, `pop-lesser`, `pop-least` | `0 0 Nrem #d4dcec` glow, descending intensity | "Glow" emphasis effect, distinct from directional elevation |
| `dark-overlay`, `dark-overlay-gray` | Directional dark shadows | Dark-mode elevation |
| `overlay-inner` | `inset 0 1px 5px rgba(0,0,0,0.3)` | Inset/pressed effect |
| `next-nav` | `rgba(0 0 0 / 35%) 0px 7px 32px` | Navigation-specific shadow |

This is the one foundation area with a genuinely coherent, named system — safe to reference as-is.

## Dark mode

Dark mode is **real, manual, and user-controlled** — it is not driven by `prefers-color-scheme` anywhere in the codebase.

- Strategy: `darkMode: ['class', '[data-theme="dark"]']` (`tailwind.config.js:3`) — Tailwind's dark variants activate off either a `.dark` class or a `data-theme="dark"` attribute on an ancestor.
- Toggle: `toggleDarkMode` action in `app/controllers/lipu.js:328-360`.
- Persistence: `localStorage` (`theme` and `fleetbase-theme` keys) plus the user's saved options via `@fleetbase/ember-core`'s `services/theme.js`, so the preference follows the user across sessions/devices where that syncs.
- CSS usage pattern: `:is(.dark, [data-theme='dark'])` compound selectors appear extensively in `app/styles/lipu.css`, alongside the more common Tailwind `dark:` utility prefix in `.hbs` templates.

There is no light/dark contrast or WCAG AA verification pass — `docs/auditoria-ux-ui-2026-06-29.md` (AC-03) flags dark-mode placeholder contrast as unverified. See [`accessibility.md`](./accessibility.md).

## Iconography

Two icon systems coexist, with **FontAwesome as the dominant one** — an earlier pass of this document wrongly called FontAwesome vestigial after only grepping the lowercase `fa-icon` helper and a direct package import; it missed the `<FaIcon @icon="...">` Glimmer component actually used throughout the app, including the sidebar. Corrected here.

1. **FontAwesome** (`<FaIcon @icon="name">`, `@fortawesome/ember-fontawesome` + free-solid-svg-icons) — used in **225 `.hbs` files** with **~150 distinct icon names**. This is what the sidebar/module navigation and nearly every action or status icon (spinners, close buttons, checks, search) use. Full frequency breakdown and the sidebar's module→icon map: [`icons.md`](./icons.md#fontawesome-the-dominant-system) / [`icons.json`](./icons.json#fontAwesome).
2. **Custom inline-SVG set** (`console/app/components/icons/*.hbs`) — 48 hand-authored icon components, no sprite sheet or central registry, covering a narrower set of decorative/help/domain icons FontAwesome's shapes don't fit. Full enumerated list with renderable SVG markup: [`icons.md`](./icons.md) / [`icons.json`](./icons.json).

When building new UI needing a standard action/status icon, FontAwesome's free-solid set is what the rest of the app reaches for — check `icons.json`'s FontAwesome name list before assuming a new custom SVG is needed. The custom set is for shapes FontAwesome doesn't have. Note: 8 of the 48 custom icons hardcode a hex color instead of `currentColor` (breaking dark-mode adaptation), and two path shapes are duplicated under different names — see [`icons.md`](./icons.md#known-issues) for the full list.
