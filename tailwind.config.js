/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#006400",
        secondary: "#333333",
        accent: "#FFD700",
        inputbg: "#222222",
        buttonhover: "#008000",
        modalbg: "rgba(0, 0, 0, 0.8)",
        cardbg: "#111111",
      },
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
