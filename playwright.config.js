// @ts-check
import { defineConfig } from '@playwright/test'
import 'dotenv/config'

const env = process.env.ENV || 'release'

export default defineConfig({
  timeout: 60000,
  testDir: './tests',
  testMatch: /.*\.test\.js$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: './report/allure-results',
        suiteTitle: true,
        environmentInfo: {
          Environment: process.env.ENV,
          User: process.env.USER,
          NodeJS_version: process.version,
          OS: process.platform
        }
      }
    ],
    ['junit', { outputFile: `./report/playwright_${new Date().getTime()}.xml` }]
  ],
  use: {
    baseURL: `https://${env}-gs.qa-playground.com/api/v1`,
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      Authorization: process.env.TOKEN
    }
  },
  projects: [
    {
      name: 'setup',
      testMatch: /initiate.js$/
    },
    {
      name: 'api-tests',
      testMatch: /.*\.test\.js$/,
      dependencies: ['setup']
    }
  ]
})
