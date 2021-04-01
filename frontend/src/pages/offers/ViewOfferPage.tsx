import { FunctionComponent, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import useModalState from '../../hooks/useModalState'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  useDestroyPalletMutation,
  useGroupQuery,
  useOfferQuery,
  useShipmentQuery,
} from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import { shipmentViewOffersRoute } from '../../utils/routes'
import PalletsEditor from './PalletsEditor'

const ViewOfferPage: FunctionComponent = () => {
  const params = useParams<{ shipmentId: string; offerId: string }>()
  const offerId = parseInt(params.offerId, 10)
  const shipmentId = parseInt(params.shipmentId, 10)

  const { data: shipment } = useShipmentQuery({
    variables: { id: shipmentId },
  })

  const { data: offer } = useOfferQuery({ variables: { id: offerId } })

  const sendingGroupId = offer?.offer.sendingGroupId
  const { data: sendingGroup } = useGroupQuery({
    skip: !sendingGroupId, // Don't execute this query until the group ID is known
    variables: { id: sendingGroupId! },
  })

  const [
    deleteModalIsVisible,
    showDeleteModal,
    hideDeleteModal,
  ] = useModalState()

  const [selectedPallet, setSelectedPallet] = useState<number>()

  const selectPalletToDestroy = (palletId: number) => {
    setSelectedPallet(palletId)
    showDeleteModal()
  }

  // The mutation below will automatically update the cache because the API
  // returns the offer. However, it'll create a warning in the console, and I
  // can't find a way to get rid of it without some redundant configuration
  // "Cache data may be lost when replacing the pallets field of a Offer object"
  const [destroyPallet] = useDestroyPalletMutation()

  const confirmDeletePallet = () => {
    if (selectedPallet == null) {
      return
    }

    destroyPallet({ variables: { id: selectedPallet } }).then(() => {
      setSelectedPallet(undefined)
      hideDeleteModal()
    })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content bg-white flex flex-col">
        <header className="p-6 border-b border-gray-200 md:flex justify-between">
          <div>
            <InternalLink
              className="inline-block mb-2"
              to={shipmentViewOffersRoute(shipmentId)}
            >
              ← back to shipment
            </InternalLink>
            <h1 className="text-navy-800 text-3xl">Offer details</h1>
          </div>
          {offer?.offer && (
            <div className="flex space-x-8 mt-4 md:mt-0">
              <ReadOnlyField label="Shipment">
                {shipment?.shipment && (
                  <>
                    <p className="text-gray-800">
                      {formatShipmentName(shipment.shipment)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {shipment.shipment.sendingHub.name} →{' '}
                      {shipment.shipment.receivingHub.name}
                    </p>
                  </>
                )}
              </ReadOnlyField>
              <ReadOnlyField label="Group">
                <p className="text-gray-800">{sendingGroup?.group.name}</p>
                <p className="text-gray-600 text-sm">
                  {sendingGroup?.group.primaryLocation.townCity}
                </p>
              </ReadOnlyField>
            </div>
          )}
        </header>
        <main className="flex-grow flex items-stretch">
          <PalletsEditor
            offerId={offerId}
            pallets={offer?.offer.pallets}
            initiateDeletePallet={selectPalletToDestroy}
          />
          <ConfirmationModal
            isOpen={deleteModalIsVisible}
            onCancel={hideDeleteModal}
            onConfirm={confirmDeletePallet}
            confirmLabel="Yes, delete pallet"
            title="Confirm pallet deletion"
          >
            Are you sure you want to delete this pallet? This action is
            irreversible.
          </ConfirmationModal>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ViewOfferPage
