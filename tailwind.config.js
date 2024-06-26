/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['SFMono-Regular', 'Menlo', 'monospace'],
        custom: ['"SFMono-Regular"', '"YourCustomFont2"', 'fallback-font'],
      },
      // backgroundImage: {
      //   'striped-gradient': 'linear-gradient(to bottom left, #4ADE80 48%, #ffff 55%, #ffff 40%)',
      // },
      // Custom scrollbar hiding utility
      scrollbar: {
        hide: {
          '&::-webkit-scrollbar': {
            width: '0',
            height: '0',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    function ({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '0',
            height: '0',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    },

  ],
}
