/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#123329',   // deep forest green - header/footer/headings
          DEFAULT: '#1B4B3A',
          light: '#1F5942',
          50: '#EEF4F1',
        },
        gold: {
          DEFAULT: '#C99A3E',
          dark: '#B3852B',
          light: '#E4C578',
        },
        cream: '#FBF8F1',
        sale: '#E0562D',
        rent: '#2E7D5B',
        plotTag: '#26292B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
