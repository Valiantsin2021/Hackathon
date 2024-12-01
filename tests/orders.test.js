import { expect, test } from '@playwright/test'
import { UserBuilder } from '@utils/dataFactory.js'
const baseUrl = process.env.BASE_URL

test.describe(`Orders`, () => {
  test.beforeEach(async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-16'
    }
    await test.step(`POST new user`, async () => {
      const user = new UserBuilder().setDefaults().build()
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.USER_ID_ORDERS = body.uuid
    })
    await test.step(`GET all games and store game data`, async () => {
      const response = await request.get(`${baseUrl}/games/search`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.games.length).toBeGreaterThan(0)
      const gameUUID = body.games[0].uuid
      const gamePrice = body.games[0].price
      process.env.GAME_ID = gameUUID
      process.env.GAME_PRICE = gamePrice
    })
  })
  // test.afterEach(async ({ request }) => {
  //   await test.step(`DELETE user`, async () => {
  //     const headers = {
  //       'X-Task-Id': 'api-16'
  //     }
  //     const response = await request.delete(`${baseUrl}/users/${process.env.USER_ID_ORDERS}`, {
  //       headers
  //     })
  //     expect(response.status()).toBe(204)
  //   })
  // })
  test('POST Create a new order, api-16,api-17', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-16'
    }
    const data = {
      items: [
        {
          item_uuid: process.env.GAME_ID,
          quantity: 1
        }
      ]
    }
    await test.step(`POST creates a new order`, async () => {
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_ORDERS}/orders`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
      expect(body.items[0].quantity).toBe(data.items[0].quantity)
      expect(body.items[0].total_price).toBe(+process.env.GAME_PRICE)
      expect(body.total_price).toBe(+process.env.GAME_PRICE)
      expect(body.status).toBe('open')
    })
    await test.step(`GET list user orders`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.USER_ID_ORDERS}/orders`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.orders.length).toBe(1)
      expect(body.orders[0].uuid).toBeDefined()
      expect(body.orders[0].items.length).toBe(1)
      expect(body.orders[0].items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
      expect(body.orders[0].items[0].quantity).toBe(data.items[0].quantity)
      expect(body.orders[0].items[0].total_price).toBe(+process.env.GAME_PRICE)
      expect(body.orders[0].total_price).toBe(+process.env.GAME_PRICE)
      expect(body.orders[0].status).toBe('open')
    })
  })
  test('PATCH Update a specific order, api-18', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-18'
    }

    await test.step(`POST creates a new order`, async () => {
      const data = {
        items: [
          {
            item_uuid: process.env.GAME_ID,
            quantity: 1
          }
        ]
      }
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_ORDERS}/orders`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
      expect(body.items[0].quantity).toBe(data.items[0].quantity)
      expect(body.items[0].total_price).toBe(+process.env.GAME_PRICE)
      expect(body.total_price).toBe(+process.env.GAME_PRICE)
      expect(body.status).toBe('open')
      process.env.ORDER_ID = body.uuid
    })
    await test.step(`PATCH updates an order`, async () => {
      const data = {
        status: 'canceled'
      }
      const response = await request.patch(`${baseUrl}/orders/${process.env.ORDER_ID}/status`, {
        headers,
        data
      })
      expect(response.status(), 'status code should be 200').toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      expect(body.items.length).toBe(1)
      expect(body.items.find(i => i.item_uuid === process.env.GAME_ID)).toBeTruthy()
      expect(body.items[0].quantity).toBe(1)
      expect(body.items[0].total_price).toBe(+process.env.GAME_PRICE)
      expect(body.total_price).toBe(+process.env.GAME_PRICE)
      expect(body.status).toBe('canceled')
    })
  })
})
