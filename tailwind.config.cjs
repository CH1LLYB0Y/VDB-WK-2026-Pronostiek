/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Aptos', 'sans-serif'], // Zet Aptos als standaard sans font
      },
      colors: {
        wkGreen: '#3CAC3B',
        wkBlue: '#2A398D',
        wkRed: '#E61D25',
        wkLightGray: '#D1D4D1',
        wkDarkGray: '#474A4A',
      },
    },
  },
  plugins: [],
}
