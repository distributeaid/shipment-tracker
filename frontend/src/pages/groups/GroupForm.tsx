import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextArea from '../../components/forms/TextArea'
import TextField from '../../components/forms/TextField'
import TermsAndConditions from '../../components/TermsAndConditions'
import { GROUP_TYPE_OPTIONS } from '../../data/constants'
import { useAuth } from '../../hooks/useAuth'
import { useCountries } from '../../hooks/useCountries'
import { useRegions } from '../../hooks/useRegions'
import { GroupCreateInput, GroupQuery, GroupType } from '../../types/api-types'
import { formatRegion } from '../../utils/format'
import { stripIdAndTypename } from '../../utils/types'
import TermsAndCondCheckbox from './TermsAndCondCheckbox'

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
const GroupForm: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const { me: profile } = useAuth()
  const countries = useCountries()
  const regions = useRegions()
  const [showTermsAndCond, setShowTermsAndCond] = useState<boolean>(false)
  const [timeTcChecked, setTimeTcChecked] = useState<Date | null>(null)

  console.log(profile)

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
          country: defaults.country.countryCode,
          servingRegions: defaults.servingRegions.map(({ id }) => id),
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
      //input.termsAndConditionsAcceptedAt = timeTcChecked
    }

    props.onSubmit({
      ...input,
      // FIXME: for some reasons, servingRegions will be `false` in no item is selected
      servingRegions:
        (input.servingRegions as any) === false ? [] : input.servingRegions,
    })
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
      <TermsAndCondCheckbox
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
      <fieldset className="space-y-4">
        <TextField
          label="Group name"
          name="name"
          register={register}
          required
          errors={errors}
        />
        <TextArea
          label="Group description"
          name="description"
          register={register}
          errors={errors}
        />
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
      </fieldset>
      <fieldset className="space-y-4 mt-8">
        <legend>Location</legend>
        <TextField
          label="Locality"
          name="locality"
          required
          register={register}
          errors={errors}
        />
        <SelectField
          label="Country"
          name="country"
          defaultValue=""
          options={[
            {
              label: 'Pick a country',
              value: '',
              disabled: true,
            },
            ...countries.map(({ alias, shortName, countryCode }) => ({
              label: alias ?? shortName,
              value: countryCode,
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

      <fieldset className="mt-12">
        <legend className="font-semibold text-gray-700 mb-4">
          Regions your group serves
        </legend>
        {regions.map((region) => (
          <label
            className="flex items-center space-x-2 cursor-pointer"
            key={region.id}
          >
            <input
              type="checkbox"
              value={region.id}
              {...register('servingRegions')}
            />
            <span>{formatRegion(region)}</span>
          </label>
        ))}
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
