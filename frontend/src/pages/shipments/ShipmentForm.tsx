import _range from 'lodash/range'
import { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField, { SelectOption } from '../../components/forms/SelectField'
import {
  MONTH_OPTIONS,
  SHIPMENT_STATUS_OPTIONS,
  SHIPPING_ROUTE_OPTIONS,
} from '../../data/constants'
import {
  GroupType,
  ShipmentCreateInput,
  ShipmentQuery,
  useAllGroupsMinimalQuery,
} from '../../types/api-types'
import { groupToSelectOption } from '../../utils/format'

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

const ShipmentForm: FunctionComponent<Props> = (props) => {
  const [hubs, setHubs] = useState<SelectOption[]>([])
  const [isExistingShipment, setIsExistingShipment] = useState(false)

  // Load the list of groups
  const { data: groups, loading: hubListIsLoading } = useAllGroupsMinimalQuery()

  // When the groups are loaded, organize them by type so we can present them
  // in the form
  useEffect(
    function organizeGroups() {
      if (groups && groups.listGroups) {
        setHubs(
          groups.listGroups
            .filter((group) => group.groupType === GroupType.DaHub)
            .map(groupToSelectOption),
        )
      }
    },
    [hubListIsLoading, groups],
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<ShipmentCreateInput>()

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        reset(props.defaultValues.shipment)
        setIsExistingShipment(props.defaultValues.shipment.id != null)
      }
    },
    [props.defaultValues, reset],
  )

  const [sendingHubId, receivingHubId] = watch([
    'sendingHubId',
    'receivingHubId',
  ])

  useEffect(
    function updateHubValidationErrors() {
      // The sendingHubId and receivingHubId fields depend on each other for
      // validation. Therefore, if one of them is updated, we clear the errors
      // for both of them
      if (sendingHubId !== receivingHubId) {
        clearErrors(['sendingHubId', 'receivingHubId'])
      }
    },
    [sendingHubId, receivingHubId, clearErrors],
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
    const sendingHub = getValues('sendingHubId')
    const receivingHub = getValues('receivingHubId')
    if (sendingHub === receivingHub) {
      return 'The sending and receiving hubs must be different'
    }

    return true
  }

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-6">
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
        options={SHIPPING_ROUTE_OPTIONS}
        label="Shipping route"
        name="shippingRoute"
        register={register}
        required
        errors={errors}
      />
      <div className="flex space-x-4">
        <SelectField
          defaultValue={DEFAULT_MONTH}
          options={MONTH_OPTIONS}
          label="Label month"
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
          label="Label year"
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
      <SelectField
        label="Sending hub"
        name="sendingHubId"
        options={hubs}
        castAsNumber
        register={register}
        registerOptions={{
          validate: validateHubSelection,
        }}
        required
        disabled={hubListIsLoading}
        errors={errors}
      />
      <SelectField
        label="Receiving hub"
        name="receivingHubId"
        options={hubs}
        castAsNumber
        register={register}
        registerOptions={{
          validate: validateHubSelection,
        }}
        required
        disabled={hubListIsLoading}
        errors={errors}
      />
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
