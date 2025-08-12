// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Includes TypeScript files
  ],
  theme: {
    extend: {
       colors: {
        primary: "#303655",   // Navy
        secondary: "#BFCBCE", // Gray
      },
    },
  },
  plugins: [],
}