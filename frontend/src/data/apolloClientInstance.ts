import { ApolloClient, InMemoryCache } from '@apollo/client'

const apolloClientInstance = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
})

export default apolloClientInstance
