import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import { merge } from 'lodash'
import { serverConfig } from './apolloServer'
import { fakeUserAuth, fakeAdminAuth } from './authenticateRequest'

export const makeTestServer = (
  overrides: Partial<ApolloServerExpressConfig> = {},
): ApolloServerTestClient => {
  const defaultOverrides = {
    context: () => ({
      auth: fakeUserAuth,
    }),
  }

  return createTestClient(
    new ApolloServer(merge(serverConfig, defaultOverrides, overrides)),
  )
}

export const makeAdminTestServer = (
  overrides: Partial<ApolloServerExpressConfig> = {},
) =>
  makeTestServer({
    context: () => ({ auth: fakeAdminAuth }),
    ...overrides,
  })
