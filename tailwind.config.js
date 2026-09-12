/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gov: {
          header: "#0f172a",
          headerText: "#ffffff",
          bg: "#f8fafc",
          card: "#ffffff",
          cardHover: "#f1f5f9",
          border: "#cbd5e1",
          primary: "#0f172a",
          accent: "#334155",
          saffron: "#b45309",
          emerald: "#047857",
          rose: "#b91c1c",
          text: "#0f172a",
          muted: "#475569",
        },
      },
    },
  },
  plugins: [],
};
