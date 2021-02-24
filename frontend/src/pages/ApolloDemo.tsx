import { useQuery, gql } from '@apollo/client'

/**
 * 1. Write your GraphQL query. I recommend using the GraphQL UI to put queries
 * together, and then pasting them into your code.
 * http://localhost:3000/graphql
 */
const GROUPS_QUERY = gql`
  query GetAllGroups {
    listGroups {
      id
      name
    }
  }
`

const ApolloDemoPage = () => {
  /**
   * 2. The `useQuery` hook will handle all the data fetching and return:
   *    - loading: a boolean that tells you whether the query is complete
   *    - error: a ApolloError object with some details, in case things fail
   *    - data: the data fetched by your query
   */
  const { data, loading, error } = useQuery(GROUPS_QUERY)

  /**
   * 3. Render your markup!
   */
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl text-gray-800 mb-4">Apollo + GraphQL demo</h1>
      <div className="max-w-xl w-full p-4 border border-gray-200">
        <p>{loading ? `⏳ Loading...` : `✅ Loaded`}</p>
        <p>{error ? `Error: ${error.message}` : `✅ No errors`}</p>
        {data && (
          <>
            <p>✅ Data:</p>
            <pre className="bg-gray-100 p-2">
              {JSON.stringify(data, null, 2)}
            </pre>
          </>
        )}
      </div>
    </main>
  )
}

export default ApolloDemoPage
