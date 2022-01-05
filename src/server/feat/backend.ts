import { json } from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import EventEmitter from 'events'
import express, { Express } from 'express'
import passport from 'passport'
import { URL } from 'url'
import { v4 } from 'uuid'
import { cookieAuthStrategy } from '../../authenticateRequest'
import login from '../../routes/login'
import getProfile from '../../routes/me'
import { deleteCookie, renewCookie } from '../../routes/me/cookie'
import changePassword from '../../routes/me/password'
import setNewPasswordUsingTokenAndEmail from '../../routes/password/new'
import sendVerificationTokenByEmail from '../../routes/password/token'
import registerUser from '../../routes/register'
import confirmRegistrationByEmail from '../../routes/register/confirm'
import sendShipmentExportCsv from '../../sendShipmentExportCsv'
import { addRequestId } from '../addRequestId'
import { addVersion } from '../addVersion'

export const backend = ({
  omnibus,
  cookieSecret,
  origin,
  version,
  generateToken,
}: {
  omnibus: EventEmitter
  origin: URL
  cookieSecret?: string
  version: string
  /**
   * This functions is used to generate confirmation tokens send to users to validate their email addresses.
   */
  generateToken?: () => string
}): Express => {
  const app = express()
  /**
   * @see ../docs/authentication.md
   */
  if (cookieSecret === undefined) {
    console.warn(`⚠️ Cookie secret not set, using random value.`)
  }
  app.use(cookieParser(cookieSecret ?? v4()))
  app.use(json())
  app.use(passport.initialize())
  const cookieAuth = passport.authenticate('cookie', { session: false })
  passport.use(cookieAuthStrategy)

  app.use(
    cors({
      origin: `${origin.protocol}//${origin.host}`,
      credentials: true,
    }),
  )

  app.use(addVersion(version))
  app.use(addRequestId)

  app.post('/auth/register', registerUser(omnibus, undefined, generateToken))
  app.post('/auth/register/confirm', confirmRegistrationByEmail)
  app.post('/auth/login', login)
  app.post(
    '/auth/password/token',
    sendVerificationTokenByEmail(omnibus, generateToken),
  )
  app.post('/auth/password/new', setNewPasswordUsingTokenAndEmail())
  app.get('/auth/me', cookieAuth, getProfile)
  app.get('/auth/me/cookie', cookieAuth, renewCookie)
  app.delete('/auth/me/cookie', cookieAuth, deleteCookie)
  app.delete('/auth/me/reset-password', cookieAuth, changePassword())

  app.get('/auth/shipment-exports/:id', cookieAuth, sendShipmentExportCsv)

  app.use(compression())

  return app
}
