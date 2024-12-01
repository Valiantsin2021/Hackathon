import { expect, test } from '@playwright/test'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
const baseUrl = process.env.BASE_URL

test.describe(`Avatars`, () => {
  test('update users avatar, api-11', async ({ request }) => {
    const headers = {
      'Content-Type': 'multipart/form-data',
      'X-Task-Id': 'api-11'
    }
    await test.step(`GET all users and get user id`, async () => {
      const response = await request.get(`${baseUrl}/users`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.users.length).toBeGreaterThan(0)
      const userId = body.users[0].uuid
      process.env.AVATAR_USER_ID = userId
    })
    await test.step(`PUT update users avatar`, async () => {
      const filePath = './fixtures/playwright.png'
      let data = new FormData()
      data.append('avatar_file', fs.createReadStream(filePath))

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${baseUrl}/users/${process.env.AVATAR_USER_ID}/avatar`,
        headers: {
          ...headers,
          Authorization: process.env.TOKEN,
          ...data.getHeaders()
        },
        data: data
      }

      const response = await axios.request(config)
      expect(response.status).toBe(200)
      expect(response.data.avatar_url).toBeDefined()
      expect(response.data.avatar_url, 'avatar url should start with https://gravatar.com/').toContain('https://gravatar.com/')
    })
  })
})
