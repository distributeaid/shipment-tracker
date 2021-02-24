import { ApolloClient, InMemoryCache } from '@apollo/client'

const apolloClientInstance = new ApolloClient({
  uri: process.env.REACT_APP_SERVER_URL,
  cache: new InMemoryCache(),
})

export default apolloClientInstance
