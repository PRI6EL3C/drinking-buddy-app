/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tinder-pink': '#FE3C72',
        'tinder-dark': '#21262E',
      }
    },
  },
  plugins: [],
}
