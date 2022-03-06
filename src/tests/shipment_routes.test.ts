import { ApolloServer } from 'apollo-server-express'
import gql from 'graphql-tag'
import { userToAuthContext } from '../authenticateRequest'
import { shipmentRoutes } from '../data/shipmentRoutes'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import { ShipmentRoute } from '../server-internal-types'
import { makeTestServer } from '../testServer'

const purgeDb = async () => sequelize.sync({ force: true })

const shipmentRoutesQuery = gql`
  query {
    shipmentRoutes {
      id
      from {
        country {
          shortNameEN
          alpha2
        }
        region
      }
      to {
        country {
          shortNameEN
          alpha2
        }
        region
      }
    }
  }
`

describe('shipmentRoutes API', () => {
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
  it('should allow listing of all shipmentRoutes', async () => {
    const res = await testServer.executeOperation({
      query: shipmentRoutesQuery,
    })

    expect(res?.errors).toBeUndefined()

    expect(res.data?.shipmentRoutes ?? []).toHaveLength(shipmentRoutes.length)

    const DeToBa = ((res.data?.shipmentRoutes ?? []) as ShipmentRoute[]).find(
      ({ id }) => id === 'DeToBa',
    )

    expect(DeToBa).toMatchObject({
      id: 'DeToBa',
      from: {
        country: {
          shortNameEN: 'Germany',
          alpha2: 'DE',
        },
        region: null,
      },
      to: {
        country: {
          shortNameEN: 'Bosnia and Herzegovina',
          alpha2: 'BA',
        },
        region: null,
      },
    })
  })
})
