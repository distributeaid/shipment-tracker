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

  app.post('/register', registerUser(omnibus))
  app.post('/register/confirm', confirmRegistrationByEmail)
  app.post('/login', login)
  app.post('/password/token', sendVerificationTokenByEmail(omnibus))
  app.post('/password/new', setNewPasswordUsingTokenAndEmail())
  app.get('/me', cookieAuth, getProfile)
  app.post('/me/cookie', cookieAuth, renewCookie)
  app.delete('/me/cookie', cookieAuth, deleteCookie)
  app.delete('/me/reset-password', cookieAuth, changePassword())

  app.get('/shipment-exports/:id', cookieAuth, sendShipmentExportCsv)

  app.use(compression())

  return app
}
