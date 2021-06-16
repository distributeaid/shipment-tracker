import { FunctionComponent, useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import TextField from '../../components/forms/TextField'
import Spinner from '../../components/Spinner'
import { UserProfileContext } from '../../components/UserProfileContext'
import {
  GroupType,
  OfferCreateInput,
  useAllGroupsQuery,
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
 * TODO
 * If the user is an admin, they should be able to select a SENDING group.
 * If the user is not an admin, they should automatically use their own group
 */

/**
 * This form allows users to create a new offer. It is very specific to offer
 * creation, and therefore difficult to reuse for editing offers.
 */
const OfferForm: FunctionComponent<Props> = (props) => {
  // Each group leader is assigned to a single group
  // We need to figure out which group that is
  // TODO: handle the fact that admins can be assigned to any number of groups
  const { profile } = useContext(UserProfileContext)

  // TODO switch to filtering groups when the resolver supports it
  const { data: groups, loading: isLoadingGroups } = useAllGroupsQuery()

  // TODO this won't work if the user is an admin
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

    // TODO fix the fact that the backend validations consider null values as
    // invalid inputs.
    if (input.contact) {
      input.contact.email = input.contact?.email || undefined
      input.contact.phone = input.contact?.phone || undefined
      input.contact.whatsApp = input.contact?.whatsApp || undefined
      input.contact.signal = input.contact?.signal || undefined
    }

    props.onSubmit(input)
  }

  // TODO this won't work if the user is an admin
  if (!profile?.isAdmin) {
    if (!groupForUser || !profile) {
      return (
        <div>
          <Spinner /> Loading form data
        </div>
      )
    }
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
      <fieldset className="space-y-6">
        <legend>Primary contact</legend>
        <TextField
          label="Contact name"
          name="contact.name"
          register={register}
          errors={errors}
          defaultValue={groupForUser?.primaryContact.name}
        />
        <TextField
          label="Email"
          name="contact.email"
          register={register}
          errors={errors}
          defaultValue={groupForUser?.primaryContact.email || ''}
        />
        <TextField
          label="WhatsApp"
          name="contact.whatsApp"
          register={register}
          errors={errors}
          defaultValue={groupForUser?.primaryContact.whatsApp || ''}
        />
        <TextField
          label="Phone"
          name="contact.phone"
          register={register}
          errors={errors}
          defaultValue={groupForUser?.primaryContact.phone || ''}
        />
        <TextField
          label="Signal"
          name="contact.signal"
          register={register}
          errors={errors}
          defaultValue={groupForUser?.primaryContact.signal || ''}
        />
      </fieldset>
      <fieldset>
        <legend>Photos (WIP)</legend>
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
