import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        charcoal: "#1C1917",
        forest: {
          50: "#F0F7F3",
          100: "#D8EDE2",
          200: "#B4DAC7",
          300: "#82C0A3",
          400: "#529E7C",
          500: "#358260",
          600: "#26684C",
          700: "#1F5340",
          800: "#1B4332",
          900: "#143528",
        },
        accent: {
          DEFAULT: "#C2410C",
          dark: "#9A3412",
          light: "#EA580C",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
