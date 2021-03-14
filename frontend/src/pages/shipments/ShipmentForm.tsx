import { gql, useQuery } from '@apollo/client'
import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField, { SelectOption } from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import { MONTH_OPTIONS } from '../../data/constants'
import {
  Group,
  GroupType,
  Shipment,
  ShipmentStatus,
  ShipmentUpdateInput,
  ShippingRoute,
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
  defaultValues?: Shipment
  /**
   * The callback triggered when the user submits the form
   */
  onSubmit: (input: ShipmentUpdateInput) => void
}

const STATUS_OPTIONS = [
  { label: 'Abandoned', value: ShipmentStatus.Abandoned },
  { label: 'Announced', value: ShipmentStatus.Announced },
  { label: 'Complete', value: ShipmentStatus.Complete },
  { label: 'In progress', value: ShipmentStatus.InProgress },
  { label: 'Open', value: ShipmentStatus.Open },
  { label: 'In staging', value: ShipmentStatus.Staging },
]

const SHIPPING_ROUTE_OPTIONS = enumValues(ShippingRoute).map((routeKey) => ({
  label: routeKey,
  value: routeKey,
}))

const GET_ALL_GROUPS = gql`
  query Groups {
    listGroups {
      id
      name
      groupType
    }
  }
`

function groupToSelectOption(group: Group): SelectOption {
  return { value: group.id, label: group.name }
}

const ShipmentForm: FunctionComponent<Props> = (props) => {
  const [receivingGroups, setReceivingGroups] = useState<SelectOption[]>([])
  const [sendingGroups, setSendingGroups] = useState<SelectOption[]>([])

  // Load the list of groups
  const { data: hubs, loading: hubListIsLoading } = useQuery<{
    listGroups: Group[]
  }>(GET_ALL_GROUPS)

  // When the groups are loaded, organize them by type so we can present them
  // in the form
  useEffect(
    function organizeGroups() {
      if (hubs && hubs.listGroups) {
        setReceivingGroups(
          hubs.listGroups
            .filter((group) => group.groupType === GroupType.ReceivingGroup)
            .map(groupToSelectOption),
        )
        setSendingGroups(
          hubs.listGroups
            .filter((group) => group.groupType === GroupType.SendingGroup)
            .map(groupToSelectOption),
        )
      }
    },
    [hubListIsLoading, hubs],
  )

  const { register, handleSubmit, reset } = useForm()

  useEffect(
    function resetFormValues() {
      if (props.defaultValues) {
        // Update the values of the fields
        reset(props.defaultValues)
      }
    },
    [props.defaultValues, reset],
  )

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-4">
      <SelectField
        options={STATUS_OPTIONS}
        label="Status"
        name="status"
        register={register}
        required
      />
      <SelectField
        options={SHIPPING_ROUTE_OPTIONS}
        label="Shipping route"
        name="shippingRoute"
        register={register}
        required
      />
      <div className="flex space-x-4">
        <SelectField
          options={MONTH_OPTIONS}
          label="Label month"
          name="labelMonth"
          castAsNumber
          register={register}
          required
        />
        <TextField
          label="Label year"
          name="labelYear"
          register={register}
          required
          type="number"
          minLength={4}
          maxLength={4}
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
      />
      <SelectField
        label="Receiving hub"
        name="receivingHubId"
        options={receivingGroups}
        castAsNumber
        register={register}
        required
        disabled={hubListIsLoading}
      />

      <Button variant="primary" type="submit" disabled={props.isLoading}>
        {props.submitButtonLabel}
      </Button>
    </form>
  )
}

export default ShipmentForm
