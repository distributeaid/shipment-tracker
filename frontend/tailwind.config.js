module.exports = {
  // Remove unused classes in prod to decrease the size of the CSS bundle
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // TODO come up with a better naming convention once we have a palette
        'da-blue-900': '#112C71',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
