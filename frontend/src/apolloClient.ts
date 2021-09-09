import {
  ApolloClient,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

/**
 * Merge fields by replacing them with the incoming value.
 *
 * This custom merge function is APPARENTLY necessary to avoid the
 * following warning:
 * "Cache data may be lost when replacing the pallets field of a
 * <object type> object"
 */
const mergeByReplacement: { merge: FieldMergeFunction } = {
  merge: (existing = [], incoming = []) => {
    return [...incoming]
  },
}

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.REACT_APP_SERVER_URL?.replace(/\/$/, '')}/graphql`,
    credentials: 'include',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Offer: {
        fields: {
          pallets: mergeByReplacement,
        },
      },
      Pallet: {
        fields: {
          lineItems: mergeByReplacement,
        },
      },
    },
  }),
})
