import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { createServer } from 'http'
import compression from 'compression'
import cors from 'cors'

// Load the env vars before initializing code that depends on them
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import findOrCreateProfile from './findOrCreateProfile'
import apolloServer from './apolloServer'
import getAllFilesSync from './getAllFilesSync'

const app = express()

app.get('/profile', findOrCreateProfile)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true,
  }),
)
app.use(compression())

apolloServer.applyMiddleware({
  app,
  path: '/graphql',
  cors: false, // We use the cors plugin for this
})

const PUBLIC_DIR = path.join(__dirname, '../frontend/build')

// Serve static assets for the frontend
getAllFilesSync(PUBLIC_DIR).forEach((file: string) => {
  file = file.replace(/^[\\/A-Za-z0-9]+frontend\/build/i, '')
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
