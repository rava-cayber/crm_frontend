/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",
        navy: {
          base: "#0B0E14",
          elevated: "#151921",
          raised: "#1C212C",
        },
        accent: {
          violet: "#8B5CF6",
          cyan: "#06B6D4",
        },
        secondary: '#facc15', // Yellow
        dark: '#1e293b', // Dark slate
        light: '#f8fafc', // Light slate
      }
    },
  },
  plugins: [],
}
