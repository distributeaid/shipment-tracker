import { json } from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { Express } from 'express'
import { createServer, Server } from 'http'
import passport from 'passport'
import request, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'
import {
  authCookie as getAuthCookie,
  authCookieName,
  cookieAuthStrategy,
} from '../authenticateRequest'
import UserAccount from '../models/user_account'
import { HTTPStatusCode } from '../rest/response/HttpStatusCode'
import login from '../routes/login'
import { hashPassword } from '../routes/register'
import { adminUpdateUser } from '../routes/user/update'
import { adminListUsers } from '../routes/users'
import { tokenCookieRx } from './helpers/auth'

jest.setTimeout(15 * 1000)

const cookieAuth = passport.authenticate('cookie', { session: false })
passport.use(cookieAuthStrategy)

const password = '2DhE.sf!f9Z3u8x'

describe('User admin API', () => {
  let app: Express
  let httpServer: Server
  let r: SuperTest<Test>

  const getExpressCookie = getAuthCookie(1800)

  beforeAll(async () => {
    app = express()
    app.use(cookieParser(process.env.COOKIE_SECRET ?? 'cookie-secret'))
    app.use(json())
    app.use(passport.initialize())
    app.post('/auth/login', login(getExpressCookie))
    app.get('/users', cookieAuth, adminListUsers)
    app.patch('/user/:id', cookieAuth, adminUpdateUser)
    httpServer = createServer(app)
    await new Promise<void>((resolve) =>
      httpServer.listen(8888, '127.0.0.1', undefined, resolve),
    )
    r = request('http://127.0.0.1:8888')
  })
  afterAll(async () => {
    httpServer.close()
  })

  const getCookieForUserAccount = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    const res = await r
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(HTTPStatusCode.NoContent)
      .expect('set-cookie', tokenCookieRx)

    return tokenCookieRx.exec(res.header['set-cookie'])?.[1] as string
  }

  const adminEmail = `some-admin${v4()}@example.com`
  const userEmail = `some-user${v4()}@example.com`

  /** Create and log in admin */
  beforeAll(async () => {
    await UserAccount.create({
      email: adminEmail,
      isAdmin: true,
      name: 'Some Admin',
      passwordHash: hashPassword(password, 1),
      isConfirmed: true,
    })
    await UserAccount.create({
      email: userEmail,
      isAdmin: false, // not an admin
      name: 'Some User',
      passwordHash: hashPassword(password, 1),
    })
  })

  let userId: number
  describe('GET /users', () => {
    test('admins should be allowed to list all users', async () => {
      const adminAuthCookie = await getCookieForUserAccount({
        email: adminEmail,
        password,
      })
      const res = await r
        .get('/users')
        .set('Cookie', [`${authCookieName}=${adminAuthCookie}`])
        .set('Accept', 'application/json')
        .send()
        .expect(HTTPStatusCode.OK)
      const usersList = res.body as UserAccount[]
      const adminInList = usersList.find(({ email }) => email === adminEmail)
      const userInList = usersList.find(({ email }) => email === userEmail)
      expect(adminInList).not.toBeUndefined()
      expect(userInList).not.toBeUndefined()
      expect(userInList?.isConfirmed).toEqual(false)
      expect(userInList?.id).not.toBeUndefined()
      userId = userInList?.id as number
    })
  })
  describe('PATCH /user', () => {
    test('admin should be allowed to edit users', async () => {
      // Initially the user is not confirmed
      expect((await UserAccount.findByPk(userId))?.isConfirmed).toEqual(false)
      // Confirm the user
      const adminAuthCookie = await getCookieForUserAccount({
        email: adminEmail,
        password,
      })
      await r
        .patch(`/user/${userId as number}`)
        .set('Cookie', [`${authCookieName}=${adminAuthCookie}`])
        .send({
          isConfirmed: true,
        })
        .expect(HTTPStatusCode.NoContent)
      // Now the user is confirmed
      expect((await UserAccount.findByPk(userId))?.isConfirmed).toEqual(true)
    })
  })
  describe('users should be forbidden to use the admin APIs', () => {
    let userAuthCookie: string
    beforeAll(async () => {
      userAuthCookie = await getCookieForUserAccount({
        email: userEmail,
        password,
      })
    })
    test('users should not be allowed to list all users', () =>
      r
        .get('/users')
        .set('Cookie', [`${authCookieName}=${userAuthCookie}`])
        .send()
        .expect(HTTPStatusCode.Forbidden))
    test('users should not be allowed to edit users', () =>
      r
        .patch(`/user/${userId as number}`)
        .set('Cookie', [`${authCookieName}=${userAuthCookie}`])
        .send({
          isConfirmed: true,
        })
        .expect(HTTPStatusCode.Forbidden))
  })
})
