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
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 5s linear infinite",
        loader: "loader 2s linear infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        loader: {
          "0%": { transform: "translateX(-100%)" }, // Start off-screen to the left
          "100%": { transform: "translateX(200%)" }, // Move fully off-screen to the right
        },
      },
    },
  },
  plugins: [],
};
