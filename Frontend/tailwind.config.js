/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          bg: "#E8EFE8",
          footer: "#eef4ef",
          primary: "#A3B18A",
          forest: "#588157",
          dark: "#344E41",
        },
      },
      fontFamily: {
        hebrew: ['"Noto Serif Hebrew"', '"Noto Serif"', "serif"],
      },
    },
  },
  plugins: [],
};
