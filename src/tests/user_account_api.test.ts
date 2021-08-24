// tslint:disable:ordered-imports
import { randomWords } from '@nordicsemiconductor/random-words'
import express, { Express } from 'express'
import { createServer, Server } from 'http'
import passport from 'passport'
import request, { SuperTest, Test } from 'supertest'
import '../sequelize'
import { authTokenCookieName, cookieAuthStrategy } from '../authenticateRequest'
import getProfile from '../getProfile'
import cookieParser from 'cookie-parser'
import { json } from 'body-parser'
import registerUser from '../registerUser'
import login from '../login'

jest.setTimeout(60 * 1000)

const cookieAuth = passport.authenticate('cookie', { session: false })
passport.use(cookieAuthStrategy)

const tokenCookieRx = new RegExp(`${authTokenCookieName}=([^;]+); Path=/`)

const generateUsername = async () =>
  (await randomWords({ numWords: 3 })).join('-')

describe('User account API', () => {
  let app: Express
  let httpServer: Server
  let r: SuperTest<Test>
  let username: string
  let password: string
  let token: string
  beforeAll(async () => {
    username = await generateUsername()
    password = 'y{uugBmw"9,?=L_'
    app = express()
    app.use(cookieParser(process.env.COOKIE_SECRET ?? 'cookie-secret'))
    app.use(json())
    app.get('/me', cookieAuth, getProfile)
    app.post('/user', registerUser(1))
    app.post('/login', login(0))
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
        .post('/user')
        .set('Accept', 'application/json')
        .set('Content-type', 'application/json; charset=utf-8')
        .send({
          username,
          password,
        })
        .expect(202)
        .expect('set-cookie', tokenCookieRx)

      token = tokenCookieRx.exec(res.header['set-cookie'])?.[1] as string
    })
  })
  describe('/me', () => {
    it('should return the user account of the current user', async () => {
      const res = await r
        .get('/me')
        .set('Cookie', [`${authTokenCookieName}=${token}`])
        .set('Accept', 'application/json')
        .send()
        .expect(200)
      expect(res.body).toMatchObject({
        id: /[0-9]+/,
        username,
        isAdmin: false,
      })
    })
    it('should deny request for unknown token', async () =>
      r
        .get('/me')
        .set('Cookie', [`${authTokenCookieName}=foo`])
        .send()
        .expect(401))
  })
  describe('/login', () => {
    it('should return a token on login', () =>
      r
        .post('/login')
        .send({
          username,
          password,
        })
        .expect(204)
        .expect('set-cookie', tokenCookieRx))
    it('should fail with invalid password', () =>
      r
        .post('/login')
        .send({
          username,
          password: 'foo',
        })
        .expect(401))
    it('should fail with user not found', () =>
      r
        .post('/login')
        .send({
          username: 'foo',
          password: 'foo',
        })
        .expect(401))
  })
})
