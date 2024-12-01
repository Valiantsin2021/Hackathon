import { expect, test } from '@playwright/test'
import fs from 'fs'
const baseUrl = process.env.BASE_URL
const user = JSON.parse(fs.readFileSync('fixtures/user.json', 'utf-8'))

test.describe(`Orders`, () => {
  test.beforeEach(async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-19'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.USER_ID_PAYMENTS = body.uuid
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
    await test.step(`POST creates a new order`, async () => {
      const data = {
        items: [
          {
            item_uuid: process.env.GAME_ID,
            quantity: 1
          }
        ]
      }
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_PAYMENTS}/orders`, { headers, data })
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
  })
  test.afterEach(async ({ request }) => {
    await test.step(`DELETE user`, async () => {
      const headers = {
        'X-Task-Id': 'api-19'
      }
      const response = await request.delete(`${baseUrl}/users/${process.env.USER_ID_PAYMENTS}`, {
        headers
      })
      expect(response.status()).toBe(204)
    })
  })
  test('GET a payment, api-19', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-19'
    }
    await test.step(`POST creates a payment`, async () => {
      const data = {
        order_uuid: process.env.ORDER_ID,
        payment_method: 'card'
      }
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_PAYMENTS}/payments`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      console.log(JSON.stringify(body, null, 2))
      expect(body.order_uuid).toBe(process.env.ORDER_ID)
      expect(body.payment_method).toBe('card')
      expect(body.status).toBe('processing')
      expect(body.amount).toBe(+process.env.GAME_PRICE)
      expect(body.user_uuid).toBe(process.env.USER_ID_PAYMENTS)
      expect(body.uuid).toBeDefined()
      process.env.PAYMENT_ID = body.uuid
    })
    await test.step(`GET a payment by id`, async () => {
      const response = await request.get(`${baseUrl}/payments/${process.env.PAYMENT_ID}`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      console.log(JSON.stringify(body, null, 2))
      expect(body.order_uuid).toBe(process.env.ORDER_ID)
      expect(body.payment_method).toBe('card')
      expect(body.status).toBe('processing')
      expect(body.amount).toBe(+process.env.GAME_PRICE)
      expect(body.user_uuid).toBe(process.env.USER_ID_PAYMENTS)
      expect(body.uuid).toBeDefined()
    })
  })
  test('GET all payments for user, api-20', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-20'
    }
    await test.step(`POST creates a payment`, async () => {
      const data = {
        order_uuid: process.env.ORDER_ID,
        payment_method: 'card'
      }
      const response = await request.post(`${baseUrl}/users/${process.env.USER_ID_PAYMENTS}/payments`, { headers, data })
      expect(response.status()).toBe(200)
      const body = await response.json()
      console.log(JSON.stringify(body, null, 2))
      expect(body.order_uuid).toBe(process.env.ORDER_ID)
      expect(body.payment_method).toBe('card')
      expect(body.status).toBe('processing')
      expect(body.amount).toBe(+process.env.GAME_PRICE)
      expect(body.user_uuid).toBe(process.env.USER_ID_PAYMENTS)
      expect(body.uuid).toBeDefined()
      process.env.PAYMENT_ID = body.uuid
    })
    await test.step(`GET all payments for user`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.USER_ID_PAYMENTS}/payments`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      console.log(JSON.stringify(body, null, 2))
      expect(body.payments.length).toBe(1)
      expect(body.payments.find(p => p.uuid === process.env.PAYMENT_ID)).toBeTruthy()
    })
  })
})
