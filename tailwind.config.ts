/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // for Vite
    ],
    theme: {
      extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
  }
  