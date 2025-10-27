import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  stylistic.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', '*.min.js'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        bootstrap: 'readonly',
      },
    },
    rules: {
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'error',
    },
  },
])
