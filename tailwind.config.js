/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        "geist-sans": ["Geist Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
