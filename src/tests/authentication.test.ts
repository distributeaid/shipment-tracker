import { json } from 'body-parser'
import cookieParser from 'cookie-parser'
import EventEmitter from 'events'
import express, { Express } from 'express'
import { createServer, Server } from 'http'
import passport from 'passport'
import request, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'
import {
  authCookieName,
  cookieAuthStrategy,
  decodeAuthCookie,
} from '../authenticateRequest'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'
import { HTTPStatusCode } from '../rest/response/HttpStatusCode'
import login from '../routes/login'
import getProfile from '../routes/me'
import { deleteCookie, renewCookie } from '../routes/me/cookie'
import resetPassword from '../routes/me/password'
import setNewPasswordUsingTokenAndEmail from '../routes/password/new'
import sendVerificationTokenByEmail from '../routes/password/token'
import registerUser, { hashPassword } from '../routes/register'
import confirmRegistration from '../routes/register/confirm'

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

const email = `${v4()}@example.com`
const password = 'y{uugBmw"9,?=L_'
const omnibus = new EventEmitter()

describe('User account API', () => {
  let app: Express
  let httpServer: Server
  let r: SuperTest<Test>

  let authCookie: string
  beforeAll(async () => {
    app = express()
    app.use(cookieParser(process.env.COOKIE_SECRET ?? 'cookie-secret'))
    app.use(json())
    app.post('/register', registerUser(omnibus, 1))
    app.post('/register/confirm', confirmRegistration)
    app.post('/login', login)
    app.post('/password/token', sendVerificationTokenByEmail(omnibus))
    app.post('/password/new', setNewPasswordUsingTokenAndEmail(1))
    app.get('/me', cookieAuth, getProfile)
    app.post('/me/password', cookieAuth, resetPassword(1))
    app.get('/me/cookie', cookieAuth, renewCookie)
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
        .set('Content-type', 'application/json; charset=utf-8')
        .send({
          email,
          password,
          name: 'Alex',
        })
        .expect(HTTPStatusCode.Accepted)
    })
    it.each([
      [email],
      [
        email.toUpperCase(), // emails are case-insensitive
      ],
    ])('should not allow to register with the same email (%s) twice', (email) =>
      r
        .post('/register')
        .set('Content-type', 'application/json; charset=utf-8')
        .send({
          email,
          password: 'R";%A:6mUVRst[Qq',
          name: 'Alex 2',
        })
        .expect(HTTPStatusCode.Conflict, {
          title: `User with email ${email} already registered!`,
          status: HTTPStatusCode.Conflict,
        }),
    )
    describe('/register/confirm', () => {
      test('new accounts should not be able to log in', () =>
        r
          .post('/login')
          .send({
            email,
            password,
          })
          .expect(HTTPStatusCode.Forbidden, {
            title: `User with email ${email} is not confirmed!`,
            status: HTTPStatusCode.Forbidden,
          }))
      it('should confirm a user account with a token and an email', async () => {
        // Get token for email
        const token = await VerificationToken.findOne({
          where: {
            userAccountId: (await UserAccount.findOneByEmail(email))?.id,
          },
        })
        expect(token).not.toBeUndefined()
        return r
          .post('/register/confirm')
          .set('Content-type', 'application/json; charset=utf-8')
          .send({
            email,
            token: token?.token,
          })
          .expect(HTTPStatusCode.Accepted)
      })
    })
  })
  describe('/login', () => {
    it('should return a token on login', async () => {
      const res = await r
        .post('/login')
        .send({
          email,
          password,
        })
        .expect(HTTPStatusCode.NoContent)
        .expect('set-cookie', tokenCookieRx)

      const cookieInfo = parseCookie(res.header['set-cookie'][0] as string)
      expect(cookieInfo[authCookieName]).toBeDefined()
      expect(cookieInfo.options).toMatchObject({
        Path: '/',
        HttpOnly: true,
        SameSite: 'None',
      })
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
        .expect(HTTPStatusCode.Unauthorized, {
          title: `Provided password did not match.`,
          status: HTTPStatusCode.Unauthorized,
        }))
    it('should fail with user not found', () =>
      r
        .post('/login')
        .send({
          email: 'foo@example.com',
          password: "Y<N-'#sQ2/RCrN_c",
        })
        .expect(HTTPStatusCode.NotFound, {
          title: `User with email foo@example.com not found!`,
          status: HTTPStatusCode.NotFound,
        }))
    it('should set the isAdmin flag in the cookie to false for users', () =>
      expect(
        decodeAuthCookie(decodeURIComponent(authCookie.split('.')[0]).substr(2))
          .isAdmin,
      ).toBeFalse())
    it('should set the isAdmin flag in the cookie to true for admins', async () => {
      const adminEmail = `some-admin${v4()}@example.com`
      await UserAccount.create({
        email: adminEmail,
        isAdmin: true,
        isConfirmed: true,
        name: 'Some Admin',
        passwordHash: hashPassword('2DhE.sf!f9Z3u8x', 1),
      })

      const res = await r
        .post('/login')
        .send({
          email: adminEmail,
          password: '2DhE.sf!f9Z3u8x',
        })
        .expect(HTTPStatusCode.NoContent)
        .expect('set-cookie', tokenCookieRx)

      expect(
        decodeAuthCookie(
          decodeURIComponent(
            (tokenCookieRx.exec(res.header['set-cookie'])?.[1] as string).split(
              '.',
            )[0],
          ).substr(2),
        ).isAdmin,
      ).toBeTrue()
    })
  })
  describe('/me', () => {
    it('should return the user account of the current user', async () => {
      const res = await r
        .get('/me')
        .set('Cookie', [`${authCookieName}=${authCookie}`])
        .set('Accept', 'application/json')
        .send()
        .expect(HTTPStatusCode.OK)
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
        .expect(HTTPStatusCode.Unauthorized)) // FIXME: set response body in CookieStrategy
    describe('/me/cookie', () => {
      it('should send a new cookie', () =>
        r
          .get('/me/cookie')
          .set('Cookie', [`${authCookieName}=${authCookie}`])
          .expect(HTTPStatusCode.NoContent))
      it('should delete a cookie', async () => {
        const res = await r
          .delete('/me/cookie')
          .set('Cookie', [`${authCookieName}=${authCookie}`])
          .expect(HTTPStatusCode.NoContent)
        const cookieInfo = parseCookie(res.header['set-cookie'][0] as string)
        expect(cookieInfo[authCookieName]).toBeDefined()
        expect(cookieInfo.options).toMatchObject({
          Path: '/',
          HttpOnly: true,
          SameSite: 'None',
        })
        const expiresIn =
          new Date(cookieInfo.options.Expires).getTime() - Date.now()
        expect(expiresIn).toBeLessThan(0) // Expires is in the past
      })
    })
    describe('/me/password', () => {
      const newPassword = 'H`2h?)Z<F-Z.3gYT'
      describe('as a logged-in user', () => {
        it('should change a users password if they know the current password', () =>
          r
            .post('/me/password')
            .set('Content-type', 'application/json; charset=utf-8')
            .set('Cookie', [`${authCookieName}=${authCookie}`])
            .send({
              currentPassword: password,
              newPassword,
            })
            .expect(HTTPStatusCode.NoContent)
            .expect('set-cookie', tokenCookieRx))
        test('log-in with new password', () =>
          r
            .post('/login')
            .send({
              email,
              password: newPassword,
            })
            .expect(HTTPStatusCode.NoContent))
        it('should not change a users password if they do not know the current password', () =>
          r
            .post('/me/password')
            .set('Content-type', 'application/json; charset=utf-8')
            .set('Cookie', [`${authCookieName}=${authCookie}`])
            .send({
              currentPassword: `some password`,
              newPassword: 'H`2h?)Z<F-Z.3gYT',
            })
            .expect(HTTPStatusCode.BadRequest, {
              title: 'Input validation failed',
              status: HTTPStatusCode.BadRequest,
              detail: `The value provided for "/currentPassword" was invalid: it must match pattern "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$".`,
            }))
      })
      describe('using an email token', () => {
        let token: string
        const newPasswordWithToken = "8>5_TZ?'hH9xd}Z7:"
        it('should create a password reset token', async () => {
          await r
            .post('/password/token')
            .set('Content-type', 'application/json; charset=utf-8')
            .send({
              email,
            })
            .expect(HTTPStatusCode.Accepted)

          // Get token for email
          const t = await VerificationToken.findOne({
            where: {
              userAccountId: (await UserAccount.findOneByEmail(email))?.id,
            },
          })
          expect(t).not.toBeUndefined()
          token = t!.token
        })
        it('should reset the password using the token', () =>
          r
            .post('/password/new')
            .set('Content-type', 'application/json; charset=utf-8')
            .send({
              email,
              newPassword: newPasswordWithToken,
              token,
            })
            .expect(HTTPStatusCode.OK))
        it('should not change a users password if they do not know the right token', async () => {
          expect(token).not.toEqual('000000') // Could fail sometimes, we use this as a test case here
          return r
            .post('/password/new')
            .set('Content-type', 'application/json; charset=utf-8')
            .send({
              email,
              newPassword: newPasswordWithToken,
              token: '000000',
            })
            .expect(HTTPStatusCode.Unauthorized, {
              title: `User with email ${email} and token 000000 not found!`,
              status: HTTPStatusCode.Unauthorized,
            })
        })

        test('log-in with new password', () =>
          r
            .post('/login')
            .send({
              email,
              password: newPasswordWithToken,
            })
            .expect(HTTPStatusCode.NoContent))
      })
    })
  })
})
