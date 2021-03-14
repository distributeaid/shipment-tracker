import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  fromPromise,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { useAuth0 } from '@auth0/auth0-react'

import { FunctionComponent } from 'react'

const clientUrl = process.env.REACT_APP_CLIENT_URL

// https://www.apollographql.com/docs/link/links/http/
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
  credentials: 'include',
})

const ApolloAuthProvider: FunctionComponent = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0()

  // https://www.apollographql.com/docs/react/networking/authentication/
  const authLink = new ApolloLink((operation, forward) => {
    return fromPromise(
      getAccessTokenSilently()
        .then((token: string) => {
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

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

export default ApolloAuthProvider
