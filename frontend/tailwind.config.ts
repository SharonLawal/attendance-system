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
        primary: {
          DEFAULT: "#256af4", // Bright Blue for auth pages
          light: "#1e5dd8",
          dark: "#0a3a95",
        },
        accent: {
          DEFAULT: "#FFC107", // Amber Gold
          light: "#FFD54F",
          dark: "#FFA000",
        },
        "gold-accent": "#f59e0b",
        "background-light": "#f5f6f8",
        "background-dark": "#051025", // Deep Navy
        "surface-dark": "#0B162C",
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
      backgroundImage: {
        aurora: "radial-gradient(circle at 50% -20%, #1e3a8a 0%, #051025 40%, #051025 100%)",
        "aurora-glow": "conic-gradient(from 90deg at 50% 50%, #00000000 50%, #256af4 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
          "100%": { transform: "translateY(0px) rotate(0deg)" },
        },
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
  },
  plugins: [],
};

export default config;