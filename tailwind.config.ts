import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/custom.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar'),],
  darkMode: 'class', // This allows you to manually control dark mode
}

export default config