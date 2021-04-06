import { FunctionComponent, useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import TextField from '../../components/forms/TextField'
import { UserProfileContext } from '../../components/UserProfileContext'
import {
  GroupType,
  OfferCreateInput,
  useAllGroupsMinimalQuery,
  useShipmentQuery,
} from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'

interface Props {
  /**
   * This shipment ID to determine where this offer will be created.
   */
  shipmentId: number
  /**
   * If true, the Submit button will be disabled
   */
  isLoading: boolean
  /**
   * The callback triggered when the user submits the form
   */
  onSubmit: (input: OfferCreateInput) => void
}

/**
 * This form allows users to create a new offer. It is very specific to offer
 * creation, and therefore difficult to reuse for editing offers.
 */
const OfferForm: FunctionComponent<Props> = (props) => {
  // Each group leader is assigned to a single group
  // We need to figure out which group that is
  // TODO: handle the fact that admins can be assigned to any number of groups
  const profile = useContext(UserProfileContext)
  const { data: groups, loading: isLoadingGroups } = useAllGroupsMinimalQuery()

  const groupForUser = useMemo(() => {
    if (groups?.listGroups && profile) {
      return groups.listGroups.find(
        (group) =>
          group.captainId === profile.id &&
          group.groupType === GroupType.SendingGroup,
      )
    }
  }, [groups, profile])

  const { data: targetShipment, loading: isLoadingShipment } = useShipmentQuery(
    {
      variables: { id: props.shipmentId },
    },
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OfferCreateInput>()

  const onSubmitForm = (input: OfferCreateInput) => {
    if (!props.shipmentId) {
      throw new Error('The shipment ID is missing in the offer form')
    }

    if (!groupForUser) {
      throw new Error('Cannot find a shipping group in the offer form')
    }

    // The sending group ID and shipment ID aren't in the form, so we add them
    // manually
    input.shipmentId = props.shipmentId
    input.sendingGroupId = groupForUser.id

    props.onSubmit(input)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <ReadOnlyField label="Sending group">
        {groupForUser?.name || 'No group'}
      </ReadOnlyField>
      <ReadOnlyField label="Shipment">
        {targetShipment?.shipment && (
          <>
            <p className="">{formatShipmentName(targetShipment.shipment)}</p>
            <p className="text-gray-500 text-sm">
              {targetShipment.shipment.sendingHub.name} →{' '}
              {targetShipment.shipment.receivingHub.name}
            </p>
          </>
        )}
      </ReadOnlyField>
      <fieldset>
        <legend>Primary contact</legend>
        <TextField
          label="Contact name"
          name="contact.name"
          register={register}
          errors={errors}
        />
      </fieldset>
      <fieldset>
        <legend>Photos</legend>
      </fieldset>
      <Button
        variant="primary"
        type="submit"
        className="mt-6"
        disabled={props.isLoading || isLoadingShipment || isLoadingGroups}
      >
        Create offer
      </Button>
    </form>
  )
}

export default OfferForm
