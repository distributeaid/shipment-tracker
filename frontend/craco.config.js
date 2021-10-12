// https://tailwindcss.com/docs/guides/create-react-app
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  devServer: {
    port: 8080,
  },
}
