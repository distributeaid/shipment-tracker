// tslint:disable:ordered-imports
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { json } from 'body-parser'

// Note: the order of these imports matters!
import './loadEnv'

// Initialize the models
import './sequelize'

import apolloServer from './apolloServer'
import getProfile from './routes/me'
import getAllFilesSync from './getAllFilesSync'
import sendShipmentExportCsv from './sendShipmentExportCsv'
import { cookieAuthStrategy } from './authenticateRequest'
import registerUser from './routes/register'
import login from './routes/login'
import { v4 } from 'uuid'
import { renewCookie, deleteCookie } from './routes/me/cookie'
import changePassword from './routes/me/password'
import sendVerificationTokenByEmail from './routes/password/token'
import setNewPasswordUsingTokenAndEmail from './routes/password/new'
import confirmRegistrationByEmail from './routes/register/confirm'
import EventEmitter from 'events'
import { consoleMailer } from './mailer/console'
import { appMailer, transportFromConfig } from './mailer/nodemailer'
import { captchaCheck } from './friendlyCaptcha'

const omnibus = new EventEmitter()

const app = express()
/**
 * @see ./docs/authentication.md
 */
app.use(cookieParser(process.env.COOKIE_SECRET ?? v4()))
app.use(json())
const cookieAuth = passport.authenticate('cookie', { session: false })
passport.use(cookieAuthStrategy)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true,
  }),
)

const friendlyCaptchApiKey = process.env.FRIENDLYCAPTCHA_API_KEY as string
const checkCaptcha = captchaCheck(friendlyCaptchApiKey)

app.post('/register', checkCaptcha, registerUser(omnibus))
app.post('/register/confirm', checkCaptcha, confirmRegistrationByEmail)
app.post('/login', checkCaptcha, login)
app.post('/password/token', checkCaptcha, sendVerificationTokenByEmail)
app.post('/password/new', setNewPasswordUsingTokenAndEmail())
app.get('/me', cookieAuth, getProfile)
app.post('/me/cookie', cookieAuth, renewCookie)
app.delete('/me/cookie', cookieAuth, deleteCookie)
app.delete('/me/reset-password', cookieAuth, changePassword())

app.get('/shipment-exports/:id', cookieAuth, sendShipmentExportCsv)

app.use(compression())

async function startExpressServer() {
  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // We use the cors plugin for this
  })
}

startExpressServer()

const PUBLIC_DIR = path.join(__dirname, '../frontend/build')

// Serve static assets for the frontend
getAllFilesSync(PUBLIC_DIR).forEach((file: string) => {
  app.get(file, (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, file))
  })
})

// Serve the browser client for any other path
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'))
})

const httpServer = createServer(app)

const port = process.env.PORT || 3000

httpServer.listen({ port }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:${port}/graphql`,
  ),
)

// Configure email sending
const emailDebug = (...args: any) => console.debug('[email]', ...args)
const maybeTransportConfig = transportFromConfig(emailDebug)
if (maybeTransportConfig !== undefined) {
  appMailer(omnibus, maybeTransportConfig, emailDebug)
} else {
  consoleMailer(omnibus, emailDebug)
}
