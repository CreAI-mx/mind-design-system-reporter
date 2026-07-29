# Accessibility

> Descriptive snapshot of accessibility conventions actually present in `console/` (2026-07-29), plus a pointer to the gap list already tracked elsewhere. This file does not duplicate that gap list — it summarizes it and links back, per the project's own doc-maintenance rule (fix documents in the same PR that changes the thing they describe, don't fork a second copy).

## What exists today

**Cursor conventions** (`app/styles/cursor.css`, 120 lines, tagged `LMD-1688`) — the one genuinely systematic a11y-adjacent pattern in the codebase:

- **Disabled/inert** (lines 6-28): `button:disabled`, `[aria-disabled='true']` on buttons/links, disabled form controls, and ARIA-role variants (`[role='button'|'link'|'tab'|'menuitem'|'checkbox'|'radio'|'switch'|'option'][aria-disabled='true']`), plus class hooks (`.disabled`, `.btn-disabled`, `.lipu-ui-button[aria-disabled='true']`) → all get `cursor: not-allowed`.
- **Interactive** (lines 31-99+): native clickable elements, ARIA-role interactives (`:not([aria-disabled='true'])` variants of the same role list), keyboard-focusable `[tabindex]:not([tabindex='-1'])`, and common project class hooks (`.clickable`, `.lipu-ui-button`, `.ember-power-select-trigger`, `.dropdown-item`, `.tab-item`) → all get `cursor: pointer`.

This means cursor affordance correctly follows ARIA state (not just native `disabled`), which is more thorough than most of the rest of the app's a11y posture.

**Everything else is either partial or not yet built.** Rather than re-list every gap here (and risk this file drifting out of sync with the audit), the canonical gap tracker is:

📄 **`docs/auditoria-ux-ui-2026-06-29.md`, §4 "Accesibilidad"** (lines 355-431) — 14 coded findings, `AC-01` through `AC-14`. One-line summary of each, current as of that audit:

| Code | Status | Gap |
|---|---|---|
| AC-01 | 🔴 Not implemented | Accessibility preferences panel (grayscale/invert/high-contrast/large-cursor) |
| AC-02 | 🟡 Partial | Full keyboard navigation — no skip link, no modal focus trap, no drawer focus return, tab order unverified |
| AC-03 | 🟡 Needs verification | WCAG AA contrast, incl. "Próximamente" badges and dark-mode placeholders |
| AC-04 | 🟢 Mostly fine | `aria-label` on collapsed sidebar icons — recommends complementing `title` |
| AC-05 | 🔴 Not implemented | `aria-live` regions for notifications, auto-updating tables, live maps |
| AC-06 | 🔴 Not implemented | Accessible chart alternatives (data-table or text summary for donuts/KPIs) |
| AC-07 | 🔴 Not implemented | Accessible forms — `aria-describedby`, `aria-invalid`, focus-first-invalid-field |
| AC-08 | 🟡 Partial | Table `<th scope>` and keyboard-operable sort/row actions |
| AC-09 | 🟡 Not implemented | `prefers-reduced-motion` — confirmed absent, see [`motion.md`](./motion.md) |
| AC-10 | 🟡 Partial | Touch targets ≥44×44px — map controls and mobile/tablet actions undersized |
| AC-11 | 🟡 Partial | Colorblind-safe palette — critical states (delay/conflict/SLA) currently rely on color alone |
| AC-12 | 🟡 Partial | Keyboard instructions + textual alternative for complex/interactive maps |
| AC-13 | 🔴 Not done | Manual NVDA + VoiceOver testing over critical flows |
| AC-14 | 🔴 Not implemented | Automated a11y in CI (axe-core/pa11y with a regression threshold) |

None of AC-01 through AC-14 mention `focus-visible` styling specifically — it isn't addressed anywhere in the audit or in the codebase search behind this doc. Treat focus-visible styling as an open, un-triaged gap alongside the coded ones above.

**When this file and the audit disagree**: the audit is the living gap tracker and changes as items get fixed; this file is a point-in-time design-system snapshot. If you're deciding what to build next, read the audit, not this summary. If you're fixing an AC-item, update the audit doc in the same PR — don't edit the table above instead.
