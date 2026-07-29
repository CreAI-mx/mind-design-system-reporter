# LIPU Mind — Design System (reference snapshot)

> **What this is:** a descriptive reference of the visual language actually implemented in `console/` today (2026-07-29) — foundations, components, layout, motion, accessibility. **Not** a component library, not a spec to build against, not a prescriptive target. Where the codebase is inconsistent (two fonts, no z-index scale, no type scale), that inconsistency is documented as-is rather than presented as a decision.
>
> **Why it exists:** to be published as a standalone reference site (built separately, Next.js + API routes, outside this repo's build) for people who need to see "what does LIPU Mind actually look like" without running the Ember console app.

## Scope

`console/` (Ember Octane ~4.12) is the only source. There is no separate design-tokens package or Figma source of truth today — `console/tailwind.config.js` and `console/app/styles/*.css` **are** the token system, extracted and transcribed here.

## Files

| File | Contents |
|---|---|
| [`foundations.md`](./foundations.md) | Color, typography, spacing, borders, shadows, dark mode, iconography |
| [`components.md`](./components.md) | Buttons, badges/pills, cards, inputs/forms, tables, modals/drawers, empty states, loading/skeletons, tooltips |
| [`layout.md`](./layout.md) | App shell structure, grid/flex, responsive breakpoint usage, z-index inventory |
| [`motion.md`](./motion.md) | Transitions, keyframes, `animate-*` usage, reduced-motion gap |
| [`accessibility.md`](./accessibility.md) | What's actually implemented + summary/link to the canonical gap tracker |
| [`icons.md`](./icons.md) | Full enumerated inventory of all 48 custom SVG icons, with known issues (hardcoded colors, duplicate geometry, the one parametric icon) |
| [`tokens.json`](./tokens.json) | Machine-readable foundations data (colors, shadows, spacing, typography, dark mode, z-index, breakpoints, motion) |
| [`components.json`](./components.json) | Machine-readable component inventory (variants, real class strings, file references) |
| [`icons.json`](./icons.json) | Machine-readable icon inventory with ready-to-render, static SVG markup (Ember template syntax stripped) |

## How this is meant to be consumed

The two `.json` files are the intended data source for the external reference site's API routes — read them directly rather than re-parsing the Markdown. The `.md` files are the human-readable narrative version of the same data, with the "why it's like this" context the JSON doesn't carry (inconsistency notes, dead code, informal tiers). Building the actual reference site (Next.js, hosting, deploy) is out of scope for this folder — this is the source of truth it reads from, kept inside the repo so it changes in the same PR as the code it describes.

## Related docs

- `docs/auditoria-ux-ui-2026-06-29.md` — the living UX/a11y gap tracker. `accessibility.md` summarizes and links to it rather than duplicating it; update the audit doc directly when an AC-item gets fixed.
- `docs/CONTEXT.md` §6 — known quirks. The inconsistencies flagged throughout this folder (dual fonts, unscaled z-index, unused `lipu-overlay-z.js`) are candidates worth cross-referencing there if the team decides not to fix them soon.

## Keeping this current

This snapshot will go stale the moment `tailwind.config.js`, the component layer, or the CSS files change without a matching update here. There's no automated extraction yet — if you're touching a color, a component variant, a z-index, or anything else documented in these files as part of a PR, update the matching file/JSON entry in the **same PR**, consistent with this repo's "docs ship with the change" rule (`CLAUDE.md`). If a future iteration wants to reduce that drift risk, a small script reading `tailwind.config.js` + grepping the component tree into `tokens.json`/`components.json` would remove the manual-transcription step — not built here, flagged as a real option.
