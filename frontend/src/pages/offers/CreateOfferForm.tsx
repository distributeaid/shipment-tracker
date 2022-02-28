import _pick from 'lodash/pick'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { useGroupLeaderGroups } from '../../hooks/useGroupLeaderGroups'
import {
  GroupType,
  OfferCreateInput,
  useAllGroupsLazyQuery,
  useShipmentQuery,
} from '../../types/api-types'
import { formatListOfHubs, formatShipmentName } from '../../utils/format'
import { shipmentViewRoute } from '../../utils/routes'
import { setEmptyFieldsToUndefined } from '../../utils/setEmptyFieldsToUndefined'

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
 *
 * There is a situation that makes things complex:
 * - some users (usually admins) have the ability to create offers for any group
 * - other users only have access to a single sending group
 */
const CreateOfferForm: FunctionComponent<Props> = (props) => {
  // Display the shipment information (read-only)
  const { data: targetShipment, loading: isLoadingShipment } = useShipmentQuery(
    {
      variables: { id: props.shipmentId },
    },
  )

  const { me: profile } = useAuth()
  const usersGroups = useGroupLeaderGroups()

  const [getGroups, { loading: isLoadingGroups, data: groups }] =
    useAllGroupsLazyQuery()

  // Build list of sending groups which are groups not receiving in the shipment.
  const sendingGroups = useMemo(
    () =>
      groups?.listGroups?.filter(
        ({ id }) =>
          !targetShipment?.shipment.receivingHubs
            .map(({ id }) => id)
            .includes(id),
      ) ?? [],
    [groups, targetShipment],
  )

  useEffect(
    function loadGroupsForUser() {
      if (profile?.id != null) {
        // If the user is an admin, display all the regular groups in a dropdown
        // Otherwise, display all the groups captained by that user
        getGroups({
          variables: {
            groupType: [GroupType.Regular],
            captainId: profile.isAdmin ? undefined : profile.id,
          },
        })
      }
    },
    [profile, getGroups],
  )

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OfferCreateInput>()
  const watchSendingGroupId = watch('sendingGroupId')

  useEffect(
    function updateContactInformation() {
      if (sendingGroups.length > 0) {
        // When the sendingGroupId changes, we pre-fill the contact info
        const sendingGroupId =
          watchSendingGroupId ||
          // Use first group of user
          usersGroups[0]?.id
        let matchingGroup = sendingGroups.find(
          (group) => group.id === sendingGroupId,
        )

        // Special case for admins when only 1 sending group exists
        if (matchingGroup == null && sendingGroups.length === 1) {
          matchingGroup = sendingGroups[0]
        }

        if (matchingGroup != null) {
          reset({
            sendingGroupId,
            contact: {
              ..._pick(matchingGroup.primaryContact, [
                'name',
                'email',
                'phone',
                'signal',
                'whatsApp',
              ]),
            },
          })
        }
      }
    },
    [watchSendingGroupId, groups, reset, profile, sendingGroups, usersGroups],
  )

  const onSubmitForm = (input: OfferCreateInput) => {
    if (!props.shipmentId) {
      throw new Error('The shipment ID is missing in the offer form')
    }

    if (!groups) {
      throw new Error('Unable to fetch groups')
    }

    const payload: OfferCreateInput = {
      shipmentId: props.shipmentId,
      sendingGroupId: input.sendingGroupId || sendingGroups[0].id,
      contact: setEmptyFieldsToUndefined(input.contact),
      photoUris: input.photoUris || [],
    }

    props.onSubmit(payload)
  }

  if (isLoadingGroups || !profile || !groups) {
    return (
      <div>
        <Spinner /> Loading form data
      </div>
    )
  }

  if (sendingGroups.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg">Cannot create offer</h2>
        <p className="text-gray-700">
          There are no sending groups available, so an offer cannot be created.
          This should never happen! Please contact an administrator for help.
        </p>
        <p>
          <Link
            className="text-navy-800 hover:underline"
            to={shipmentViewRoute(props.shipmentId)}
          >
            Go back to the shipment
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {sendingGroups.length > 1 ? (
        <SelectField
          label="Sending group"
          name="sendingGroupId"
          castAsNumber
          register={register}
          required
          options={sendingGroups.map((group) => ({
            label: group.name,
            value: group.id,
          }))}
        />
      ) : (
        <ReadOnlyField label="Sending group">
          {sendingGroups[0].name || 'No group'}
        </ReadOnlyField>
      )}
      <ReadOnlyField label="Shipment">
        {targetShipment?.shipment && (
          <>
            <p className="">{formatShipmentName(targetShipment.shipment)}</p>
            <p className="text-gray-500 text-sm">
              {formatListOfHubs(targetShipment.shipment.sendingHubs)} →{' '}
              {formatListOfHubs(targetShipment.shipment.receivingHubs)}
            </p>
          </>
        )}
      </ReadOnlyField>
      <fieldset className="space-y-6">
        <legend>Primary contact</legend>
        {sendingGroups.length > 1 && (
          <p className="text-gray-600">
            When you select a sending group, we will prefill the contact
            information below.
          </p>
        )}
        <TextField
          label="Contact name"
          name="contact.name"
          register={register}
          errors={errors}
        />
        <TextField
          label="Email"
          name="contact.email"
          register={register}
          errors={errors}
        />
        <TextField
          label="WhatsApp"
          name="contact.whatsApp"
          register={register}
          errors={errors}
        />
        <TextField
          label="Phone"
          name="contact.phone"
          register={register}
          errors={errors}
        />
        <TextField
          label="Signal"
          name="contact.signal"
          register={register}
          errors={errors}
        />
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

export default CreateOfferForm
