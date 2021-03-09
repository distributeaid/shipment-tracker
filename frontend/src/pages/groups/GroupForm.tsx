import { FunctionComponent, ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Group, GroupInput, GroupType } from '../../types/api-types'
import TextField from '../../components/forms/TextField'
import SelectField from '../../components/forms/SelectField'
import Button from '../../components/Button'

interface Props {
  /**
   * If true, the Submit button will be disabled
   */
  isLoading: boolean
  /**
   * The text to display in the Submit button of the form
   */
  submitButtonLabel: ReactNode
  /**
   * The values to display in the fields of the form. Note that this is NOT a
   * controlled component.
   */
  defaultValues?: Group
  /**
   * The callback triggered when the user submits the form
   */
  onSubmit: (input: GroupInput) => void
}

/**
 * This component encapsulates a form for creating and editing groups.
 */
const GroupForm: FunctionComponent<Props> = (props) => {
  const { register, handleSubmit, reset } = useForm()

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        console.log(props.defaultValues)

        // Update the values of the fields
        reset(props.defaultValues)
      }
    },
    [props.defaultValues, reset],
  )

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
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
        <TextField
          label="WhatsApp"
          type="text"
          name="primaryContact.whatsApp"
          register={register}
        />
        <TextField
          label="Phone"
          type="text"
          name="primaryContact.phone"
          register={register}
        />
        <TextField
          label="Signal"
          type="text"
          name="primaryContact.signal"
          register={register}
        />
      </fieldset>

      <Button
        variant="primary"
        type="submit"
        className="mt-6"
        disabled={props.isLoading}
      >
        {props.submitButtonLabel}
      </Button>
    </form>
  )
}

export default GroupForm
