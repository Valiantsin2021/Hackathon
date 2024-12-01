import { expect, test } from '@playwright/test'
import fs from 'fs'
const baseUrl = process.env.BASE_URL
const user = JSON.parse(fs.readFileSync('fixtures/user.json', 'utf-8'))

test.describe(`Cart`, () => {
  test.beforeEach(async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-12'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.USER_ID_CART = body.uuid
    })
    await test.step(`GET all games and store game uuid`, async () => {
      const response = await request.get(`${baseUrl}/games/search`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.games.length).toBeGreaterThan(0)
      const gameUUID = body.games[0].uuid
      const gamePrice = body.games[0].price
      const gameUUID_2 = body.games[1].uuid
      const gamePrice_2 = body.games[1].price
      process.env.GAME_ID = gameUUID
      process.env.GAME_PRICE = gamePrice
      process.env.GAME_ID_2 = gameUUID_2
      process.env.GAME_PRICE_2 = gamePrice_2
    })
    await test.step(`POST Add an item to users cart`, async () => {
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_CART}/cart/add`, {
        headers,
        data: {
          item_uuid: process.env.GAME_ID,
          quantity: 1
        }
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
    })
  })
  test.afterEach(async ({ request }) => {
    await test.step(`DELETE user`, async () => {
      const headers = {
        'X-Task-Id': 'api-12'
      }
      const response = await request.delete(`${baseUrl}/users/${process.env.USER_ID_CART}`, {
        headers
      })
      expect(response.status()).toBe(204)
    })
  })
  test('GET a cart, api-12', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-12'
    }
    const response = await request.get(`${baseUrl}/users/${process.env.USER_ID_CART}/cart`, { headers })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.items.length).toBe(1)
    expect(body.items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
    expect(body.items[0].quantity).toBe(1)
    expect(body.items[0].total_price).toBe(+process.env.GAME_PRICE)
    expect(body.total_price, 'cart total price should be equal to game price ' + process.env.GAME_PRICE).toBe(+process.env.GAME_PRICE)
  })
  test('POST change quantity in users cart, api-13', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-13'
    }
    await test.step(`POST change user cart`, async () => {
      const data = {
        item_uuid: process.env.GAME_ID,
        quantity: 2
      }
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_CART}/cart/change`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length, 'cart items length should be 1').toBe(1)
      expect(body.items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
      expect(body.items[0].quantity).toBe(2)
      expect(body.items[0].total_price).toBe(+process.env.GAME_PRICE * 2)
      expect(body.total_price).toBe(+process.env.GAME_PRICE * 2)
    })
  })
  test('POST remove an item from cart, api-14', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-14'
    }
    await test.step(`POST add a second item to users cart`, async () => {
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_CART}/cart/add`, {
        headers,
        data: {
          item_uuid: process.env.GAME_ID_2,
          quantity: 1
        }
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length).toBe(2)
      expect(body.items.find(i => i.item_uuid === process.env.GAME_ID_2)).toBeTruthy()
    })
    await test.step(`POST removes the first item from the users cart`, async () => {
      const data = {
        item_uuid: process.env.GAME_ID
      }
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_CART}/cart/remove`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.items.length, 'cart items length should be 1').toBe(1)
      expect(body.total_price).toBe(+process.env.GAME_PRICE_2)
    })
  })
  test('POST clear users cart, api-15', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-15'
    }
    const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_CART}/cart/clear`, { headers })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.items.length, 'cart items length should be 0').toBe(0)
    expect(body.total_price).toBe(0)
  })
})
