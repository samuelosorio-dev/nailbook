/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        baya: {
          50: "#FCF3F6",
          100: "#F7E6EB",
          200: "#EED0DA",
          300: "#E9A6B8",
          400: "#C96A8A",
          500: "#A8406A",
          600: "#8C2F55",
          700: "#7A2649",
          800: "#5E1D39",
          900: "#42142A",
        },
        tinta: "#2A1520",
        crema: "#FBF6F4",
        linea: "#EEDFE4",
        suave: "#6E5A64",
        tenue: "#9A8891",
        salvia: {
          50: "#E4EFE7",
          600: "#3F6E52",
          700: "#2F5A41",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "none" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "none" },
        },
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in .25s ease-out",
        "slide-up": "slide-up .32s cubic-bezier(.2,.8,.2,1)",
        fade: "fade .2s ease-out",
      },
    },
  },
  plugins: [],
};
