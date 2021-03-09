import { gql, useMutation } from '@apollo/client'
import { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Group, GroupInput } from '../../types/api-types'
import GroupForm from './GroupForm'

const ADD_GROUP = gql`
  mutation Groups($input: GroupInput!) {
    addGroup(input: $input) {
      id
    }
  }
`

const GroupCreatePage: FunctionComponent = () => {
  const history = useHistory()

  const [
    addGroup,
    { loading: mutationIsLoading, error: mutationError },
  ] = useMutation<{ addGroup: Group }>(ADD_GROUP)

  const onSubmit = (input: GroupInput) => {
    // Create the group and then redirect to its view/edit page
    addGroup({ variables: { input } })
      .then(({ data }) => {
        if (data) {
          const newGroupId = data.addGroup.id
          history.push(`/group/${newGroupId}`)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-da-navy-100 text-3xl mb-2">New group</h1>
          <p className="text-gray-700">
            Aid groups are entities that support the distribution of items and
            services across the world.
          </p>
        </header>
        <main className="p-4 md:p-6 max-w-lg pb-20">
          {mutationError && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{mutationError.message}</p>
            </div>
          )}
          <GroupForm
            onSubmit={onSubmit}
            isLoading={mutationIsLoading}
            submitButtonLabel="Create group"
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default GroupCreatePage
