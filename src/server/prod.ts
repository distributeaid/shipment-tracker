// tslint:disable:ordered-imports
// Note: the order of these imports matters ...
import '../loadEnv'

// Initialize the models
import '../sequelize'

// ... but not for these
import { createServer } from 'http'
import { v4 } from 'uuid'
import EventEmitter from 'events'
import { backend } from './feat/backend'
import { startExpressServer } from './feat/express'
import { setUp as setUpEmails } from './feat/emails'

const omnibus = new EventEmitter()

let cookieSecret = process.env.COOKIE_SECRET
if (cookieSecret === undefined || cookieSecret.length === 0) {
  console.warn(`Cookie secret not set, using random value.`)
  cookieSecret = v4()
}

const origin = process.env.ORIGIN
if (origin === undefined || !/^http/.test(origin)) {
  console.error(`Must set ORIGIN!`)
  process.exit(1)
}

const app = backend({
  omnibus,
  cookieSecret,
  origin,
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
