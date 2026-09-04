/**
 * Design tokens for the "You're all set" status experience.
 *
 * This is the single source of truth a developer copies instead of guessing
 * values off a screenshot. Color and motion both live here so the animation
 * spec in docs/MOTION_SPEC.md stays in lockstep with the code.
 */

export const color = {
  /** Requested icon color — anchors the seal gradient and the pulse rings. */
  brand: "#67EB6B",
  /** Seal gradient, light (top) → base → deep (bottom). */
  sealFrom: "#7DEE86",
  sealVia: "#67EB6B",
  sealTo: "#38D45B",
  /** Foreground. */
  check: "#FFFFFF",
  title: "#12141A",
  kicker: "#8A93A3",
  /** Screen background. */
  surface: "#FFFFFF",
} as const;

/**
 * Motion timeline. Every value here maps 1:1 to a row in docs/MOTION_SPEC.md.
 * Durations/delays in seconds; easing as cubic-bezier control points.
 */
export const motion = {
  easing: {
    /** Overshoot spring for the seal pop-in. */
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    /** Standard decelerate for draws, ripples, and text rise. */
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  seal: { duration: 0.78, delay: 0 },
  check: { duration: 0.5, delay: 0.4 },
  aura: { duration: 0.7, delay: 0.62 },
  /** Three ripple rings emitted in sequence. */
  emit: { duration: 1.5, delays: [0.28, 0.46, 0.64] as const },
  title: { duration: 0.62, delay: 0.82 },
  kicker: { duration: 0.62, delay: 0.72 },
} as const;

export const tokens = { color, motion } as const;
export default tokens;
