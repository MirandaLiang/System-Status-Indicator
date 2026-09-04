# Motion Spec — "You're all set" status reveal

The one thing a static Figma frame can't hand off is motion. This is the exact
timeline the component implements, so an engineer can rebuild or verify it
without guessing. All values are mirrored in [`src/tokens.ts`](../src/tokens.ts)
(`motion`) — that file is the source of truth; this doc is the readable view.

## Principles

- **One orchestrated reveal.** A single choreographed sequence on mount, not
  scattered per-element effects.
- **Compositor-only.** Every animation drives `transform` and `opacity` (plus
  an SVG `stroke-dashoffset` draw). No layout-triggering properties, so it holds
  60fps on mobile.
- **Interruptible + repeatable.** `replay()` remounts the scene and re-fires the
  whole sequence.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, the final state
  renders instantly and `onRevealComplete` resolves on the same tick.

## Timeline

Times are from mount (t = 0), in seconds.

| #   | Element             | Property                | Start | Duration | Easing | From → To                                                          |
| --- | ------------------- | ----------------------- | ----- | -------- | ------ | ------------------------------------------------------------------ |
| 1   | Seal badge          | `transform` + `opacity` | 0.00  | 0.78     | spring | `scale(.2) rotate(-120°)` → settle (overshoot `1.08 / +6°` at 60%) |
| 2   | Checkmark           | `stroke-dashoffset`     | 0.40  | 0.50     | out    | `1 → 0` (draws on)                                                 |
| 3   | Pulse ring 1        | `transform` + `opacity` | 0.28  | 1.50     | out    | `scale(.42)` @ .55α → `scale(2.1)` @ 0α                            |
| 4   | Pulse ring 2        | `transform` + `opacity` | 0.46  | 1.50     | out    | same as ring 1                                                     |
| 5   | Pulse ring 3        | `transform` + `opacity` | 0.64  | 1.50     | out    | same as ring 1                                                     |
| 6   | Aura ring (inner)   | `opacity`               | 0.62  | 0.70     | ease   | `0 → 1` (resting)                                                  |
| 7   | Aura ring (outer)   | `opacity`               | 0.74  | 0.70     | ease   | `0 → 1`, then gentle breathe                                       |
| 8   | Kicker (if present) | `transform` + `opacity` | 0.72  | 0.62     | out    | `translateY(14px)` @ 0α → settle                                   |
| 9   | Title               | `transform` + `opacity` | 0.82  | 0.62     | out    | `translateY(14px)` @ 0α → settle                                   |

**Reveal complete** ≈ **1.44s** (title rise ends). The component fires
`onRevealComplete` on the title's real `animationend`, not a timer.

Resting state after the reveal: two faint aura rings remain, the outer one
breathing on a 4.6s loop at low amplitude.

## Easing

| Token    | cubic-bezier          | Used for                       |
| -------- | --------------------- | ------------------------------ |
| `spring` | `0.34, 1.56, 0.64, 1` | Seal pop-in (overshoot)        |
| `out`    | `0.22, 1, 0.36, 1`    | Check draw, ripples, text rise |

## Notes for implementation

- The seal is a generated 12-point rounded burst (`SEAL_PATH`), not an icon-font
  glyph, so it stays crisp at any size with no dependency.
- Ripple rings animate `scale` from a shared centered box; keep `transform-origin`
  centered or the ripple drifts.
- The checkmark uses `pathLength="1"` so the draw is resolution-independent —
  `stroke-dashoffset` goes `1 → 0` regardless of the path's real length.
