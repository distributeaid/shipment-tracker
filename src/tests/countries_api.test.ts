import { ApolloServer } from 'apollo-server-express'
import gql from 'graphql-tag'
import { userToAuthContext } from '../authenticateRequest'
import { countries } from '../data/countries'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import { Country } from '../server-internal-types'
import { makeTestServer } from '../testServer'

const purgeDb = async () => sequelize.sync({ force: true })

const countriesQuery = gql`
  query {
    countries {
      shortNameEN
      alpha2
    }
  }
`

describe('Countries API', () => {
  let testServer: ApolloServer
  beforeAll(async () => {
    await purgeDb()
    const user = await UserAccount.create({
      email: 'alex@example.com',
      passwordHash: '',
      name: 'Alex Doe',
    })
    testServer = await makeTestServer({
      context: () => ({ auth: userToAuthContext(user) }),
    })
  })
  afterAll(purgeDb)
  it('should allow listing of all countries', async () => {
    const res = await testServer.executeOperation({
      query: countriesQuery,
    })

    expect(res?.errors).toBeUndefined()

    expect(res.data?.countries ?? []).toHaveLength(countries.length)

    const no = ((res.data?.countries ?? []) as Country[]).find(
      ({ alpha2 }) => alpha2 === 'NO',
    )

    expect(no?.shortNameEN).toEqual('Norway')
  })
})
