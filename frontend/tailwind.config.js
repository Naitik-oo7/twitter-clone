/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        myblacktheme: {
          primary: "#FF6363",
          secondary: "#000000",
          accent: "#000000",
          neutral: "#000000",
          "base-100": "#000000",
          "base-content": "#ffffff", // white text
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
    defaultTheme: "myblacktheme",
  },
};
