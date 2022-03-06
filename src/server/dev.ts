import EventEmitter from 'events'
import { createServer } from 'http'
import { URL } from 'url'
import { events } from '../events'
import UserAccount from '../models/user_account'
import '../sequelize'
import { backend } from './feat/backend'
import { setUp as setUpEmails } from './feat/emails'
import { frontend } from './feat/frontend'
import { startApolloServer } from './feat/graphql'

const omnibus = new EventEmitter()

const origin = new URL(process.env.ORIGIN || 'http://localhost:8080')

const app = backend({
  omnibus,
  cookieSecret: process.env.COOKIE_SECRET,
  cookieLifetimeSeconds:
    process.env.COOKIE_LIFETIME_SECONDS === undefined
      ? 1800
      : parseInt(process.env.COOKIE_LIFETIME_SECONDS, 10),
  origin,
  version: 'development',
  generateToken: () => '123456',
})

startApolloServer(app)

const httpServer = createServer(app)
const port = parseInt(process.env.PORT ?? '3000', 10)
httpServer.listen({ port }, (): void => {
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:${port}/graphql`,
  )
  console.log(`🚀      Origin is ${origin}`)
})

// Configure email sending
setUpEmails(omnibus)

// Host web application
frontend(app)

// Make all distributeAid users admins
omnibus.on(events.user_registered, async (user: UserAccount) => {
  if (user.email.endsWith('@admin.example.com')) {
    await user.update({ isAdmin: true })
    console.debug(`Granted admin permissions to ${user.email}.`)
  }
})
