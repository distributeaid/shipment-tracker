// tslint:disable:ordered-imports
// Note: the order of these imports matters ...
import '../loadEnv'

// Initialize the models
import '../sequelize'

// ... but not for these
import { createServer } from 'http'
import path from 'path'
import getAllFilesSync from '../getAllFilesSync'
import { v4 } from 'uuid'
import EventEmitter from 'events'
import { backend } from './feat/backend'
import { startExpressServer } from './feat/express'
import { setUp as setUpEmails } from './feat/emails'
import { URL } from 'url'

const omnibus = new EventEmitter()

const app = backend({
  omnibus,
  cookieSecret: process.env.COOKIE_SECRET ?? v4(),
  origin: new URL(process.env.CLIENT_URL || 'http://localhost:8080'),
})

startExpressServer(app)

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
const port = parseInt(process.env.PORT ?? '3000', 10)
httpServer.listen({ port }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:${port}/graphql`,
  ),
)

// Configure email sending
setUpEmails(omnibus)
