import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import {
  StatusIndicator,
  type StatusIndicatorHandle,
  type StatusIndicatorProps,
} from "./StatusIndicator";

/**
 * The status experience shown after a user finishes onboarding.
 * Use the controls to try different copy and brand colors, or the "Replay"
 * story to re-trigger the reveal.
 */
const meta = {
  title: "Feedback/StatusIndicator",
  component: StatusIndicator,
  parameters: { layout: "fullscreen" },
  argTypes: {
    brandColor: { control: "color" },
    headingLevel: { control: { type: "inline-radio" }, options: [1, 2, 3] },
  },
  // Frame each story on a phone-sized white surface so the composition reads.
  decorators: [
    (Story) => (
      <div
        style={{
          width: 342,
          height: 708,
          margin: "24px auto",
          background: "#fff",
          borderRadius: 40,
          border: "1px solid #eef0f2",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "You are all set!" },
};

export const WithKicker: Story = {
  args: { kicker: "You are all set", title: "Welcome to Wealth Office" },
};

export const CustomBrandColor: Story = {
  args: { title: "Payment confirmed", brandColor: "#3B82F6" },
};

/** Motion is skipped; the final state renders immediately. */
export const ReducedMotion: Story = {
  args: { title: "You are all set!" },
  parameters: { chromatic: { disableSnapshot: false } },
  globals: { motion: "reduced" },
};

function ReplayableDemo(args: StatusIndicatorProps) {
  const ref = useRef<StatusIndicatorHandle>(null);
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <StatusIndicator ref={ref} {...args} />
      <button
        onClick={() => ref.current?.replay()}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 18px",
          borderRadius: 9999,
          border: 0,
          background: "#12141A",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Replay
      </button>
    </div>
  );
}

/** Demonstrates the imperative `replay()` handle. */
export const Replayable: Story = {
  render: (args) => <ReplayableDemo {...args} />,
  args: { title: "You are all set!" },
};
