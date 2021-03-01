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

    return { auth }
  },
})

export default apolloServer
