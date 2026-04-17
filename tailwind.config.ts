import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        telstra: {
          blue: "#0D54FF",
          dark: "#1A1A1A",
          grey: "#F4F4F4",
          white: "#FFFFFF",
          red: "#E4002B",
          green: "#00A94F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
