import { FunctionComponent } from 'react'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Group, GroupInput, GroupType } from '../../types/api-types'
import { useForm } from 'react-hook-form'
import TextField from '../../components/forms/TextField'
import SelectField from '../../components/forms/SelectField'
import Button from '../../components/Button'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'

const ADD_GROUP = gql`
  mutation Groups($input: GroupInput!) {
    addGroup(input: $input) {
      # The fields to return
      id
      name
    }
  }
`

const GroupCreatePage: FunctionComponent = () => {
  const history = useHistory()

  const { register, handleSubmit } = useForm()
  const [
    addGroup,
    { loading: mutationIsLoading, error: mutationError },
  ] = useMutation<{
    addGroup: Group
  }>(ADD_GROUP)

  const onSubmit = (input: GroupInput) => {
    addGroup({ variables: { input } })
      .then(({ data }) => {
        if (data) {
          const newGroupId = data.addGroup.id
          history.push(`/group/${newGroupId}`)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200">
          <h1 className="text-da-navy-100 text-3xl mb-2">New group</h1>
          <p className="text-gray-700">
            Aid groups are entities that support the distribution of items and
            services across the world.
          </p>
        </header>
        <main className="p-6 max-w-lg pb-20">
          {mutationError && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{mutationError.message}</p>
            </div>
          )}
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
              disabled={mutationIsLoading}
            >
              Create group
            </Button>
          </form>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default GroupCreatePage
