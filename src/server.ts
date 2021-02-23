import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { createServer } from 'http'
import compression from 'compression'
import cors from 'cors'
import resolvers from './resolvers'
import typeDefs from './typeDefs'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)],
})

const app = express()
app.use('*', cors())
app.use(compression())

server.applyMiddleware({ app, path: '/graphql' })

const httpServer = createServer(app)

httpServer.listen({ port: 3000 }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:3000/graphql`,
  ),
)
