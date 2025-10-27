import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

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
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'error',

      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'error',
      'eqeqeq': ['error', 'always'],

      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', 'stroustrup'],
      '@stylistic/spaced-comment': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before'],
    },
  },
]
