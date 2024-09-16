const baseConfig = require('./react')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    // 'eslint:recommended',
    // 'prettier',
    // require.resolve('@vercel/style-guide/eslint/browser'),
    // require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
    'next/core-web-vitals',
    // 'next/typescript',
    // 'turbo',
  ],
}
