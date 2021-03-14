import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import { merge } from 'lodash'
import { serverConfig } from './apolloServer'
import { fakeUserAuth, fakeAdminAuth } from './authenticateRequest'
import UserAccount from './models/user_account'

export const makeTestServer = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
): Promise<ApolloServerTestClient> => {
  if (overrides.context == null) {
    const userAccount = await UserAccount.create({
      auth0Id: 'user-auth0-id',
    })

    overrides.context = () => ({
      auth: { ...fakeUserAuth, userAccount },
    })
  }

  return createTestClient(new ApolloServer(merge(serverConfig, overrides)))
}

export const makeAdminTestServer = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
) => {
  const userAccount = await UserAccount.create({
    auth0Id: 'admin-auth0-id',
  })

  return makeTestServer({
    context: () => ({ auth: { ...fakeAdminAuth, userAccount } }),
    ...overrides,
  })
}
