/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#fdfaf1',
        'judge-gray': '#4d3f2d',
        'sorrell-brown': '#cfb796',
        'waterloo': '#828799',
        'bud': '#a1a59a',
      },
      backgroundColor: {
        'parchment': '#fdfaf1',
      },
      boxShadow: {
        'soft-wood': '0 4px 6px -1px rgba(77, 63, 45, 0.3), 0 2px 4px -1px rgba(77, 63, 45, 0.1)',
      },
      borderRadius: {
        'soft-desk': '0.5rem',
      }
    },
  },
  plugins: [],
}
