/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the src directory
    "./public/index.html", // Include the main HTML file if applicable
  ],
  theme: {
    extend: {
      screens: {
        'xs': '440px', // Custom breakpoint for screens less than 420px
      },
      colors: {
        'dark-blue': '#1a202c', // You can adjust this color to your preference
      },
    },
  },
  plugins: [],
}

