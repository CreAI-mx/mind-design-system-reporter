# Do's & Don'ts

> Explicit guidance on what to avoid when building new screens in LIPU Mind. Each item is grounded in a real inconsistency or problem already in `console/` — the "why" is documented alongside the rule so future readers can judge edge cases rather than blindly following it.

---

## Colors

### ✅ Do: reference color tokens through Tailwind utilities
```html
<div class="bg-lipu-600 text-gray-900 dark:bg-night-802 dark:text-white">
```

### ❌ Don't: hardcode hex values outside the palette
```html
<div style="background: #D0DF00">          <!-- lipu-600 exists; use it -->
<div class="bg-[#E8F0B8]">                 <!-- one-off; add a token or use closest existing -->
<div class="focus:ring-[#d0df00]/35">      <!-- duplicate of lipu-600; use focus:ring-lipu-600/35 -->
```
**Why:** hardcoded hex values already exist in 3+ places in the codebase and break the dark-mode story — a token rename or color audit can't catch them.

---

## Dark mode

### ✅ Do: always pair light and dark variants on any surface or text
```html
<p class="text-gray-900 dark:text-white">
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
```

### ❌ Don't: write a component without dark-mode coverage
```html
<div class="bg-white border border-gray-200">   <!-- invisible in dark mode -->
<p class="text-gray-700">                        <!-- poor contrast in dark mode -->
```
**Why:** dark mode is a first-class user feature with a real toggle. Untested dark mode coverage is an existing gap (accessibility audit AC-03) — don't grow it.

---

## Icons

### ✅ Do: use FontAwesome free-solid for standard action/status icons
```hbs
<FaIcon @icon="trash" />
<FaIcon @icon="circle-check" />
<FaIcon @icon="magnifying-glass" />
```

### ❌ Don't: create a new custom SVG for a shape FontAwesome already has
**Why:** FontAwesome is used in 225 files with ~150 distinct names. Adding a custom SVG duplicate creates maintenance debt and visual inconsistency. Check `icons.json` → `fontAwesome.allDistinctNames` before authoring anything new.

### ❌ Don't: use `currentColor`-breaking custom icons in dark-mode UI
Eight custom icons hardcode a fill color instead of `currentColor` — they will not adapt to dark mode. See [`icons.md`](./icons.md#known-issues) for the list. Avoid using those icons on dark surfaces until the issue is fixed.

---

## Typography

### ✅ Do: use Tailwind's text utilities and stick to the observed scale
```html
<p class="text-xs">    <!-- 12px — captions, timestamps, metadata -->
<p class="text-sm">    <!-- 14px — body, table cells, labels -->
<h2 class="text-base font-semibold">  <!-- 16px — section titles -->
<h1 class="text-lg font-semibold">    <!-- 18px — page titles -->
```

### ❌ Don't: add `!important` font declarations or inline `style` font sizes
```html
<p style="font-size:30px;font-weight:500">   <!-- only acceptable for KPI values, not general text -->
```
**Why:** the codebase already has two conflicting `!important` font declarations (Roboto vs Inter in separate CSS files). Adding more compounds the specificity war and makes predictable styling impossible.

### ❌ Don't: invent new font sizes outside the observed 5-step scale (10/12/14/16/18px)
**Why:** there is no type scale today — adding new sizes makes the inconsistency worse, not better.

---

## Spacing & layout

### ✅ Do: use Tailwind's default spacing scale with consistent rhythm
- Page padding: `px-6 py-8` or `p-6`
- Card internal padding: `p-4` (compact) or `p-6` (standard)
- Stack gaps: `space-y-4` or `gap-4` for between-card spacing
- Inline gaps: `gap-2` or `gap-3` for within-row elements

### ❌ Don't: use the custom spacing extensions (70/74/78/82/86) for anything other than widths
```html
<div class="p-70">   <!-- those custom tokens are for width/height, not padding -->
```
**Why:** `theme.extend.spacing` in `tailwind.config.js` adds `70`/`74`/`78`/`82`/`86` as large rem values intended for container widths, not general padding — they produce 18–30rem gaps.

---

## Components

### ✅ Do: build with the Lipu UI layer
```hbs
<Lipu::Ui::Button @variant="primary">Guardar</Lipu::Ui::Button>
<Lipu::Ui::DataTable>...</Lipu::Ui::DataTable>
```

### ❌ Don't: reach for `@fleetbase/ember-ui` vendor primitives for new screens
```hbs
<Button @type="primary" @size="sm">   <!-- vendor primitive, Bootstrap-era class conventions -->
```
**Why:** the vendor layer uses `btn-{type}-{size}` class conventions, not Tailwind. Mixing both creates visual inconsistency and makes debugging hard. Vendor components are documented for reference only — they're not the recommended pattern for new work.

---

## Z-index

### ✅ Do: follow the informal tier conventions
| What you're building | Z-value to use |
|---|---|
| Dropdown / popover | `z-10` |
| Modal overlay | `z-[9999]` |
| Drawer | `z-[60]` or `z-[70]` |
| Tooltip | `z-[9999]` |

### ❌ Don't: invent a new arbitrary z-index
```html
<div class="z-[5000]">   <!-- fills a gap in the stack, but with what consequence? -->
<div class="z-[1000]">   <!-- collides with Leaflet map panes -->
```
**Why:** 40 distinct z-index values already exist with no governing scale. Each new arbitrary value risks colliding with Leaflet panes (400–1200), modals (9999), or other layers. Use the closest tier from the table above.

---

## Forms & validation

### ✅ Do: show inline validation errors below the field immediately after blur
### ✅ Do: disable the submit button while a request is in-flight and show a spinner
### ❌ Don't: use `alert()` or `console.error()` for user-facing error feedback
### ❌ Don't: surface raw API error strings — map them to human-readable messages first

---

## Mobile & responsive

### ✅ Do: mark explicitly when a screen is intentionally desktop-only
### ❌ Don't: assume a screen is responsive just because it renders without overflow on a small viewport
**Why:** only ~23% of templates use any responsive prefix (`sm:`/`md:`) — the dense operational screens are desktop-only by design, not by accident. If a new screen needs to be responsive, that's a deliberate decision requiring `sm:`/`md:` treatment, not something that happens automatically. See [`layout.md`](./layout.md#responsive-breakpoints).

---

## Accessibility

### ✅ Do: add `role`, `aria-label`, and `aria-expanded` on interactive non-button elements
### ✅ Do: ensure focus rings are visible — `focus:ring-2 focus:ring-lipu-500` is the established pattern
### ❌ Don't: suppress focus outlines with `outline-none` without replacing them with a visible ring
**Why:** keyboard navigation and screen reader support are in a documented gap state (see [`accessibility.md`](./accessibility.md)). New code should not regress what little exists.
