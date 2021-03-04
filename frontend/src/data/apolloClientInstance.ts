import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

// https://www.apollographql.com/docs/link/links/http/
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URL,
  credentials: 'include',
  fetch,
})

const clientUrl = process.env.REACT_APP_CLIENT_URL

const makeApolloClient = (
  getAccessTokenSilently: () => Promise<string>,
): ApolloClient<NormalizedCacheObject> => {
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

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  })
}

export default makeApolloClient
