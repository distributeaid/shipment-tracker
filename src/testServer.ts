import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express'
import { merge } from 'lodash'
import { serverConfig, Services } from './apolloServer'
import { fakeAdminAuth, fakeUserAuth } from './authenticateRequest'
import { CsvRow } from './generateCsv'
import UserAccount from './models/user_account'

export type TestServices = Services & {
  generateCsvCalls: Array<GenerateCsvCall>
}

type GenerateCsvCall = {
  rows: Array<CsvRow>
}

const makeFakeGenerateCsvFn = () => {
  const generateCsvCalls: Array<GenerateCsvCall> = []

  const generateCsv = (rows: Array<CsvRow>): string => {
    generateCsvCalls.push({ rows })

    return 'stubbed-csv'
  }

  return { generateCsv, generateCsvCalls }
}

export const makeTestServer = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
): Promise<ApolloServer> => {
  if (overrides.context == null) {
    const userAccount = await UserAccount.create({
      username: 'user-id',
      passwordHash: '',
      token: '',
    })

    overrides.context = () => ({
      auth: { ...fakeUserAuth, userAccount },
      services: {
        generateCsv: makeFakeGenerateCsvFn().generateCsv,
      },
    })
  }

  return new ApolloServer(merge(serverConfig, overrides))
}

export const makeAdminTestServer = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
) => (await makeAdminTestServerWithServices(overrides)).testServer

export const makeAdminTestServerWithServices = async (
  overrides: Partial<ApolloServerExpressConfig> = {},
) => {
  const userAccount = await UserAccount.create({
    username: 'admin-auth0-id',
    passwordHash: '',
    token: '',
  })

  const fakeGenrateCsv = makeFakeGenerateCsvFn()

  const services = {
    ...fakeGenrateCsv,
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
