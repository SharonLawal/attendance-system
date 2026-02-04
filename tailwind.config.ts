import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-level brand colors defined once (Single Responsibility)
        primary: {
          DEFAULT: "#003366", // Babcock Blue [cite: 1]
          light: "#004080",
          dark: "#002244",
        },
        secondary: {
          DEFAULT: "#FBBF24", // Amber for warnings/alerts [cite: 360]
        },
        status: {
          present: "#10B981", // Success color [cite: 347]
          absent: "#EF4444", // Error/Danger color [cite: 347]
          lms: "#3B82F6", // LMS Sync color [cite: 354]
        },
        success: "#10B981", // For "Present" status
        danger: "#EF4444", // For errors/low attendance
        surface: "#FFFFFF",
        background: "#F9FAFB",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem", // For the 'stats cards' you mentioned [cite: 38]
      },
    },
  },
  plugins: [],
};
export default config;
