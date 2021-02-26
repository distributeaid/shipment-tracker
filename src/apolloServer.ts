import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'

import resolvers from './resolvers'
import typeDefs from './typeDefs'
import { validateJwt } from './validateJwt'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
  async context({ req }) {
    const { authorization: token } = req.headers

    if (token == null) {
      throw new AuthenticationError('you must be logged in')
    }

    const authResult = await validateJwt(token)

    if (authResult.error != null) {
      throw new AuthenticationError(JSON.stringify(authResult.error))
    }

    return { authMessage: authResult.decoded }
  },
})

export default apolloServer
