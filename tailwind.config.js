/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        background: "var(--color-background)",
        backgroundSecondary: "var(--color-background-secondary)",
        backgroundTertiary: "var(--color-background-tertiary)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        buttonBg: "var(--color-button-bg)",
        buttonText: "var(--color-button-text)",
        border: "var(--color-border)",
        cardBg: "var(--color-card-bg)",
        danger: "#eb3330", // Universal danger color
        success: "#4aac68", // Universal success color
      },
    },
  },
  plugins: [],
};
