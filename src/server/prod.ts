import EventEmitter from 'events'
import { static as staticWebsite } from 'express'
import { createServer } from 'http'
import path from 'path'
import { URL } from 'url'
import { v4 } from 'uuid'
import '../sequelize'
import { backend } from './feat/backend'
import { setUp as setUpEmails } from './feat/emails'
import { startExpressServer } from './feat/express'

const version = process.env.COMMIT_ID ?? '0.0.0-development'
console.debug(`Launching version ${version}`)

const omnibus = new EventEmitter()

let cookieSecret = process.env.COOKIE_SECRET
if (cookieSecret === undefined || cookieSecret.length === 0) {
  console.warn(`Cookie secret not set, using random value.`)
  cookieSecret = v4()
}

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
  cookieSecret,
  origin,
  version,
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
app.use(staticWebsite(path.join(process.cwd(), 'frontend', 'build')))
// All other requests are handled by the index.html
const spaIndex = path.join(process.cwd(), 'frontend', 'build', 'index.html')
app.get('*', function (_, res) {
  res.sendFile(spaIndex)
})
