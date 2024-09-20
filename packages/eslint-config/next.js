const baseConfig = require('./react')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    require.resolve('@vercel/style-guide/eslint/next'),
    'next/core-web-vitals',
  ],
}
