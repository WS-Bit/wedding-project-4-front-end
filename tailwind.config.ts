import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/custom.css",
  ],
  theme: {
    theme: {
      extend: {
        colors: {
          mauve: {
            50: '#f5f5f6',
            100: '#e9e9ec',
            200: '#d8d8dd',
            300: '#c0c0c9',
            400: '#a3a3b1',
            500: '#8c8c9c',
            600: '#7c7c8c',
            700: '#6b6b79',
            800: '#5d5d66',
            900: '#4e4e54',
          },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
  variants: {
    scrollbar: ['rounded']
  }
}

export default config