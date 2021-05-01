import { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField, { SelectOption } from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
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
    formState: { errors },
  } = useForm()

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        // Update the values of the fields
        reset(props.defaultValues.shipment)
      }
    },
    [props.defaultValues, reset],
  )

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-4">
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
          options={MONTH_OPTIONS}
          label="Label month"
          name="labelMonth"
          castAsNumber
          register={register}
          required
          errors={errors}
        />
        <TextField
          label="Label year"
          name="labelYear"
          register={register}
          required
          type="number"
          minLength={4}
          maxLength={4}
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
