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
import getProfile from './getProfile'
import getAllFilesSync from './getAllFilesSync'
import sendShipmentExportCsv from './sendShipmentExportCsv'
import { cookieAuthStrategy } from './authenticateRequest'
import registerUser from './registerUser'
import login from './login'

const app = express()
app.use(cookieParser(process.env.COOKIE_SECRET ?? 'cookie-secret'))
app.use(json())
const cookieAuth = passport.authenticate('cookie', { session: false })
passport.use(cookieAuthStrategy)

app.get('/me', cookieAuth, getProfile)
app.get('/login', login())
app.get('/user', registerUser)
app.get('/shipment-exports/:id', cookieAuth, sendShipmentExportCsv)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true,
  }),
)
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
