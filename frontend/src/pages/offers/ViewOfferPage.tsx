import { FunctionComponent, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import useModalState from '../../hooks/useModalState'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  OfferDocument,
  OfferQuery,
  PalletCreateInput,
  PalletType,
  useCreatePalletMutation,
  useDestroyPalletMutation,
  useGroupQuery,
  useOfferQuery,
  useShipmentQuery,
} from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import { shipmentViewOffersRoute } from '../../utils/routes'
import CreatePalletModal from './CreatePalletModal'
import PalletsTable from './PalletsTable'

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
    createModalIsVisible,
    showCreateModal,
    hideCreateModal,
  ] = useModalState()

  const [
    addPallet,
    { loading: mutationIsLoading, error: mutationError },
  ] = useCreatePalletMutation({
    update: (cache, { data }) => {
      // Manually update the cache with the new pallet
      try {
        const offerData = cache.readQuery<OfferQuery>({
          query: OfferDocument,
          variables: { id: offerId },
        })

        cache.writeQuery<OfferQuery>({
          query: OfferDocument,
          variables: { id: offerId },
          data: {
            offer: Object.assign({}, offerData!.offer, {
              pallets: [...offerData!.offer.pallets, data!.addPallet],
            }),
          },
        })
      } catch (error) {
        console.error(error)
      }
    },
  })

  const onCreatePallet = (palletType: PalletType) => {
    const newPallet: PalletCreateInput = {
      palletType,
      offerId,
    }

    addPallet({ variables: { input: newPallet } }).then(hideCreateModal)
  }

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
  // returns the offer
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
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content bg-white">
        <header className="p-6 border-b border-gray-200">
          <InternalLink
            className="inline-block mb-2"
            to={shipmentViewOffersRoute(shipmentId)}
          >
            ← back to shipment
          </InternalLink>
          <h1 className="text-navy-800 text-3xl">Offer details</h1>
        </header>
        <main className="p-4 md:p-6 pb-20 space-y-6">
          {mutationError && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{mutationError.message}</p>
            </div>
          )}
          {offer?.offer && (
            <>
              <ReadOnlyField label="Shipment">
                {shipment?.shipment && (
                  <>
                    <p className="">{formatShipmentName(shipment.shipment)}</p>
                    <p className="text-gray-500 text-sm">
                      {shipment.shipment.sendingHub.name} →{' '}
                      {shipment.shipment.receivingHub.name}
                    </p>
                  </>
                )}
              </ReadOnlyField>
              <ReadOnlyField label="Group">
                {sendingGroup?.group.name}
              </ReadOnlyField>
              <div className="flex justify-between items-center">
                <h2 className="text-gray-700 font-semibold">Pallets</h2>
                {offer.offer.pallets.length > 0 && (
                  <Button
                    disabled={mutationIsLoading}
                    onClick={showCreateModal}
                  >
                    Add a pallet
                  </Button>
                )}
              </div>
              {offer.offer.pallets.length === 0 && (
                <div className="p-4 flex flex-col space-y-4 items-center justify-center text-gray-500 bg-gray-50 rounded">
                  <span>There are no pallets in this offer</span>
                  <Button
                    disabled={mutationIsLoading}
                    onClick={showCreateModal}
                  >
                    Add a pallet
                  </Button>
                </div>
              )}
              {offer.offer.pallets.length > 0 && (
                <PalletsTable
                  pallets={offer.offer.pallets}
                  initiateDeletePallet={selectPalletToDestroy}
                />
              )}
            </>
          )}
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
          <CreatePalletModal
            disabled={mutationIsLoading}
            onCreatePallet={onCreatePallet}
            isOpen={createModalIsVisible}
            onRequestClose={hideCreateModal}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ViewOfferPage
