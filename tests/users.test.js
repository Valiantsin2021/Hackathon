// @ts-nocheck
import { expect, test } from '@playwright/test'
import { UserBuilder } from '@utils/dataFactory.js'
const baseUrl = process.env.BASE_URL
const asserUser = async (body, user) => {
  expect(body.avatar_url).toBe('')
  expect(body.email).toBe(user.email)
  expect(body.name).toBe(user.name)
  expect(body.nickname).toBe(user.nickname)
}
test.describe(`qa-playground: USERS scenarios`, () => {
  test('DELETE existing user, api-1', async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-1'
    }
    await test.step(`GET all users and get user id`, async () => {
      const response = await request.get(`${baseUrl}/users`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.users.length).toBeGreaterThan(0)
      const userId = body.users.at(-1).uuid
      process.env.USER_ID = userId
    })
    await test.step(`DELETE user by id`, async () => {
      const response = await request.delete(`${baseUrl}/users/${process.env.USER_ID}`, {
        headers
      })
      expect(response.status()).toBe(204)
    })
  })
  test('Create a new user and verify it api-3', async ({ request }) => {
    const user = new UserBuilder().setDefaults().build()
    const headers = {
      'X-Task-Id': 'api-3'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.CREATEDUSER_ID = body.uuid
      await asserUser(body, user)
    })
    await test.step(`GET created user`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.CREATEDUSER_ID}`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      await asserUser(body, user)
    })
    await test.step(`GET all users and verify created user`, async () => {
      const response = await request.get(`${baseUrl}/users`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      const createdUser = body.users.find(u => u.uuid === process.env.CREATEDUSER_ID)
      expect(user).toBeDefined()
      await asserUser(createdUser, user)
    })
  })
  test('Create a new user and verify it api-7', async ({ request }) => {
    const user = new UserBuilder().setDefaults().build()
    const headers = {
      'X-Task-Id': 'api-7'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.CREATEDUSER_ID = body.uuid
      await asserUser(body, user)
    })
    await test.step(`POST users/login`, async () => {
      const response = await request.post(`${baseUrl}/users/login`, {
        headers,
        data: {
          email: user.email,
          password: user.password
        }
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      await asserUser(body, user)
    })
  })
  test(`PATCH update user profile api-4`, async ({ request }) => {
    const updatedUser = new UserBuilder().setDefaults().build()
    const headers = {
      'X-Task-Id': 'api-4'
    }
    let user1
    let user2
    await test.step(`GET user to update`, async () => {
      const response = await request.get(`${baseUrl}/users`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      user1 = body.users[0]
      user2 = body.users[1]
    })
    await test.step(`PATCH update user1 profile`, async () => {
      const response = await request.patch(`${baseUrl}/users/${user1.uuid}`, {
        headers,
        data: updatedUser
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.UPDATED_ID = body.uuid
      await asserUser(body, updatedUser)
    })
    await test.step(`GET updated user`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.UPDATED_ID}`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      await asserUser(body, updatedUser)
    })
    await test.step('PATCH update user2 profile', async () => {
      const response = await request.patch(`${baseUrl}/users/${user2.uuid}`, {
        headers,
        data: updatedUser
      })
      expect(response.status()).toBe(409)
      const body = await response.json()
      expect(body.message).toContain('User with the following "email" already exists:')
    })
  })
  test(`GET list all users api-6`, async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-6'
    }
    await test.step(`GET all users`, async () => {
      const response = await request.get(`${baseUrl}/users?offset=11`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.users.length, 'number of users should be 1').toBe(0)
    })
  })
  test(`GET list all users api-21`, async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-21'
    }
    await test.step(`GET all users`, async () => {
      const response = await request.get(`${baseUrl}/users?limit=1`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.users.length).toBe(1)
      expect(body.meta.total, 'number of users should be 12').toBeGreaterThan(10)
    })
  })
  test('Create a new user and verify it api-22', async ({ request }) => {
    const user = new UserBuilder().setDefaults().build()
    const headers = {
      'X-Task-Id': 'api-22'
    }
    await test.step(`POST new user`, async () => {
      const response = await request.post(`${baseUrl}/users`, {
        headers,
        data: user
      })
      expect(response.status(), 'HTTP status code should be 200').toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.CREATEDUSER_ID = body.uuid
      await asserUser(body, user)
    })
    await test.step(`GET created user`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.CREATEDUSER_ID}`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      await asserUser(body, user)
    })
    await test.step(`GET all users and verify created user`, async () => {
      const response = await request.get(`${baseUrl}/users`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      const createdUser = body.users.find(u => u.uuid === process.env.CREATEDUSER_ID)
      expect(createdUser).toBeDefined()
      await asserUser(createdUser, user)
    })
  })
  test(`GET a user api-23`, async ({ request }) => {
    const headers = {
      'X-Task-Id': 'api-23'
    }
    let user
    await test.step(`GET a user uuid`, async () => {
      const response = await request.get(`${baseUrl}/users`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      user = body.users[0]
    })
    await test.step(`GET user by uuid`, async () => {
      const changedId = user.uuid.slice(0, -2) + 'a1'
      const response = await request.get(`${baseUrl}/users/${changedId}`, {
        headers
      })
      expect(response.status(), 'HTTP status code should be 404').toBe(404)
    })
  })
  test(`PATCH update user profile api-24`, async ({ request }) => {
    const updatedUser = new UserBuilder().setDefaults().build()
    const headers = {
      'X-Task-Id': 'api-24'
    }
    let user
    await test.step(`GET user to update`, async () => {
      const response = await request.get(`${baseUrl}/users`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      user = body.users.at(0)
    })
    await test.step(`PATCH update user profile`, async () => {
      const response = await request.patch(`${baseUrl}/users/${user.uuid}`, {
        headers,
        data: updatedUser
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      expect(body.uuid).toBeDefined()
      process.env.UPDATED_ID = body.uuid
      await asserUser(body, updatedUser)
    })
    await test.step(`GET updated user`, async () => {
      const response = await request.get(`${baseUrl}/users/${process.env.UPDATED_ID}`, {
        headers
      })
      expect(response.status()).toBe(200)
      const body = await response.json()
      await asserUser(body, updatedUser)
    })
    await test.step(`GET all users and verify updated user`, async () => {
      const response = await request.get(`${baseUrl}/users`, { headers })
      expect(response.status()).toBe(200)
      const body = await response.json()
      const user = body.users.find(u => u.uuid === process.env.UPDATED_ID)
      expect(user).toBeDefined()
      await asserUser(user, updatedUser)
    })
  })
})
