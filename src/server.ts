import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import compression from 'compression'
import cors from 'cors'

dotenv.config()

import apolloServer from './apolloServer'

const app = express()
app.use('*', cors())
app.use(compression())

apolloServer.applyMiddleware({ app, path: '/graphql' })

const httpServer = createServer(app)

httpServer.listen({ port: 3000 }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:3000/graphql`,
  ),
)
