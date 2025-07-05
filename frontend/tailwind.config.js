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
        myblack: {
          primary: "#ffffff",
          "primary-content": "#000000",
          secondary: "#1DA1F2", // Twitter Blue
          "secondary-content": "#ffffff",
          accent: "#37CDBE",
          "base-100": "#000000",
          "base-content": "#ffffff",
        },
      },
    ],
  },
};
