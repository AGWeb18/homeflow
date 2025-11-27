/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
      },
      colors: {
        primary: '#2563eb', // Blue 600 - High contrast, accessible
        'primary-hover': '#1d4ed8', // Blue 700
        'bg-light': '#f8fafc', // Slate 50
        'bg-dark': '#0f172a', // Slate 900
        'text-main': '#0f172a', // Slate 900
        'text-muted': '#475569', // Slate 600
      }
    },
  },
  plugins: [],
}
