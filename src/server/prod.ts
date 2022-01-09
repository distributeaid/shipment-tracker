import EventEmitter from 'events'
import { createServer } from 'http'
import { URL } from 'url'
import '../sequelize'
import { backend } from './feat/backend'
import { setUp as setUpEmails } from './feat/emails'
import { startExpressServer } from './feat/express'
import { frontend } from './feat/frontend'

const version = process.env.COMMIT_ID ?? '0.0.0-development'
console.debug(`Launching version ${version}`)

const omnibus = new EventEmitter()

let origin: URL
try {
  origin = new URL(process.env.ORIGIN ?? '')
} catch (err) {
  console.error(
    `Must set ORIGIN, current value is not a URL: "${process.env.ORIGIN}": ${
      (err as Error).message
    }!`,
  )
  process.exit(1)
}

const app = backend({
  omnibus,
  origin,
  version,
  cookieSecret: process.env.COOKIE_SECRET,
  cookieLifetimeSeconds:
    process.env.COOKIE_LIFETIME_SECONDS !== undefined
      ? parseInt(process.env.COOKIE_LIFETIME_SECONDS, 10)
      : undefined,
})

startExpressServer(app)

const httpServer = createServer(app)
const port = parseInt(process.env.PORT ?? '8080', 10)
httpServer.listen(port, '0.0.0.0', (): void => {
  console.debug(`Listening on port ${port}`)
  console.debug(`Origin`, origin)
})

// Configure email sending
setUpEmails(omnibus)

// Host web application
frontend(app)
