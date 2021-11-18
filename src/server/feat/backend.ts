import { json } from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import EventEmitter from 'events'
import express, { Express } from 'express'
import passport from 'passport'
import { URL } from 'url'
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
}: {
  omnibus: EventEmitter
  origin: URL
  cookieSecret: string
  version: string
}): Express => {
  const app = express()
  /**
   * @see ../docs/authentication.md
   */
  app.use(cookieParser(cookieSecret))
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

  app.post('/auth/register', registerUser(omnibus))
  app.post('/auth/register/confirm', confirmRegistrationByEmail)
  app.post('/auth/login', login)
  app.post('/auth/password/token', sendVerificationTokenByEmail(omnibus))
  app.post('/auth/password/new', setNewPasswordUsingTokenAndEmail())
  app.get('/auth/me', cookieAuth, getProfile)
  app.get('/auth/me/cookie', cookieAuth, renewCookie)
  app.delete('/auth/me/cookie', cookieAuth, deleteCookie)
  app.delete('/auth/me/reset-password', cookieAuth, changePassword())

  app.get('/auth/shipment-exports/:id', cookieAuth, sendShipmentExportCsv)

  app.use(compression())

  return app
}
