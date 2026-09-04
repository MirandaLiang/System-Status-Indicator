import {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from "react";
import { color } from "../../tokens";
import "./StatusIndicator.css";

/**
 * StatusIndicator
 * ---------------
 * A mobile "you're all set" verification-success moment: a scalloped verified
 * seal spins/pops in, a checkmark draws, concentric pulse rings ripple outward,
 * and the confirmation copy rises into place.
 *
 * Design decisions worth knowing for handoff:
 * - One orchestrated reveal, not scattered effects. Only `transform`/`opacity`
 *   animate, so it stays on the compositor.
 * - `prefers-reduced-motion` is respected — the final state renders instantly.
 * - `onRevealComplete` fires on the real `animationend` of the last element,
 *   not a hardcoded timer, so it stays correct if the timeline is retuned.
 * - Fully typed, dependency-free, and replayable via a ref handle.
 *
 * @example
 * const ref = useRef<StatusIndicatorHandle>(null);
 * <StatusIndicator ref={ref} title="You are all set!" />
 * // later: ref.current?.replay();
 */

/** Rounded 12-point verified-seal path on a 100×100 canvas. */
const SEAL_PATH =
  "M47.78,4.27 Q50.00,2.00 52.22,4.27 L57.87,10.06 Q60.09,12.33 63.15,11.47 L70.94,9.29 Q74.00,8.43 74.79,11.51 L76.79,19.34 Q77.58,22.42 80.66,23.21 L88.49,25.21 Q91.57,26.00 90.71,29.06 L88.53,36.85 Q87.67,39.91 89.94,42.13 L95.73,47.78 Q98.00,50.00 95.73,52.22 L89.94,57.87 Q87.67,60.09 88.53,63.15 L90.71,70.94 Q91.57,74.00 88.49,74.79 L80.66,76.79 Q77.58,77.58 76.79,80.66 L74.79,88.49 Q74.00,91.57 70.94,90.71 L63.15,88.53 Q60.09,87.67 57.87,89.94 L52.22,95.73 Q50.00,98.00 47.78,95.73 L42.13,89.94 Q39.91,87.67 36.85,88.53 L29.06,90.71 Q26.00,91.57 25.21,88.49 L23.21,80.66 Q22.42,77.58 19.34,76.79 L11.51,74.79 Q8.43,74.00 9.29,70.94 L11.47,63.15 Q12.33,60.09 10.06,57.87 L4.27,52.22 Q2.00,50.00 4.27,47.78 L10.06,42.13 Q12.33,39.91 11.47,36.85 L9.29,29.06 Q8.43,26.00 11.51,25.21 L19.34,23.21 Q22.42,22.42 23.21,19.34 L25.21,11.51 Q26.00,8.43 29.06,9.29 L36.85,11.47 Q39.91,12.33 42.13,10.06 Z";

export type StatusIndicatorHandle = {
  /** Restart the reveal animation. */
  replay: () => void;
};

export type StatusIndicatorProps = {
  /** Small supporting line above the title. Hidden when empty. */
  kicker?: string;
  /** Primary confirmation line. */
  title?: string;
  /** Base brand color for the seal + rings. Defaults to the token brand. */
  brandColor?: string;
  /** Explicit seal gradient stops [from, via, to]. Overrides brandColor for the seal. */
  gradient?: readonly [string, string, string];
  /** Heading level for the title, for correct document outline when embedded. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Play the reveal on mount. Defaults to true. */
  autoPlay?: boolean;
  /** Fires once the reveal has fully settled. */
  onRevealComplete?: () => void;
  className?: string;
  style?: CSSProperties;
};

/** SSR-safe `prefers-reduced-motion` listener. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export const StatusIndicator = forwardRef<
  StatusIndicatorHandle,
  StatusIndicatorProps
>(function StatusIndicator(
  {
    kicker = "",
    title = "You are all set!",
    brandColor = color.brand,
    gradient,
    headingLevel = 2,
    autoPlay = true,
    onRevealComplete,
    className = "",
    style,
  },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const [runId, setRunId] = useState(autoPlay ? 1 : 0);

  useImperativeHandle(
    ref,
    () => ({ replay: () => setRunId((n) => n + 1) }),
    [],
  );

  // When motion is off, there is no animationend to listen for — resolve now.
  useEffect(() => {
    if (!onRevealComplete || runId === 0) return;
    if (reduced) onRevealComplete();
  }, [runId, reduced, onRevealComplete]);

  const [from, via, to] = gradient ?? [
    color.sealFrom,
    color.sealVia,
    color.sealTo,
  ];

  const isPlaying = !reduced && runId > 0;
  const mode = isPlaying ? "si--play" : "si--static";

  const rootStyle: CSSProperties = {
    // Tokens consumed by StatusIndicator.css.
    ["--si-check" as string]: color.check,
    ["--si-title" as string]: color.title,
    ["--si-kicker" as string]: color.kicker,
    ["--si-ring" as string]: hexToRgb(brandColor),
    ...style,
  };

  // The title is the last thing to move; its rise ending == reveal complete.
  const handleTitleAnimEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.animationName === "si-rise") onRevealComplete?.();
  };

  const heading = createElement(
    `h${headingLevel}`,
    {
      className:
        "si-title m-0 text-[22px] font-bold leading-[1.15] tracking-[-0.3px] text-[var(--si-title)] whitespace-nowrap",
      onAnimationEnd: handleTitleAnimEnd,
    },
    title,
  );

  return (
    <div
      className={`si-root relative w-full h-full min-h-[420px] ${className}`}
      style={rootStyle}
      role="status"
      aria-live="polite"
    >
      {/* key remounts the subtree so the CSS reveal re-fires on replay */}
      <div key={runId} className={`si-scene absolute inset-0 ${mode}`}>
        <span className="sr-only">
          {kicker ? `${kicker}. ${title}` : title}
        </span>

        {/* Badge + rings, upper-center */}
        <div className="si-badge absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 grid place-items-center">
          <span className="si-ring si-ring--aura si-ring--r2" aria-hidden />
          <span className="si-ring si-ring--aura si-ring--r1" aria-hidden />
          <span className="si-ring si-ring--emit si-ring--e1" aria-hidden />
          <span className="si-ring si-ring--emit si-ring--e2" aria-hidden />
          <span className="si-ring si-ring--emit si-ring--e3" aria-hidden />

          <svg className="si-seal" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <linearGradient id="siSeal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={from} />
                <stop offset="0.5" stopColor={via} />
                <stop offset="1" stopColor={to} />
              </linearGradient>
            </defs>
            <path d={SEAL_PATH} fill="url(#siSeal)" />
            <path
              className="si-check"
              d="M30 52 L43.5 65 L71 36"
              pathLength={1}
              fill="none"
              stroke="var(--si-check)"
              strokeWidth={8.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Copy, lower third */}
        <div className="absolute inset-x-0 bottom-[30%] px-5 text-center">
          {kicker ? (
            <p className="si-kicker m-0 mb-1.5 text-[15px] font-medium tracking-[0.1px] text-[var(--si-kicker)]">
              {kicker}
            </p>
          ) : null}
          {heading}
        </div>
      </div>
    </div>
  );
});

/** "#67EB6B" → "103,235,107" for translucent ring colors. Falls back to brand. */
function hexToRgb(hex: string): string {
  const m = hex
    .replace("#", "")
    .match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (!m) return "103,235,107";
  return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
}

export default StatusIndicator;
