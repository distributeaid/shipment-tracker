// tslint:disable:ordered-imports
import express, { Express } from 'express'
import { createServer, Server } from 'http'
import passport from 'passport'
import request, { SuperTest, Test } from 'supertest'
import '../sequelize'
import { authCookieName, cookieAuthStrategy } from '../authenticateRequest'
import getProfile from '../routes/me'
import cookieParser from 'cookie-parser'
import { json } from 'body-parser'
import registerUser from '../routes/register'
import login from '../routes/login'
import { renewCookie, deleteCookie } from '../routes/me/cookie'
import { v4 } from 'uuid'
import resetPassword from '../routes/reset-password'

jest.setTimeout(15 * 1000)

const cookieAuth = passport.authenticate('cookie', { session: false })
passport.use(cookieAuthStrategy)

const tokenCookieRx = new RegExp(`${authCookieName}=([^;]+);`, 'i')

const parseCookie = (cookie: string) =>
  cookie
    .split('; ')
    .map((s) => s.split('=', 2))
    .reduce(
      (c, [k, v], i) =>
        i === 0
          ? {
              [decodeURIComponent(k)]: v ? decodeURIComponent(v) : true,
            }
          : {
              ...c,
              options: {
                ...c.options,
                [decodeURIComponent(k)]: v ? decodeURIComponent(v) : true,
              },
            },
      {} as Record<string, any>,
    )

describe('User account API', () => {
  let app: Express
  let httpServer: Server
  let r: SuperTest<Test>
  let email: string
  let password: string
  let authCookie: string
  beforeAll(async () => {
    email = `${v4()}@example.com`
    password = 'y{uugBmw"9,?=L_'
    app = express()
    app.use(cookieParser(process.env.COOKIE_SECRET ?? 'cookie-secret'))
    app.use(json())
    app.get('/me', cookieAuth, getProfile)
    app.post('/register', registerUser(1))
    app.post('/reset-password', cookieAuth, resetPassword(1))
    app.post('/login', login(0))
    app.get('/me/cookie', cookieAuth, renewCookie(0))
    app.delete('/me/cookie', cookieAuth, deleteCookie)
    httpServer = createServer(app)
    await new Promise<void>((resolve) =>
      httpServer.listen(8888, '127.0.0.1', undefined, resolve),
    )
    r = request('http://127.0.0.1:8888')
  })
  afterAll(async () => {
    httpServer.close()
  })
  describe('/register', () => {
    it('should register a new user account', async () => {
      const res = await r
        .post('/register')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json; charset=utf-8')
        .send({
          email,
          password,
          name: 'Alex',
        })
        .expect(202)
    })
    /**
     * In case someone tries to register with the same email,
     * we also return a 202 (accepted), although silently we will
     * register an account.
     *
     * This is to not allow an attacker to figure out which email
     * addresses are used in the system.
     */
    it('should not allow to register with the same email twice', () =>
      r
        .post('/register')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json; charset=utf-8')
        .send({
          email,
          password: 'R";%A:6mUVRst[Qq',
          name: 'Alex 2',
        })
        .expect(202))
  })
  describe('/login', () => {
    it('should return a token on login', async () => {
      const res = await r
        .post('/login')
        .send({
          email,
          password,
        })
        .expect(204)
        .expect('set-cookie', tokenCookieRx)

      const cookieInfo = parseCookie(res.header['set-cookie'][0] as string)
      expect(cookieInfo[authCookieName]).toBeDefined()
      expect(cookieInfo.options).toMatchObject({ Path: '/', HttpOnly: true })
      const expiresIn =
        new Date(cookieInfo.options.Expires).getTime() - Date.now()
      expect(expiresIn).toBeLessThan(30 * 60 * 1000)
      expect(expiresIn).toBeGreaterThan(0)

      authCookie = tokenCookieRx.exec(res.header['set-cookie'])?.[1] as string
    })
    it('should fail with invalid password', () =>
      r
        .post('/login')
        .send({
          email,
          password: "Y<N-'#sQ2/RCrN_c",
        })
        .expect(401))
    it('should fail with user not found', () =>
      r
        .post('/login')
        .send({
          email: 'foo@example.com',
          password: "Y<N-'#sQ2/RCrN_c",
        })
        .expect(401))
  })
  describe('/me', () => {
    it('should return the user account of the current user', async () => {
      const res = await r
        .get('/me')
        .set('Cookie', [`${authCookieName}=${authCookie}`])
        .set('Accept', 'application/json')
        .send()
        .expect(200)
      expect(res.body).toMatchObject({
        id: /[0-9]+/,
        email,
        isAdmin: false,
      })
    })
    it('should deny request for unknown token', async () =>
      r
        .get('/me')
        .set('Cookie', [`${authCookieName}=foo`])
        .send()
        .expect(401))
    describe('/cookie', () => {
      it('should send a new cookie', () =>
        r
          .get('/me/cookie')
          .set('Cookie', [`${authCookieName}=${authCookie}`])
          .expect(204))
      it('should delete a cookie', async () => {
        const res = await r
          .delete('/me/cookie')
          .set('Cookie', [`${authCookieName}=${authCookie}`])
          .expect(204)
        const cookieInfo = parseCookie(res.header['set-cookie'][0] as string)
        expect(cookieInfo[authCookieName]).toBeDefined()
        expect(cookieInfo.options).toMatchObject({ Path: '/', HttpOnly: true })
        const expiresIn =
          new Date(cookieInfo.options.Expires).getTime() - Date.now()
        expect(expiresIn).toBeLessThan(0) // Expires is in the past
      })
    })
  })
  describe('/reset-password', () => {
    const newPassword = 'H`2h?)Z<F-Z.3gYT'
    it('should change a users password if they know the current password', () =>
      r
        .post('/reset-password')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json; charset=utf-8')
        .set('Cookie', [`${authCookieName}=${authCookie}`])
        .send({
          currentPassword: password,
          newPassword,
        })
        .expect(204)
        .expect('set-cookie', tokenCookieRx))
    test('log-in with new password', () =>
      r
        .post('/login')
        .send({
          email,
          password: newPassword,
        })
        .expect(204))
    it('should not change a users password if they do not know the current password', () =>
      r
        .post('/reset-password')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json; charset=utf-8')
        .set('Cookie', [`${authCookieName}=${authCookie}`])
        .send({
          currentPassword: `some password`,
          newPassword: 'H`2h?)Z<F-Z.3gYT',
        })
        .expect(400))
  })
})
