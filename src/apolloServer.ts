import {
  ApolloServer,
  ApolloServerExpressConfig,
  AuthenticationError,
} from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import {
  AuthContext,
  authCookieName,
  decodeAuthCookie,
} from './authenticateRequest'
import generateCsv, { CsvRow } from './generateCsv'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

export type Services = {
  generateCsv: (rows: CsvRow[]) => string
}

export type AuthenticatedContext = {
  auth: AuthContext
  services: Services
}

export const serverConfig: ApolloServerExpressConfig = {
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
  async context({ req }): Promise<AuthenticatedContext> {
    try {
      return {
        auth: decodeAuthCookie(req.signedCookies[authCookieName]),
        services: { generateCsv },
      }
    } catch (err) {
      throw new AuthenticationError((err as Error).message)
    }
  },
}

export default new ApolloServer(serverConfig)
