import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express'
import { merge } from 'lodash'
import { serverConfig, Services } from './apolloServer'
import { userToAuthContext } from './authenticateRequest'
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
    const user = await UserAccount.create({
      isAdmin: false,
      name: 'User',
      email: 'user@example.com',
      passwordHash: '',
    })

    overrides.context = () => ({
      auth: userToAuthContext(user),
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
  const fakeGenrateCsv = makeFakeGenerateCsvFn()

  const services = {
    ...fakeGenrateCsv,
  }

  const admin = await UserAccount.create({
    isAdmin: true,
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash: '',
  })

  const testServer = await makeTestServer({
    context: () => ({
      auth: userToAuthContext(admin),
      services,
    }),
    ...overrides,
  })

  return { testServer, services }
}
