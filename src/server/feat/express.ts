import { Express } from 'express'
import apolloServer from '../../apolloServer'

export const startExpressServer = async (app: Express) => {
  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // We use the cors plugin for this
  })
}
