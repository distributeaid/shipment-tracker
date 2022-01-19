import { Express } from 'express'
import apolloServer from '../../apolloServer'

export const startApolloServer = async (app: Express) => {
  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // We use the cors plugin for this
  })
}
