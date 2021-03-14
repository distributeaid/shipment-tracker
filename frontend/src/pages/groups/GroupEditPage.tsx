import { gql, useQuery } from '@apollo/client'
import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Group, GroupUpdateInput } from '../../types/api-types'
import GroupForm from './GroupForm'

const ALL_GROUP_FIELDS = gql`
  fragment AllGroupFields on Group {
    id
    name
    groupType
    primaryLocation {
      townCity
      countryCode
      openLocationCode
    }
    primaryContact {
      name
      email
      whatsApp
      phone
      signal
    }
  }
`

const GET_GROUP = gql`
  ${ALL_GROUP_FIELDS}
  query Group($id: Int!) {
    group(id: $id) {
      ...AllGroupFields
    }
  }
`

// const UPDATE_GROUP = gql`
//   ${ALL_GROUP_FIELDS}
//   mutation Group($input: GroupUpdateInput!) {
//     updateGroup(input: $input) {
//       ...AllGroupFields
//     }
//   }
// `

const GroupEditPage: FunctionComponent = () => {
  // Extract the group's ID from the URL
  const { groupId } = useParams<{ groupId: string }>()

  // Load the group's information
  const { data: originalGroupData, loading: queryIsLoading } = useQuery<{
    group: Group
  }>(GET_GROUP, {
    variables: { id: parseInt(groupId, 10) },
  })

  // Set up the mutation to update the group
  // const [updateGroup, { loading: mutationIsLoading }] = useMutation(
  //   UPDATE_GROUP,
  // )

  const onSubmit = (input: GroupUpdateInput) => {
    // TODO support an updateGroup resolver on the backend
    // updateGroup({ variables: { input } }).catch((error) => {
    //   console.log(error)
    // })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-navy-800 text-3xl mb-2">
            {originalGroupData ? originalGroupData.group.name : 'Group'}
          </h1>
          <p className="text-gray-700">
            Aid groups are entities that support the distribution of items and
            services across the world.
          </p>
        </header>
        <main className="p-4 md:p-6 max-w-lg pb-20">
          <GroupForm
            isLoading={queryIsLoading}
            submitButtonLabel="Save changes"
            onSubmit={onSubmit}
            defaultValues={originalGroupData?.group}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default GroupEditPage
