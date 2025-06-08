const withMT = require("@material-tailwind/react/utils/withMT");


/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./node_modules/@heroui/theme/dist/components/(button|dropdown|ripple|spinner|menu|divider|popover).js",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [],
});