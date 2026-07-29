# Motion

> Descriptive snapshot of transitions, animations, and reduced-motion handling in `console/` (2026-07-29). There is no motion design system today — durations and easings are chosen per rule, and accessibility for motion-sensitive users is not yet handled anywhere. This file documents that state plainly so it can be tracked, not smoothed over.

## Transitions

No `transitionDuration`/`transitionTimingFunction` customization exists in `tailwind.config.js` — Tailwind's defaults (`150ms ease-in-out`) apply wherever a bare `transition-*` utility is used without an explicit `duration-*`/`ease-*`.

11 explicit CSS `transition:` shorthand declarations exist across 5 files, with durations ranging `0.15s`–`320ms` and inconsistent easings (`ease`, `cubic-bezier(...)`, plain default). Two are the well-known Chrome autofill-suppression hack (`transition: background-color 5000s ease-in-out 0s`), not real motion. Representative real ones:

| File:Line | Declaration | Element |
|---|---|---|
| `lipu.css:616` | `transition: all 0.15s ease;` | Route map control button |
| `lipu.css:2896` | `transition: box-shadow 0.15s ease, border-color 0.15s ease;` | Home page card hover |
| `lipu.css:3311` | `transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), background 320ms ease, color 320ms ease;` | Approvals-history "pulse" indicator |

Tailwind `duration-*` utilities appear 39 times in templates, spanning `duration-150`, `duration-200`, `duration-300`, `duration-500`, `duration-1000`, and one arbitrary `duration-[240ms]` (paired with a custom easing, `templates/lipu.hbs:18,23`, for the logo hover scale). No single duration dominates — `150`/`200`/`300` are all common, chosen per component rather than from a shared scale.

By far the most common transition-related utility is `transition-colors`, appearing in **512 places across ~33% of all templates** — the default "make hover states not feel like a hard cut" treatment, almost always without an accompanying explicit `duration-*` (so it rides Tailwind's default 150ms).

| Utility | Occurrences |
|---|---|
| `transition-colors` | 512 |
| `transition-all` | 73 |
| `transition-opacity` | 63 |
| `transition` (bare) | 31 |
| `transition-transform` | 26 |
| `transition-shadow` | 9 |
| `transition-none` | 7 |

## Keyframe animations

Only two custom `@keyframes` exist in the whole codebase:

- `lipu-boot-spin` (`console.css:148`) — drives the app boot spinner, `animation: lipu-boot-spin 0.85s linear infinite` (`console.css:132`). Runs indefinitely while the app boots.
- `fadeIn` (`components/lipu/language-selector.css:11`) — `animation: fadeIn 0.15s ease-in-out` on the language selector dropdown (line 8).

Beyond these, animation comes entirely from Tailwind's built-in `animate-*` utilities:

| Utility | Approx. occurrences | Use |
|---|---|---|
| `animate-pulse` | ~30 | Skeleton loading placeholders (`kpi-skeleton`, `table-skeleton`, audit-log cards, dashboard sections) |
| `animate-spin` | ~25 | Inline loading spinners (modal submit buttons, async actions) |
| `animate-fade-in` (custom) | 4 | Modal entrance |
| `animate-scale-in` (custom) | 4 | Modal entrance |
| `animate-ping` | 1 | Escalation alert indicator (`trace-drawer/escalation-card.hbs`) |
| `animate-slide-up` (custom) | 1 | The one toast component in the app (`shared/undo-toast.hbs`) |

## Reduced motion — not implemented

`grep -rn "prefers-reduced-motion" console/` returns **zero matches**. None of the transitions, keyframes, or `animate-*` usages above — including the infinite boot spinner and the ~55 combined `animate-spin`/`animate-pulse` usages — have any motion-reduction path for users with `prefers-reduced-motion: reduce`. This is also flagged independently in `docs/auditoria-ux-ui-2026-06-29.md` as **AC-09** — see [`accessibility.md`](./accessibility.md).
