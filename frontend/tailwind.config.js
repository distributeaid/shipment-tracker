module.exports = {
  // Remove unused classes in prod to decrease the size of the CSS bundle
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // https://www.figma.com/file/F86X05axrNQFJJh0IhZEWs/Distribute-Aid-colors
        'da-navy-50': '#082B76',
        'da-navy-100': '#09328B',
        'da-navy-200': '#4362A6',
        'da-navy-300': '#8B9FC8',
        'da-navy-400': '#C5CFE4',
        'da-navy-500': '#E2E7F1',
      },
      minHeight: {
        'half-screen': '50vh',
      },
      height: {
        /**
         * Height of the navigation at the top of the page
         */
        nav: '4rem',
        /**
         * Viewport height minus the header height
         */
        content: 'calc(100vh - 4rem)',
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
