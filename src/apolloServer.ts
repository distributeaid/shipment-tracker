import {
  ApolloServer,
  ApolloServerExpressConfig,
  AuthenticationError,
} from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { AuthContext, authenticateWithToken } from './authenticateRequest'
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
    const auth = await authenticateWithToken(req.signedCookies.token)

    if (!('userAccount' in auth)) {
      throw new AuthenticationError(auth.message)
    }

    return { auth: auth as AuthContext, services: { generateCsv } }
  },
}

export default new ApolloServer(serverConfig)
