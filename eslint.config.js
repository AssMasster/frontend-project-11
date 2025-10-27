import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['node_modules/', 'dist/', '*.min.js'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        bootstrap: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'error',

      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],

      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
]
