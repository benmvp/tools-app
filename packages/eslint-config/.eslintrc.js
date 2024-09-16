module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'plugin:jest/recommended',
    'prettier',
  ],
  plugins: [
    'jest',
    'sort-destructure-keys',
    'sort-keys-fix',
    'typescript-sort-keys',
  ],
  rules: {
    // Imports
    'import/no-self-import': 'error',
    'import/order': [
      'error',
      {
        alphabetize: { caseInsensitive: false, order: 'asc' },
        groups: [
          'builtin',
          'external',
          'unknown',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
      },
    ],
    'import/no-named-as-default': 'error',
    'import/named': 'error',
    'import/no-absolute-path': 'error',
    'import/namespace': 'error',
    'import/export': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

    // Sorting
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
}
