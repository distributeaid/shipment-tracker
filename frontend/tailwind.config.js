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
    extend: {
      // Adds the ability to style the first and last child.
      // For example: first:pl-4
      padding: ['first', 'last'],
    },
  },
  plugins: [],
}
