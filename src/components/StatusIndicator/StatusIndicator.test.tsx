import { createRef } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { StatusIndicator, type StatusIndicatorHandle } from "./StatusIndicator";

// jsdom lacks matchMedia; provide a controllable mock.
function mockMatchMedia(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: reduced,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

beforeEach(() => {
  cleanup();
  mockMatchMedia(false);
});

describe("StatusIndicator", () => {
  it("renders the title and exposes a status live region", () => {
    render(<StatusIndicator title="You are all set!" />);
    expect(
      screen.getByRole("heading", { name: "You are all set!" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the kicker only when provided", () => {
    const { rerender } = render(<StatusIndicator title="Done" />);
    expect(screen.queryByText("You are all set")).not.toBeInTheDocument();
    rerender(<StatusIndicator kicker="You are all set" title="Done" />);
    expect(screen.getByText("You are all set")).toBeInTheDocument();
  });

  it("respects the headingLevel prop", () => {
    render(<StatusIndicator title="Done" headingLevel={1} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("plays (si--play) normally and settles (si--static) under reduced motion", () => {
    const { container, unmount } = render(<StatusIndicator title="Done" />);
    expect(container.querySelector(".si--play")).toBeTruthy();
    unmount();

    mockMatchMedia(true);
    const { container: c2 } = render(<StatusIndicator title="Done" />);
    expect(c2.querySelector(".si--static")).toBeTruthy();
  });

  it("resolves onRevealComplete immediately under reduced motion", () => {
    mockMatchMedia(true);
    const onDone = vi.fn();
    render(<StatusIndicator title="Done" onRevealComplete={onDone} />);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("exposes an imperative replay() handle", () => {
    const ref = createRef<StatusIndicatorHandle>();
    render(<StatusIndicator ref={ref} title="Done" />);
    expect(typeof ref.current?.replay).toBe("function");
    expect(() => act(() => ref.current?.replay())).not.toThrow();
  });
});
