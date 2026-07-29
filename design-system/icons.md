# Iconography

> Two icon systems are in real, active use in `console/` — this file was corrected on 2026-07-29 after an earlier pass wrongly called FontAwesome "vestigial" (that check only grepped for the lowercase `fa-icon` helper and a direct package import, missing the `<FaIcon @icon="...">` Glimmer component actually used everywhere, including the **sidebar**). The two systems, by actual weight:
>
> 1. **FontAwesome** (`@fortawesome/ember-fontawesome`, `<FaIcon @icon="name">`) — **the dominant system**: 225 `.hbs` files, ~150 distinct icon names, free-solid set. This is what the sidebar, module navigation, and nearly every action/status icon in the app use. See [FontAwesome usage](#fontawesome-the-dominant-system) below.
> 2. **Custom inline-SVG set** (`console/app/components/icons/*.hbs`) — 48 hand-authored components, no sprite sheet or central registry, used for a narrower set of decorative/help/domain icons not covered by FontAwesome's shapes. Full list in the next section.

## Sidebar icons (FontAwesome)

The module navigation sidebar (`app/components/lipu/navigation/operations-sidebar.hbs`) — collapsed and expanded states alike — renders one `<FaIcon>` per module/route, not one of the 48 custom SVGs:

| Section | Module (route) | Icon |
|---|---|---|
| Management | clients | `users` |
| Management | units | `truck` |
| Management | operators | `helmet-safety` |
| Management | supervisors | `user-tie` |
| Management | routes | `route` |
| Management | locations | `location-dot` |
| Management | approvals | `clipboard-check` |
| Operations | master-schedule | `table-list` |
| Operations | trips | `map-location-dot` |
| Operations | monitoring | `binoculars` |
| Operations | incidents | `triangle-exclamation` |
| Operations | planning (control-center) | `chart-gantt` |
| Operations | guards | `shield-halved` |
| Metrics | impact-dashboard | `chart-line` |
| Metrics | agents-dashboard | `robot` |
| — | help | `circle-question` |
| — | section expand/collapse toggle | `chevron-down` / `chevron-right` |

This maps 1:1 onto the real module list documented in [`api/docs/README.md`](../../api/docs/README.md) (`management/` 7 modules, `operations/` 6 modules) — useful if you're building a module filter that also needs an icon per module.

Other navigation-adjacent components under `app/components/lipu/navigation/` also use `<FaIcon>`, not the custom set:

| Component | Icons |
|---|---|
| `company-selector` | `chevron-down` (trigger), `check` (selected company), `exclamation-triangle` (error) |
| `fleetops-switcher` / `iam-switcher` | dynamic: `arrow-right` / `arrow-left` depending on switch direction |
| `language-selector` | `globe` (default trigger, overridable via `@triggerIcon`), `check` (selected language) |

## FontAwesome — the dominant system

150 distinct FontAwesome icon names are referenced via `<FaIcon @icon="...">` across 225 template files. Most-used (frequency across all `.hbs` files):

| Icon | Occurrences | Icon | Occurrences | Icon | Occurrences |
|---|---|---|---|---|---|
| `spinner` | 68 | `chevron-right` | 30 | `route` | 15 |
| `xmark` | 49 | `plus` | 23 | `save` | 14 |
| `check` | 48 | `chevron-left` | 20 | `power-off` | 14 |
| `search` | 39 | `chevron-down` | 20 | `ellipsis-v` | 14 |
| `triangle-exclamation` | 37 | `arrow-right` | 19 | `magnifying-glass` | 13 |

`spinner` (loading state) and `xmark`/`check` (dismiss/confirm) alone account for a large share of all icon usage — consistent with this being an operational, action-dense app rather than a marketing surface. The full distinct list (all 150 names with counts) is in [`icons.json`](./icons.json#fontAwesome) for anything consuming this programmatically; it isn't reproduced in full here because at 150 entries a table stops being readable as prose.

No FontAwesome icon has custom static SVG committed to this repo the way the 48-icon set does — its shapes come entirely from the `@fortawesome/free-solid-svg-icons` package, so a reference site cannot render them from files in this repo alone; it needs the FontAwesome package (or an equivalent icon set) as a dependency to look up shapes by name.

## Custom inline-SVG set — full list (48)

| Icon | viewBox | Default size | Color mode |
|---|---|---|---|
| `alert-circle` | 0 0 24 24 | 14×14px | currentColor |
| `breadcrumb-chevron-stroke` | 0 0 24 24 | 24×24px | currentColor |
| `breadcrumb-chevron` | 0 0 14 14 | 14×14px | currentColor |
| `chart-bars` | 0 0 24 24 | 48×48px | currentColor |
| `circle-user` | 0 0 24 24 | 26×26px | currentColor |
| `clock` | 0 0 24 24 | 24×24px | currentColor |
| `close-mini` | 0 0 12 12 | 12×12px | currentColor |
| `close-x10` | 0 0 10 10 | 10×10px (fixed) | currentColor |
| `close` | 0 0 24 24 | 12×12px | currentColor |
| `columns` | 0 0 16 16 | 16×16px | currentColor |
| `configuration-general` | 0 0 16 16 | 16×16px (fixed) | 🔴 hardcoded `#534AB7` |
| `copy` | 0 0 24 24 | 14×14px | currentColor |
| `document-file-small` | 0 0 16 16 | 16×16px | currentColor |
| `document-file` | 0 0 20 20 | 20×20px | currentColor |
| `download` | 0 0 16 16 | 16×16px | currentColor |
| `edit` | 0 0 24 24 | 10×10px | currentColor |
| `filter-funnel` | 0 0 24 24 | 16×16px | currentColor |
| `filter` | 0 0 16 16 | 16×16px | currentColor |
| `fleet-truck` | 0 0 24 24 | 20×20px | currentColor |
| `help-dashboards-metrics` | 0 0 24 24 | 22×22px | currentColor |
| `help-first-sign-in` | 0 0 24 24 | 22×22px | currentColor |
| `help-incidents-support` | 0 0 24 24 | 22×22px | currentColor |
| `help-master-schedule` | 0 0 24 24 | 22×22px | currentColor |
| `help-reports-exports` | 0 0 24 24 | 22×22px | currentColor — ⚠️ duplicate of `line-chart` |
| `help-role-onboarding` | 0 0 24 24 | 22×22px | currentColor |
| `help-roles-permissions` | 0 0 24 24 | 22×22px | currentColor |
| `help-search-sparkle` | 0 0 24 24 | 20×20px | currentColor — ⚠️ duplicate of `sparkle` |
| `help-trips-in-progress` | 0 0 24 24 | 22×22px | currentColor |
| `incidents-classifier` | 0 0 16 16 | 16×16px (fixed) | 🔴 hardcoded `#1D9E75` |
| `info-outline-mini` | 0 0 12 12 | 12×12px (fixed) | 🔴 hardcoded `#6a7282` |
| `info-outline` | 0 0 16 16 | 16×16px (fixed) | 🔴 hardcoded `#6a7282` |
| `layers` | 0 0 24 24 | 13×13px | currentColor |
| `line-chart` | 0 0 24 24 | 20×20px | currentColor — ⚠️ duplicate of `help-reports-exports` |
| `logbook` | 0 0 24 24 | 16×16px | currentColor |
| `operations-parameters` | 0 0 16 16 | 16×16px (fixed) | 🔴 hardcoded `#BA7517` |
| `resize-corner` | 0 0 8 8 | 8×8px | currentColor |
| `route-path` | 0 0 24 24 | 20×20px | currentColor |
| `search-outline` | 0 0 24 24 | 24×24px (fixed) | 🔴 hardcoded `#6a7282` |
| `search-zoom` | 0 0 16 16 | 16×16px | currentColor |
| `sort-arrow-down` | 0 0 18 18 | 18×18px | 🔴 hardcoded, parametric (see below) |
| `sparkle` | 0 0 24 24 | 20×20px | currentColor — ⚠️ duplicate of `help-search-sparkle` |
| `spinner` | 0 0 24 24 | 24×24px, `animate-spin` | currentColor |
| `trash-filled` | 0 0 16 16 | 16×16px | currentColor |
| `trash` | 0 0 24 24 | 16×16px | currentColor |
| `travel-companion` | 0 0 16 16 | 16×16px (fixed) | 🔴 hardcoded `#185FA5` |
| `upload-tray` | 0 0 24 24 | 24×24px | currentColor |
| `upload` | 0 0 16 16 | 16×16px | currentColor |
| `user-avatar` | 0 0 32 32 | 32×32px | currentColor |

40 of 48 use `currentColor` and adapt correctly to text color / dark mode. 8 hardcode a hex value.

## Known issues

**Hardcoded colors (8 icons)** — these do not adapt to dark mode or to a consumer's `text-*` class the way the other 40 do, because the color is baked into the SVG's `stroke`/`fill` attribute rather than inheriting `currentColor`:

| Icon | Hardcoded color |
|---|---|
| `configuration-general` | `#534AB7` (purple) |
| `incidents-classifier` | `#1D9E75` (green) |
| `info-outline-mini` | `#6a7282` (gray) |
| `info-outline` | `#6a7282` (gray) |
| `operations-parameters` | `#BA7517` (amber) |
| `search-outline` | `#6a7282` (gray) |
| `travel-companion` | `#185FA5` (blue) |
| `sort-arrow-down` | `#334155` / `#94A3B8` / `#64748B` (parametric, see below) |

There's no evidence this is a deliberate "these icons carry semantic color, others don't" system — it reads as each icon being authored independently, some copy-pasted from a source that already had a fixed color. Worth a pass to convert to `currentColor` + a wrapping `text-{color}` class if/when these are touched.

**Duplicate geometry (2 pairs)** — `sparkle` and `help-search-sparkle` share the exact same path data; `line-chart` and `help-reports-exports` do too. Each pair differs only in default size class. Likely accidental duplication when a `help-*` variant was created by copying an existing icon, rather than an intentional alias.

**Parametric icon** — `sort-arrow-down` is not a static icon: it renders `@topLabel`/`@bottomLabel` text and accepts `@topColor`/`@bottomColor`/`@arrowColor` args, defaulting to `A`/`Z` sort indicators with slate/gray colors. The entry in `icons.json` shows it rendered with those defaults — real usages in table headers pass column-specific values.

## For the reference site

Each entry in [`icons.json`](./icons.json) includes a `svg` field with the icon's markup already resolved to static, literal attributes (Ember's `{{or @class "..."}}` and `...attributes` are stripped and replaced with the real default value) — safe to drop directly into an HTML/React preview without an Ember runtime. The `colorMode` field (`currentColor` / `hardcoded` / `hardcoded-parametric`) tells you whether wrapping the icon in a colored container will actually change its color.
