// tslint:disable:ordered-imports
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'

// Initialize the models, before starting the apollo server
import './sequelize'

import apolloServer from './apolloServer'
import findOrCreateProfile from './findOrCreateProfile'
import sendShipmentExportCsv from './sendShipmentExportCsv'

const app = express()

app.get('/profile', findOrCreateProfile)
app.get('/shipment-exports/:id', sendShipmentExportCsv)

app.use(
  cors({
    origin: process.env.WEB_APP_URL || 'http://localhost:8080',
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

const httpServer = createServer(app)

const port = parseInt(process.env.PORT ?? '8080', 10)

httpServer.listen(port, '0.0.0.0', undefined, (): void =>
  console.log(`Sever listening on port ${port}`),
)
