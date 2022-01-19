// otherwise homepage from package.json will be used
process.env.PUBLIC_URL = process.env.PUBLIC_URL ?? '/'

// COMMIT_ID is defined on Clever Cloud deployments
process.env.REACT_APP_VERSION = process.env.COMMIT_ID

// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-file
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
