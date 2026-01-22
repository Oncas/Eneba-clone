/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eneba-purple': '#6B46C1',
        'eneba-dark': '#1A1A2E',
        'eneba-darker': '#0F0F1E',
      },
    },
  },
  plugins: [],
}
