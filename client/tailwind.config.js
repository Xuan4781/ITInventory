/** @type {import('tailwindcss').Config} */ 
export default {
  content: [
    "./index.html",              // ✅ Add this
    "./src/**/*.{js,jsx,ts,tsx}" // ✅ Your components/pages
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
