import { expect, test } from '@playwright/test'
import fs from 'fs'
const baseUrl = process.env.BASE_URL
const user = JSON.parse(fs.readFileSync('fixtures/user.json', 'utf-8'))

test.describe(`Wishlist`, () => {
  test('POST an item to wishlist, api-5', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-5'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.CREATEDUSER_ID_API_5 = body.uuid
    })
    await test.step(`GET all games and store game uuid`, async () => {
      const response = await request.get(`${baseUrl}/games/search`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.games.length).toBeGreaterThan(0)
      const gameUUID = body.games[0].uuid
      process.env.GAME_ID = gameUUID
    })
    await test.step(`GET user wishlist`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.CREATEDUSER_ID_API_5}/wishlist`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(0)
    })
    await test.step(`POST item to wishlist`, async () => {
      const data = {
        item_uuid: process.env.GAME_ID
      }
      const response = await request.post(`${baseUrl}/users/${process.env.CREATEDUSER_ID_API_5}/wishlist/add`, {
        headers,
        data
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.uuid === process.env.GAME_ID)).toBeTruthy()
    })
    await test.step(`GET user wishlist`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.CREATEDUSER_ID_API_5}/wishlist`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.uuid === process.env.GAME_ID)).toBeTruthy()
    })
  })
  test('DELETE an item from wishlist, api-8', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-8'
    }
    await test.step(`GET all users and get user id`, async () => {
      const response = await request.get(`${baseUrl}/users`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.users.length).toBeGreaterThan(0)
      const userId = body.users[0].uuid
      process.env.WISHLIST_USER_ID_DELETE = userId
    })
    await test.step(`GET user wishlist`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.WISHLIST_USER_ID_DELETE}/wishlist`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      const itemUUID = body.items[0].uuid
      process.env.ITEM_ID = itemUUID
    })
    await test.step(`DELETE item from wishlist`, async () => {
      const data = {
        item_uuid: process.env.ITEM_ID
      }
      const response = await request.post(`${baseUrl}/users/${process.env.WISHLIST_USER_ID_DELETE}/wishlist/remove`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(2)
      expect(body.items.find(i => i.uuid === process.env.ITEM_ID)).toBeFalsy()
    })
  })
  test('POST an item to wishlist, api-25', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-25'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.CREATEDUSER_ID_API_25 = body.uuid
    })
    await test.step(`GET all games and store game uuid`, async () => {
      const response = await request.get(`${baseUrl}/games/search`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.games.length).toBeGreaterThan(0)
      const gameUUID = body.games[0].uuid
      process.env.GAME_ID = gameUUID
    })
    await test.step(`GET user wishlist`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.CREATEDUSER_ID_API_25}/wishlist`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(0)
    })
    await test.step(`POST item to wishlist`, async () => {
      const data = {
        item_uuid: process.env.GAME_ID
      }
      const response = await request.post(`${baseUrl}/users/${process.env.CREATEDUSER_ID_API_25}/wishlist/add`, {
        headers,
        data
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.uuid === process.env.GAME_ID)).toBeTruthy()
    })
    await test.step(`GET user wishlist`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.CREATEDUSER_ID_API_25}/wishlist`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.uuid === process.env.GAME_ID)).toBeTruthy()
    })
  })
})
