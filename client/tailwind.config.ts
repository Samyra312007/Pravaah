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
        ksp: {
          navy: "#1B2A4A",
          blue: "#2C4A7C",
          gold: "#C9A94E",
          red: "#C0392B",
          grey: "#F5F6FA",
          dark: "#121212",
        },
      },
    },
  },
  plugins: [],
};

export default config;
