import { FunctionComponent } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import InternalLink from '../../components/InternalLink'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  GroupUpdateInput,
  useGroupQuery,
  useUpdateGroupMutation,
} from '../../types/api-types'
import { groupViewRoute } from '../../utils/routes'
import GroupForm from './GroupForm'

const GroupEditPage: FunctionComponent = () => {
  const history = useHistory()

  // Extract the group's ID from the URL
  const { groupId } = useParams<{ groupId: string }>()

  // Load the group's information
  const { data: originalGroupData, loading: queryIsLoading } = useGroupQuery({
    variables: { id: parseInt(groupId, 10) },
  })

  // Set up the mutation to update the group
  const [
    updateGroup,
    { loading: mutationIsLoading, error: mutationError },
  ] = useUpdateGroupMutation()

  const onSubmit = async (input: GroupUpdateInput) => {
    try {
      await updateGroup({
        variables: { id: parseInt(groupId, 10), input },
      })
      history.push(groupViewRoute(groupId))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
          <InternalLink
            className="inline-block mb-2"
            to={groupViewRoute(groupId)}
          >
            ← back to view
          </InternalLink>
          <h1 className="text-navy-800 text-3xl mb-2">
            {originalGroupData ? originalGroupData.group.name : 'Group'}
          </h1>
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
            isLoading={queryIsLoading || mutationIsLoading}
            submitButtonLabel="Save changes"
            onSubmit={onSubmit}
            defaultValues={originalGroupData}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default GroupEditPage
