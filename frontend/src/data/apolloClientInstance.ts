import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'

// https://www.apollographql.com/docs/link/links/http/
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
  credentials: 'include',
  fetch,
})

const clientUrl = process.env.REACT_APP_CLIENT_URL

// https://www.apollographql.com/docs/react/networking/authentication/
const authLink = new ApolloLink((operation, forward) => {
  const { getAccessTokenSilently } = useAuth0()

  return fromPromise(
    getAccessTokenSilently()
      .then((token: string) => {
        console.log(`Access token: ${token}`)
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : '',
            'Access-Control-Allow-Origin': clientUrl,
          },
        })

        return operation
      })
      .catch(() => {
        // not signed in
        return operation
      }),
  ).flatMap(forward)
})

const apolloClientInstance = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

export default apolloClientInstance
