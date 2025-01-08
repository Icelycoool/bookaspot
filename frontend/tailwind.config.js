/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      }
    },
    colors: {
      primary: '#007BFF',
      primaryHover: '#006CCE',
      secondary: '#FF7A59',
      secondaryHover: '#E26D56',
      accent: '#6C757D',
      offwhite: '#EDEDED'
    }
  },
  plugins: []
};
