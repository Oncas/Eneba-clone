/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#0F0F1E',
        surface: '#1A1A2E',
        raised: {
          DEFAULT: '#2D2D44',
          hover: '#3D3D54',
        },
        accent: {
          DEFAULT: '#6B46C1',
          hover: '#7C3AED',
        },
      },
    },
  },
  plugins: [],
}
