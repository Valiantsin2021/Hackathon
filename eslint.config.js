import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import playwright from 'eslint-plugin-playwright'
import globals from 'globals'

export default [
  {
    plugins: { prettier, playwright },
    ignores: ['**/node_modules/*'],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-conditional-in-test': 'warn',
      'playwright/expect-expect': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/require-soft-assertions': 'off',
      'playwright/no-standalone-expect': 'warn',
      'no-console': 'warn'
    }
  }
]
