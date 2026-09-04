# All Set — Status Indicator

A mobile onboarding **success moment**: a verified seal spins in, a checkmark
draws, pulse rings ripple outward, and the confirmation copy rises into place.
Built design-first, then delivered as a typed, drop-in React component so it
hands off to engineering with no guesswork.

> Designed and built by Miranda Liang — turning an interaction idea into a
> walkable, code-ready prototype.

<p align="center">
  <img src="docs/demo.gif" alt="You're all set — verified seal animates in, pulse rings ripple out, title rises" width="300" />
</p>

**▶︎ Live demo:** <!-- YOUR_DEMO_URL --> · **Video:** [docs/demo.mp4](docs/demo.mp4) · **Motion spec:** [docs/MOTION_SPEC.md](docs/MOTION_SPEC.md)

---

## Why this exists

Motion and micro-interaction detail are the part of a design a static Figma
frame can't carry. This repo closes that gap: the prototype _is_ the spec. An
engineer can watch it, read the timeline, copy the tokens, and drop the
component in — instead of a round-trip of "what's the easing? how long? what
green?"

## Quick start

```bash
nvm use            # Node 20 (see .nvmrc)
npm install
npm run dev        # live demo at http://localhost:5173
npm run storybook  # component states with live controls
```

## Use the component

```tsx
import { useRef } from "react";
import {
  StatusIndicator,
  type StatusIndicatorHandle,
} from "./components/StatusIndicator";

function Done() {
  const ref = useRef<StatusIndicatorHandle>(null);
  return <StatusIndicator ref={ref} title="You are all set!" />;
  // replay the reveal later: ref.current?.replay();
}
```

### Props

| Prop                  | Type                       | Default              | Notes                                                                           |
| --------------------- | -------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| `title`               | `string`                   | `"You are all set!"` | Primary confirmation line.                                                      |
| `kicker`              | `string`                   | `""`                 | Optional supporting line above the title; hidden when empty.                    |
| `brandColor`          | `string`                   | `#67EB6B`            | Drives the seal gradient + ring color.                                          |
| `gradient`            | `[string, string, string]` | token stops          | Explicit seal gradient; overrides `brandColor` for the seal.                    |
| `headingLevel`        | `1–6`                      | `2`                  | Title heading level, for a correct document outline when embedded.              |
| `autoPlay`            | `boolean`                  | `true`               | Play the reveal on mount.                                                       |
| `onRevealComplete`    | `() => void`               | —                    | Fires on the title's real `animationend` (or immediately under reduced motion). |
| `className` / `style` | —                          | —                    | Forwarded to the root.                                                          |

Imperative handle: `ref.current.replay()`.

## Design tokens

Color and motion are defined once in [`src/tokens.ts`](src/tokens.ts) and
referenced everywhere — copy that file to reuse the system.

| Token         | Value                                                   |
| ------------- | ------------------------------------------------------- |
| Brand / icon  | `#67EB6B`                                               |
| Seal gradient | `#7DEE86` → `#67EB6B` → `#38D45B` (light → base → deep) |
| Title         | `#12141A`                                               |
| Kicker        | `#8A93A3`                                               |
| Spring easing | `cubic-bezier(0.34, 1.56, 0.64, 1)`                     |
| Out easing    | `cubic-bezier(0.22, 1, 0.36, 1)`                        |

Full element-by-element timeline: **[docs/MOTION_SPEC.md](docs/MOTION_SPEC.md)**.

## States

- **Default** — title only.
- **With kicker** — supporting line + title (e.g. _"You are all set" / "Welcome
  to Wealth Office"_).
- **Custom brand** — pass any `brandColor`; rings and seal re-theme from it.
- **Reduced motion** — respects `prefers-reduced-motion`; renders the settled
  state with no movement.

Each is a story in Storybook with live controls.

## Accessibility

- Root is a `role="status"` / `aria-live="polite"` region with an `sr-only`
  announcement, so screen readers hear the confirmation.
- Decorative seal, rings, and icon are `aria-hidden`.
- Title heading level is configurable to keep the page outline correct.
- All motion is disabled under `prefers-reduced-motion`.

## Tech

React 18 · TypeScript (strict) · Tailwind · Vite · Vitest + Testing Library ·
Storybook. No animation library — the reveal is hand-authored CSS keyframes on
`transform`/`opacity` only.

## Scripts

| Script              | Does                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | Vite dev server               |
| `npm run build`     | Type-check + production build |
| `npm run typecheck` | `tsc --noEmit`                |
| `npm run lint`      | ESLint                        |
| `npm run format`    | Prettier write                |
| `npm run test`      | Vitest run                    |
| `npm run storybook` | Storybook dev server          |

CI runs typecheck, lint, format check, tests, and build on every push and PR
(see [.github/workflows/ci.yml](.github/workflows/ci.yml)).

## License

MIT © 2026 Miranda Liang
