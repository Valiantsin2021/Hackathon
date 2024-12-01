import { expect, test as setup } from '@playwright/test'
import fs from 'fs'
import { user } from '../utils/dataFactory.js'
const env = process.env.ENV || 'release'
setup('authenticate', async ({ request }) => {
  console.info(`\x1b[2m\t***** Setup started *****'\x1b[0m`)
  fs.writeFileSync('./fixtures/user.json', JSON.stringify(user, null, 2))
  process.env.BASE_URL = `https://${env}-gs.qa-playground.com/api/v1`
  const response = await request.post(`${process.env.BASE_URL}/setup`)
  expect(response.ok()).toBeTruthy()
  expect.soft(response.status()).toEqual(205)
  console.info(`\x1b[2m\t***** Setup completed *****'\x1b[0m`)
})
