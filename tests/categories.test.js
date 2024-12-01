import { expect, test } from '@playwright/test'
const baseUrl = process.env.BASE_URL

test.describe(`Categories`, () => {
  test('GET games by category, api-10', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-10'
    }
    await test.step(`GET all categories and store category uuid`, async () => {
      const response = await request.get(`${baseUrl}/categories`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.categories.length).toBeGreaterThan(0)
      const categoryUUID = body.categories[0].uuid
      process.env.CATEGORY_ID = categoryUUID
    })
    await test.step(`GET games by category`, async () => {
      const response = await request.get(`${baseUrl}/categories/${process.env.CATEGORY_ID}/games`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.games.length).toBe(3)
      for (const game of body.games) {
        expect(game.category_uuids[0], 'category uuid should be the same').toBe(process.env.CATEGORY_ID)
      }
    })
  })
})
