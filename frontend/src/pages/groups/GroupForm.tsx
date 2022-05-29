import { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextArea from '../../components/forms/TextArea'
import TextField from '../../components/forms/TextField'
import TermsAndConditions from '../../components/TermsAndConditions'
import { GROUP_TYPE_OPTIONS } from '../../data/constants'
import { useAuth } from '../../hooks/useAuth'
import { useCountries } from '../../hooks/useCountries'
import { GroupCreateInput, GroupQuery, GroupType } from '../../types/api-types'
import { stripIdAndTypename } from '../../utils/types'
import TermAndCondCheckbox from './TermAndCondCheckbox'

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
  defaultValues?: GroupQuery
  /**
   * The callback triggered when the user submits the form
   */
  onSubmit: (input: GroupCreateInput) => void

  /**
   * If true, checkbox for terms and conditions will be displayed
   * We don't want to display checkbox terms and conditions on update page
   */
  renderTermsAndConditions: boolean
}

/**
 * This component encapsulates a form for creating and editing groups.
 */
const GroupForm: FunctionComponent<Props> = (props) => {
  const { me: profile } = useAuth()
  const countries = useCountries()
  const [showTermsAndCond, setShowTermsAndCond] = useState<boolean>(false)
  const [timeTcChecked, setTimeTcChecked] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupCreateInput>()

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        const defaults = stripIdAndTypename(props.defaultValues.group)
        // Update the values of the fields
        reset({
          ...defaults,
          primaryLocation: {
            ...defaults.primaryLocation,
            country: defaults.primaryLocation.country?.countrycode,
          },
        })
      }
    },
    [props.defaultValues, reset],
  )

  const submitForm = handleSubmit((input) => {
    // Non-admins can only create regular groups
    if (!profile?.isAdmin) {
      input.groupType = GroupType.Regular
    }

    if (timeTcChecked !== null) {
      input.termsAndConditionsAcceptedAt = timeTcChecked
    }

    props.onSubmit(input)
  })

  function handleTcChange() {
    if (timeTcChecked === null) {
      setTimeTcChecked(new Date())
    } else {
      setTimeTcChecked(null)
    }
  }

  let termsAndConditions
  if (props.renderTermsAndConditions) {
    termsAndConditions = (
      <TermAndCondCheckbox
        handleTcChange={handleTcChange}
        timeTcChecked={timeTcChecked}
        setShowTermsAndCond={setShowTermsAndCond}
      />
    )
  } else {
    termsAndConditions = null
  }

  return (
    <form onSubmit={submitForm}>
      {showTermsAndCond ? (
        <TermsAndConditions close={() => setShowTermsAndCond(false)} />
      ) : null}
      <TextField
        label="Group name"
        name="name"
        register={register}
        required
        errors={errors}
      />
      <fieldset className="space-y-4 mt-8">
        <TextArea
          label="Group description"
          name="description"
          register={register}
          errors={errors}
        />
      </fieldset>
      {profile?.isAdmin && (
        <SelectField
          label="Type"
          name="groupType"
          options={GROUP_TYPE_OPTIONS}
          className="mt-4"
          required
          register={register}
        />
      )}
      <fieldset className="space-y-4 mt-8">
        <legend>Location</legend>
        <TextField
          label="City"
          name="primaryLocation.city"
          required
          register={register}
          errors={errors}
        />
        <SelectField
          label="Country"
          name="primaryLocation.country"
          defaultValue=""
          options={[
            {
              label: 'Pick a country',
              value: '',
              disabled: true,
            },
            ...countries.map(({ alias, shortName, countrycode }) => ({
              label: alias ?? shortName,
              value: countrycode,
            })),
          ]}
          required
          register={register}
          errors={errors}
        />
      </fieldset>
      <fieldset className="space-y-4 mt-8">
        <legend>Primary contact</legend>
        <TextField
          label="Name"
          name="primaryContact.name"
          required
          register={register}
          errors={errors}
        />
        <TextField
          label="Email"
          type="email"
          name="primaryContact.email"
          register={register}
          errors={errors}
        />
        <TextField
          label="WhatsApp"
          type="text"
          name="primaryContact.whatsApp"
          register={register}
          errors={errors}
        />
        <TextField
          label="Phone"
          type="text"
          name="primaryContact.phone"
          register={register}
          errors={errors}
        />
        <TextField
          label="Signal"
          type="text"
          name="primaryContact.signal"
          register={register}
          errors={errors}
        />
        {termsAndConditions}
      </fieldset>

      <Button
        variant="primary"
        type="submit"
        className="mt-6"
        disabled={
          props.isLoading ||
          (timeTcChecked === null && props.renderTermsAndConditions)
        }
      >
        {props.submitButtonLabel}
      </Button>
    </form>
  )
}

export default GroupForm
