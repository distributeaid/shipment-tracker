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
import { updateTermsAndConditions } from '../routes/user/update'
import { tokenCookieRx } from './helpers/auth'

jest.setTimeout(15 * 1000)

const cookieAuth = passport.authenticate('cookie', { session: false })
passport.use(cookieAuthStrategy)

const password = '2DhE.sf!f9Z3u8x'

describe('User update API', () => {
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
    app.patch('/user/termsandcond/:id', cookieAuth, updateTermsAndConditions)
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

  const userEmail = `some-user${v4()}@example.com`
  let userId: number

  /** Create and log in admin */
  beforeAll(async () => {
    await UserAccount.create({
      email: userEmail,
      isAdmin: false, // not an admin
      name: 'Some User',
      passwordHash: hashPassword(password, 1),
      isConfirmed: true,
    })

    const user = await UserAccount.findOneByEmail(userEmail)
    if (user?.id != undefined) {
      userId = user?.id
    }
  })

  describe('users should be allowed to update its termsAndConditionsAcceptedAt', () => {
    let userAuthCookie: string
    beforeAll(async () => {
      userAuthCookie = await getCookieForUserAccount({
        email: userEmail,
        password,
      })
    })
    test('probaj-ovo', () =>
      r
        .patch(`/user/termsandcond/${userId as number}`)
        .set('Cookie', [`${authCookieName}=${userAuthCookie}`])
        .send({
          termsAndConditionsAcceptedAt: new Date(),
        })
        .expect(HTTPStatusCode.NoContent))
    test('users should not be allowed to update other users termsAndConditionsAcceptedAt', () =>
      r
        .patch('/user/termsandcond/999')
        .set('Cookie', [`${authCookieName}=${userAuthCookie}`])
        .send({
          termsAndConditionsAcceptedAt: new Date(),
        })
        .expect(HTTPStatusCode.Forbidden))
  })
})
