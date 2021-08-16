import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import apolloServer from './apolloServer'
import findOrCreateProfile from './findOrCreateProfile'
import sendShipmentExportCsv from './sendShipmentExportCsv'
import './sequelize'

const app = express()

app.get('/profile', findOrCreateProfile)
app.get('/shipment-exports/:id', sendShipmentExportCsv)

app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:8080',
    credentials: true,
  }),
)

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

const port = parseInt(process.env.PORT ?? '3000', 10)

httpServer.listen(port, '0.0.0.0', undefined, (): void =>
  console.log(`Listening on port ${port}`),
)
