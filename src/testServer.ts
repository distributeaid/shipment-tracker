import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express'
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'
import { merge } from 'lodash'
import { serverConfig, Services } from './apolloServer'
import { fakeAdminAuth, fakeUserAuth } from './authenticateRequest'
import { GoogleSheetRow } from './createGoogleSheet'
import UserAccount from './models/user_account'

export type TestServices = Services & {
  createGoogleSheetCalls: Array<CreateGoogleSheetCall>
}

type CreateGoogleSheetCall = {
  title: string
  rows: Array<GoogleSheetRow>
}

const makeFakeCreateGoogleSheetFn = () => {
  const createGoogleSheetCalls: Array<CreateGoogleSheetCall> = []

  const createGoogleSheet = async (
    title: string,
    rows: Array<GoogleSheetRow>,
  ): Promise<string> => {
    createGoogleSheetCalls.push({
      title,
      rows,
    })

    return `stub-url-for-${title}`
  }

  return { createGoogleSheet, createGoogleSheetCalls }
}

export const makeTestServer = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
): Promise<ApolloServerTestClient> => {
  if (overrides.context == null) {
    const userAccount = await UserAccount.create({
      auth0Id: 'user-auth0-id',
    })

    overrides.context = () => ({
      auth: { ...fakeUserAuth, userAccount },
      services: {
        createGoogleSheet: makeFakeCreateGoogleSheetFn().createGoogleSheet,
      },
    })
  }

  return createTestClient(new ApolloServer(merge(serverConfig, overrides)))
}

export const makeAdminTestServer = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
) => (await makeAdminTestServerWithServices(overrides)).testServer

export const makeAdminTestServerWithServices = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
) => {
  const userAccount = await UserAccount.create({
    auth0Id: 'admin-auth0-id',
  })

  const fakeCreateGoogleSheet = makeFakeCreateGoogleSheetFn()

  const services = {
    ...fakeCreateGoogleSheet,
  }

  const testServer = await makeTestServer({
    context: () => ({
      auth: { ...fakeAdminAuth, userAccount },
      services,
    }),
    ...overrides,
  })

  return { testServer, services }
}
