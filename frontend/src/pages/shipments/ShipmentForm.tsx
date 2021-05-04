import _range from 'lodash/range'
import { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField, { SelectOption } from '../../components/forms/SelectField'
import { MONTH_OPTIONS } from '../../data/constants'
import {
  AllGroupsMinimalQuery,
  GroupType,
  ShipmentCreateInput,
  ShipmentQuery,
  ShipmentStatus,
  ShippingRoute,
  useAllGroupsMinimalQuery,
} from '../../types/api-types'
import { enumValues } from '../../utils/types'

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

const STATUS_OPTIONS = [
  { label: 'Announced', value: ShipmentStatus.Announced },
  { label: 'In progress', value: ShipmentStatus.InProgress },
  { label: 'Open', value: ShipmentStatus.Open },
  { label: 'In staging', value: ShipmentStatus.Staging },
  { label: 'Complete', value: ShipmentStatus.Complete },
  { label: 'Abandoned', value: ShipmentStatus.Abandoned },
]

const YEAR_OPTIONS = _range(
  new Date().getFullYear(),
  new Date().getFullYear() + 5,
).map((year) => ({ label: year.toString(), value: year }))

const DEFAULT_MONTH = (new Date().getMonth() + 2) % 12

const SHIPPING_ROUTE_OPTIONS = enumValues(ShippingRoute).map((routeKey) => ({
  label: routeKey,
  value: routeKey,
}))

function groupToSelectOption(
  group: AllGroupsMinimalQuery['listGroups'][0],
): SelectOption {
  return { value: group.id, label: group.name }
}

const ShipmentForm: FunctionComponent<Props> = (props) => {
  const [receivingGroups, setReceivingGroups] = useState<SelectOption[]>([])
  const [sendingGroups, setSendingGroups] = useState<SelectOption[]>([])

  // Load the list of groups
  const { data: groups, loading: hubListIsLoading } = useAllGroupsMinimalQuery()

  // When the groups are loaded, organize them by type so we can present them
  // in the form
  useEffect(
    function organizeGroups() {
      if (groups && groups.listGroups) {
        setReceivingGroups(
          groups.listGroups
            .filter((group) => group.groupType === GroupType.ReceivingGroup)
            .map(groupToSelectOption),
        )
        setSendingGroups(
          groups.listGroups
            .filter((group) => group.groupType === GroupType.SendingGroup)
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
    getValues,
    formState: { errors },
  } = useForm<ShipmentCreateInput>()

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        // Update the values of the fields
        reset(props.defaultValues.shipment)
      }
    },
    [props.defaultValues, reset],
  )

  const validateShipmentDate = () => {
    const year = getValues('labelYear')
    const month = getValues('labelMonth')
    const shipmentDate = new Date(year, month)
    return shipmentDate > new Date()
      ? true
      : 'The shipment date cannot be in the past'
  }

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-6">
      <SelectField
        defaultValue={ShipmentStatus.Announced}
        options={STATUS_OPTIONS}
        label="Status"
        name="status"
        register={register}
        required
        errors={errors}
      />
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
        options={sendingGroups}
        castAsNumber
        register={register}
        required
        disabled={hubListIsLoading}
        errors={errors}
      />
      <SelectField
        label="Receiving hub"
        name="receivingHubId"
        options={receivingGroups}
        castAsNumber
        register={register}
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
