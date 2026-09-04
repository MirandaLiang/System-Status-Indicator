import { useRef } from "react";
import {
  StatusIndicator,
  type StatusIndicatorHandle,
} from "./components/StatusIndicator";
import { color } from "./tokens";

/**
 * Demo harness: frames the component in a phone shell on a white surface and
 * adds a Replay control. The phone frame is presentation chrome and lives here,
 * not inside the shipped component.
 */
export default function App() {
  const ref = useRef<StatusIndicatorHandle>(null);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center gap-7 bg-white px-4 py-12">
      <div className="phone">
        <div className="screen">
          <StatusIndicator ref={ref} title="You are all set!" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => ref.current?.replay()}
          className="inline-flex items-center gap-2 rounded-full bg-[#12141A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#67EB6B] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Replay
        </button>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F6F8] px-3.5 py-2 text-xs font-medium text-[#4A5261] ring-1 ring-black/10">
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ background: color.brand }}
          />
          Icon {color.brand}
        </span>
      </div>
    </main>
  );
}
