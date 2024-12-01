import { expect, test } from '@playwright/test'
const baseUrl = process.env.BASE_URL

test.describe(`Games`, () => {
  test('GET search games by name, api-2', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-2'
    }
    const name = 'Atomic Heart'
    const response = await request.get(`${baseUrl}/games/search`, { headers, params: { query: name } })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.games.length, 'games length should be 1').toBe(1)
    expect(body.games[0].title).toBe(name)
  })
  test('GET game by UUID, api-9', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-9'
    }
    await test.step(`GET all games and store game uuid`, async () => {
      const response = await request.get(`${baseUrl}/games/search`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.games.length).toBeGreaterThan(0)
      const gameUUID = body.games[0].uuid
      process.env.GAME_ID = gameUUID
    })
    await test.step(`GET game by UUID`, async () => {
      const response = await request.get(`${baseUrl}/games/${process.env.GAME_ID}`, { headers })
      expect(response.status(), 'response status should be 200').toBe(200)
      const body = await response.json()
      expect(body.uuid).toBe(process.env.GAME_ID)
    })
  })
})
