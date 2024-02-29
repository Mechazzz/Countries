/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["cyberpunk"],
  },
  plugins: [require("daisyui")],
};
