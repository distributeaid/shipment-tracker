import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import compression from 'compression'
import cors from 'cors'

// Load the env vars before initializing code that depends on them
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import findOrCreateProfile from './findOrCreateProfile'
import apolloServer from './apolloServer'

const app = express()

app.get('/profile', findOrCreateProfile)

app.use(express.static('frontend/build'))

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

const httpServer = createServer(app)

const port = process.env.PORT || 3000

httpServer.listen({ port }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:${port}/graphql`,
  ),
)
