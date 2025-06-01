/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '990': '990',
        '995': '995',
        '1000': '1000',
      }
    },
  },
  plugins: [],
};
