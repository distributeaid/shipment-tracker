import { FunctionComponent, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { UserProfileContext } from '../../components/UserProfileContext'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  AllGroupsDocument,
  GroupCreateInput,
  useCreateGroupMutation,
} from '../../types/api-types'
import { groupViewRoute } from '../../utils/routes'
import GroupForm from './GroupForm'

const GroupCreatePage: FunctionComponent = () => {
  const { refetch: refreshUserGroupAssociation } = useContext(
    UserProfileContext,
  )
  const history = useHistory()

  const [
    addGroup,
    { loading: mutationIsLoading, error: mutationError },
  ] = useCreateGroupMutation()

  const onSubmit = async (input: GroupCreateInput) => {
    try {
      // Create the group and then redirect to its view/edit page

      // TODO fix the fact that the backend validations consider null values as
      // invalid inputs.
      if (input.primaryContact) {
        input.primaryContact.whatsApp =
          input.primaryContact.whatsApp || undefined
        input.primaryContact.phone = input.primaryContact.phone || undefined
        input.primaryContact.signal = input.primaryContact.signal || undefined
        input.primaryContact.email = input.primaryContact.email || undefined
      }

      const { data } = await addGroup({
        variables: { input },
        // Fetch the updated list of groups
        refetchQueries: [{ query: AllGroupsDocument }],
      })

      // Because we cache the association between a group captain and their
      // group, we need to refresh that association when they create their first
      // group.
      refreshUserGroupAssociation()

      if (data) {
        const newGroupId = data.addGroup.id
        history.push(groupViewRoute(newGroupId))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <LayoutWithNav>
      <div className="bg-white max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-navy-800 text-3xl mb-2">New group</h1>
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
