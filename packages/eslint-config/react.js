const baseConfig = require('./base')

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    // 'eslint:recommended',
    // 'prettier',
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    // 'turbo',
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ['*.js?(x)', '*.ts?(x)'] },
  ],
}
