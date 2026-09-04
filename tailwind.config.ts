import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Brand + motion tokens also live in src/tokens.ts (single source for JS).
      colors: {
        brand: {
          DEFAULT: "#67EB6B",
          light: "#7DEE86",
          deep: "#38D45B",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
