import { ErrorMessage } from '@hookform/error-message'
import _range from 'lodash/range'
import {
  FormEvent,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import Button from '../../components/Button'
import InlineError from '../../components/forms/InlineError'
import Label from '../../components/forms/Label'
import SelectField from '../../components/forms/SelectField'
import { MONTH_OPTIONS, SHIPMENT_STATUS_OPTIONS } from '../../data/constants'
import { useRegions } from '../../hooks/useRegions'
import {
  GroupType,
  ShipmentCreateInput,
  ShipmentQuery,
  useAllGroupsMinimalQuery,
} from '../../types/api-types'
import { arraysOverlap } from '../../utils/arraysOverlap'
import { formatRegion } from '../../utils/format'

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
  defaultValues?: ShipmentQuery
  /**
   * The callback triggered when the user submits the form
   */
  onSubmit: (input: ShipmentCreateInput) => void
  /**
   * If true, the form will display a confirmation that the data update was
   * successful
   */
  showSaveConfirmation?: boolean
}

const YEAR_OPTIONS = _range(
  new Date().getFullYear(),
  new Date().getFullYear() + 5,
).map((year) => ({ label: year.toString(), value: year }))

const DEFAULT_MONTH = (new Date().getMonth() + 2) % 12

const ShipmentForm: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const [isExistingShipment, setIsExistingShipment] = useState(false)
  const regions = useRegions()

  // Load the list of groups
  const { data: groupsAndHubs } = useAllGroupsMinimalQuery({
    variables: {},
  })

  const hubs = (
    groupsAndHubs?.listGroups.filter(
      ({ groupType }) => groupType === GroupType.DaHub,
    ) ?? []
  ).map(({ id, name }) => ({ label: name, value: id }))

  const groups = (
    groupsAndHubs?.listGroups.filter(
      ({ groupType }) => groupType === GroupType.Regular,
    ) ?? []
  ).map(({ id, name }) => ({ label: name, value: id }))

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    getValues,
    control,
    setError,
    formState: { errors },
  } = useForm<ShipmentCreateInput>()

  const [sendingHubs, receivingHubs] = watch(['sendingHubs', 'receivingHubs'])

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        reset({
          ...props.defaultValues.shipment,
          origin: props.defaultValues.shipment.origin.id,
          destination: props.defaultValues.shipment.destination.id,
          sendingHubs: props.defaultValues.shipment.sendingHubs.map(
            ({ id }) => id,
          ),
          receivingHubs: props.defaultValues.shipment.receivingHubs.map(
            ({ id }) => id,
          ),
          receivingGroups: props.defaultValues.shipment.receivingGroups.map(
            ({ id }) => id,
          ),
        })
        setIsExistingShipment(props.defaultValues.shipment.id != null)
      }
    },
    [props.defaultValues, reset],
  )

  useEffect(
    function updateHubValidationErrors() {
      if (errors.receivingHubs || errors.sendingHubs) {
        // The sendingHubs and receivingHubs fields depend on each other for
        // validation. Therefore, if one of them is updated, we clear the errors
        // for both of them
        if (!arraysOverlap(sendingHubs, receivingHubs)) {
          clearErrors(['sendingHubs', 'receivingHubs'])
        }
      }
    },
    [sendingHubs, receivingHubs, clearErrors, errors],
  )

  const validateShipmentDate = () => {
    const year = getValues('labelYear')
    const month = getValues('labelMonth')
    const shipmentDate = new Date(year, month)
    return shipmentDate > new Date()
      ? true
      : 'The shipment date cannot be in the past'
  }

  const validateHubSelection = () => {
    const sendingHubs = getValues('sendingHubs')
    const receivingHubs = getValues('receivingHubs')

    if (arraysOverlap(sendingHubs, receivingHubs)) {
      return 'The sending and receiving hubs must be different'
    }

    return true
  }

  /**
   * Custom submit function that validates the sending and receiving hubs
   */
  const submitForm = (event: FormEvent) => {
    const areHubsValid = validateHubSelection()
    if (typeof areHubsValid === 'string') {
      event.preventDefault()
      setError('receivingHubs', { message: areHubsValid })
      setError('sendingHubs', { message: areHubsValid })
      return false
    }

    return handleSubmit(props.onSubmit)(event)
  }

  return (
    <form onSubmit={submitForm} className="space-y-6">
      {isExistingShipment && (
        <SelectField
          options={SHIPMENT_STATUS_OPTIONS}
          label="Status"
          name="status"
          register={register}
          required
          errors={errors}
        />
      )}
      <SelectField
        options={[
          {
            label: 'Pick an origin region',
            value: '',
            disabled: true,
          },
          ...regions.map((region) => ({
            label: formatRegion(region),
            value: region.id,
          })),
        ]}
        label="Origin region"
        name="origin"
        register={register}
        required
        errors={errors}
      />
      <SelectField
        options={[
          {
            label: 'Pick an destination region',
            value: '',
            disabled: true,
          },
          ...regions.map((region) => ({
            label: formatRegion(region),
            value: region.id,
          })),
        ]}
        label="Destination"
        name="destination"
        register={register}
        required
        errors={errors}
      />
      <div className="flex space-x-4">
        <SelectField
          defaultValue={DEFAULT_MONTH}
          options={MONTH_OPTIONS}
          label="Month"
          name="labelMonth"
          castAsNumber
          register={register}
          registerOptions={{
            validate: validateShipmentDate,
          }}
          required
          errors={errors}
        />
        <SelectField
          options={YEAR_OPTIONS}
          label="Year"
          name="labelYear"
          castAsNumber
          register={register}
          registerOptions={{
            validate: validateShipmentDate,
          }}
          required
          errors={errors}
        />
      </div>
      <div>
        <Label>Sending hubs</Label>
        <ErrorMessage
          name="sendingHubs"
          errors={errors || {}}
          as={InlineError}
        />
        <Controller
          control={control}
          name="sendingHubs"
          render={({ field }) => (
            <Select
              onChange={(value) => field.onChange(value.map((c) => c.value))}
              options={hubs}
              isMulti
              value={hubs.filter((hub) => field.value?.includes(hub.value))}
              id="new-shipment-sendingHubs"
            />
          )}
        />
      </div>
      <div>
        <Label>Receiving hubs</Label>
        <ErrorMessage
          name="receivingHubs"
          errors={errors || {}}
          as={InlineError}
        />
        <Controller
          control={control}
          name="receivingHubs"
          render={({ field }) => (
            <Select
              onChange={(value) => field.onChange(value.map((c) => c.value))}
              options={hubs}
              isMulti
              value={hubs.filter((hub) => field.value?.includes(hub.value))}
              id="new-shipment-receivingHubs"
            />
          )}
        />
      </div>
      <div>
        <Label>Receiving groups</Label>
        <ErrorMessage
          name="receivingGroups"
          errors={errors || {}}
          as={InlineError}
        />
        <Controller
          control={control}
          name="receivingGroups"
          render={({ field }) => (
            <Select
              onChange={(value) => field.onChange(value.map((c) => c.value))}
              options={groups}
              isMulti
              value={groups.filter((groups) =>
                field.value?.includes(groups.value),
              )}
              id="new-shipment-receivingGroups"
            />
          )}
        />
      </div>
      <div className="flex items-center">
        <Button variant="primary" type="submit" disabled={props.isLoading}>
          {props.submitButtonLabel}
        </Button>
        {props.showSaveConfirmation && (
          <span className="ml-8 text-green-800 flex items-center">
            Changes saved!
          </span>
        )}
      </div>
    </form>
  )
}

export default ShipmentForm
