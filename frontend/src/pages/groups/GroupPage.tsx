import { FunctionComponent, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Group, GroupInput, GroupType } from '../../types/api-types'
import TextField from '../../components/forms/TextField'
import SelectField from '../../components/forms/SelectField'
import Button from '../../components/Button'

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
  query Group($id: Int!) {
    group(id: $id) {
      ${ALL_GROUP_FIELDS}
    }
  }
`

// const UPDATE_GROUP = gql`
//   mutation Group($input: GroupInput!) {
//     updateGroup(input: $input) {
//       ${ALL_GROUP_FIELDS}
//     }
//   }
// `

const GroupEditPage: FunctionComponent = () => {
  const { register, handleSubmit, reset } = useForm()

  // Extract the group's ID from teh URL
  const { groupId } = useParams<{ groupId: string }>()

  // Load the group's information
  const { data: originalGroupData, loading: queryIsLoading } = useQuery<{
    group: Group
  }>(GET_GROUP, {
    variables: { id: parseInt(groupId, 10) },
  })

  useEffect(
    function resetForm() {
      // When the group's data is loaded, we fill the form with it
      if (originalGroupData != null) {
        reset(originalGroupData.group)
      }
    },
    [originalGroupData],
  )

  // Set up the mutation to update the group
  // const [updateGroup, { loading: mutationIsLoading }] = useMutation(
  //   UPDATE_GROUP,
  // )

  const onSubmit = (input: GroupInput) => {
    // TODO support an updateGroup resolver on the backend
    // updateGroup({ variables: { input } }).catch((error) => {
    //   console.log(error)
    // })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200">
          <h1 className="text-da-navy-100 text-3xl mb-2">
            {originalGroupData ? originalGroupData.group.name : 'Group'}
          </h1>
          <p className="text-gray-700">
            Aid groups are entities that support the distribution of items and
            services across the world.
          </p>
        </header>
        <main className="p-6 max-w-lg pb-20">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              name="name"
              register={register}
              className="mb-4"
              required
            />
            <SelectField
              label="Type"
              name="groupType"
              options={[
                { label: 'Receiving group', value: GroupType.ReceivingGroup },
                { label: 'Sending group', value: GroupType.SendingGroup },
                { label: 'DA hub', value: GroupType.DaHub },
              ]}
              required
              register={register}
            />
            <fieldset className="space-y-4 mt-8">
              <legend>Location</legend>
              <TextField
                label="Town or city"
                name="primaryLocation.townCity"
                register={register}
                required
              />
              <TextField
                label="Country"
                name="primaryLocation.countryCode"
                register={register}
              />
            </fieldset>
            <fieldset className="space-y-4 mt-8">
              <legend>Primary contact</legend>
              <TextField
                label="Name"
                name="primaryContact.name"
                register={register}
                required
              />
              <TextField
                label="Email"
                type="email"
                name="primaryContact.email"
                register={register}
              />
            </fieldset>

            <Button
              variant="primary"
              type="submit"
              className="mt-6"
              disabled={queryIsLoading}
            >
              Create group
            </Button>
          </form>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default GroupEditPage
