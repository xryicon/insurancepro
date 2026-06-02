/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#0f172a",
        accent: "#22c55e",

        surface: {
          100: "#f1f5f9",
          200: "#e2e8f0",
        },
      },

      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)",
        medium: "0 15px 35px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};