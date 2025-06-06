/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode using class
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Tells Tailwind to scan these files for classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
