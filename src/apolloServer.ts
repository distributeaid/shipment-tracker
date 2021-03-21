import {
  ApolloServer,
  ApolloServerExpressConfig,
  AuthenticationError,
} from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { AuthenticatedAuth, authenticateRequest } from './authenticateRequest'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

export type AuthenticatedContext = {
  auth: AuthenticatedAuth
}

export const serverConfig: ApolloServerExpressConfig = {
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
  async context({ req }): Promise<AuthenticatedContext> {
    const auth = await authenticateRequest(req)

    if (auth.userAccount == null) {
      throw new AuthenticationError(
        `No user account found for profile ${auth.claims.sub}`,
      )
    }

    return { auth: auth as AuthenticatedAuth }
  },
}

const apolloServer = new ApolloServer(serverConfig)

export default apolloServer
