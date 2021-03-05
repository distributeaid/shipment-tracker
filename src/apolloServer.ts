import {
  ApolloServer,
  ApolloServerExpressConfig,
  AuthenticationError,
} from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'

import resolvers from './resolvers'
import typeDefs from './typeDefs'
import { Auth, authenticateRequest } from './authenticateRequest'

export type Context = {
  auth: Auth
}

export const serverConfig: ApolloServerExpressConfig = {
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
  async context({ req }): Promise<Context> {
    const auth = await authenticateRequest(req)

    if (auth.userAccount == null) {
      throw new AuthenticationError(
        `No user account found for profile ${auth.claims.sub}`,
      )
    }

    return { auth }
  },
}

const apolloServer = new ApolloServer(serverConfig)

export default apolloServer
