import {
  ApolloServer,
  ApolloServerExpressConfig,
  AuthenticationError,
} from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { AuthenticatedAuth, authenticateRequest } from './authenticateRequest'
import createGoogleSheet, { GoogleSheetRow } from './createGoogleSheet'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

export type Services = {
  createGoogleSheet: (
    title: string,
    rows: Array<GoogleSheetRow>,
  ) => Promise<string>
}

export type AuthenticatedContext = {
  auth: AuthenticatedAuth
  services: Services
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

    return { auth: auth as AuthenticatedAuth, services: { createGoogleSheet } }
  },
}

export default new ApolloServer(serverConfig)
