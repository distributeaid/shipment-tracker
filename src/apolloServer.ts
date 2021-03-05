import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'

import resolvers from './resolvers'
import typeDefs from './typeDefs'
import { authenticateRequest } from './authenticateRequest'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
  async context({ req }) {
    const auth = await authenticateRequest(req)

    if (auth.userAccount == null) {
      throw new AuthenticationError(
        `No user account found for profile ${auth.claims.sub}`,
      )
    }

    return { auth }
  },
})

export default apolloServer
