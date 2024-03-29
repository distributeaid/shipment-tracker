import { FunctionComponent, PropsWithChildren, useState } from 'react'
import useModalState from '../../hooks/useModalState'
import {
  OfferDocument,
  OfferQuery,
  OfferStatus,
  PalletCreateInput,
  PalletDocument,
  PalletType,
  ShipmentQuery,
  useCreateLineItemMutation,
  useCreatePalletMutation,
  usePalletLazyQuery,
  useUpdatePalletMutation,
} from '../../types/api-types'
import CreatePalletModal from './CreatePalletModal'
import LineItemForm from './LineItemForm'
import PalletsEditorSidebar from './PalletsEditorSidebar'
import ViewLineItem from './ViewLineItem'
import ViewPallet from './ViewPallet'
interface Props {
  offer: OfferQuery['offer']
  shipment: ShipmentQuery['shipment']
  pallets?: OfferQuery['offer']['pallets']
}

/**
 * This is a 2-column UI with a list of pallets on the left and details aobut
 * each line-item on the right.
 */
const PalletsEditor: FunctionComponent<PropsWithChildren<Props>> = ({
  offer,
  shipment,
  pallets = [],
}) => {
  // TODO move this to the URL
  const [selectedPalletId, setSelectedPalletId] = useState<number>()

  const [createLineItem] = useCreateLineItemMutation()

  const [getPallet, selectedPalletData] = usePalletLazyQuery()

  const [selectedLineItemId, setSelectedLineItemId] = useState<number>()

  const [lineItemToEditId, setLineItemToEditId] = useState<number>()

  const canEditOffer = offer.status === OfferStatus.Draft

  /**
   * Select a pallet and download its data, line items included
   */
  const selectPallet = (palletId: number) => {
    getPallet({ variables: { id: palletId } })
    setSelectedPalletId(palletId)
    setSelectedLineItemId(undefined)
  }

  /**
   * Create a new line item on the pallet provided, then re-fetch the selected
   * pallet's details.
   */
  const addLineItem = (palletId: number) => {
    if (!selectedPalletId) {
      return
    }

    createLineItem({
      variables: { palletId },
      refetchQueries: [
        {
          query: PalletDocument,
          variables: { id: selectedPalletId },
        },
      ],
    }).then((data) => {
      // Select the new line item and show a form to edit its fields
      const lineItemId = data.data?.addLineItem.id
      setSelectedLineItemId(lineItemId)
      setLineItemToEditId(lineItemId)
    })
  }

  const [createModalIsVisible, showCreatePalletModal, hideCreateModal] =
    useModalState()

  const [addPallet, { loading: mutationIsLoading, error: mutationError }] =
    useCreatePalletMutation({
      update: (cache, { data }) => {
        // Manually update the cache with the new pallet
        try {
          const offerData = cache.readQuery<OfferQuery>({
            query: OfferDocument,
            variables: { id: offer.id },
          })

          cache.writeQuery<OfferQuery>({
            query: OfferDocument,
            variables: { id: offer.id },
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

  const [updatePalletCount] = useUpdatePalletMutation()

  const onCreatePallet = (palletType: PalletType) => {
    const newPallet: PalletCreateInput = {
      palletType,
      offerId: offer.id,
    }

    addPallet({ variables: { input: newPallet } }).then((data) => {
      hideCreateModal()

      // Select the new pallet
      const palletId = data.data?.addPallet.id
      if (palletId) {
        setSelectedPalletId(palletId)
      }
    })
  }

  const onLineItemDeleted = () => {
    setSelectedLineItemId(undefined)
  }

  const selectLineItem = (lineItemId: number) => {
    setSelectedLineItemId(lineItemId)
  }

  return (
    <>
      <PalletsEditorSidebar
        pallets={pallets}
        selectedPalletId={selectedPalletId}
        selectedLineItemId={selectedLineItemId}
        isLoading={mutationIsLoading}
        createPallet={showCreatePalletModal}
        selectPallet={selectPallet}
        addLineItem={addLineItem}
        selectLineItemId={selectLineItem}
        selectedPalletData={selectedPalletData.data}
        canEdit={canEditOffer}
        updatePalletCount={(palletId, count) => {
          updatePalletCount({
            variables: {
              id: palletId,
              input: {
                palletCount: count,
              },
            },
          })
        }}
      />
      <div className="flex-grow border-l border-gray-100">
        {mutationError && (
          <div className="p-4 m-4 rounded bg-red-50 mb-6 text-red-800">
            <p className="font-semibold">Error:</p>
            <p>{mutationError.message}</p>
          </div>
        )}
        {selectedPalletId == null && (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-500">
            <p>← Select a pallet</p>
          </div>
        )}
        {selectedPalletId != null && selectedLineItemId == null && (
          <div className="h-full w-full p-8">
            <ViewPallet
              palletId={selectedPalletId}
              onPalletDestroyed={() => setSelectedPalletId(undefined)}
              canEdit={canEditOffer}
            />
          </div>
        )}
        {selectedPalletId != null && selectedLineItemId != null && (
          <div className="h-full w-full p-8">
            {lineItemToEditId === selectedLineItemId ? (
              <LineItemForm
                offer={offer}
                shipment={shipment}
                lineItemId={selectedLineItemId}
                palletType={
                  selectedPalletData.data?.pallet.palletType ||
                  PalletType.Standard
                }
                onEditingComplete={() => setLineItemToEditId(undefined)}
              />
            ) : (
              <ViewLineItem
                lineItemId={selectedLineItemId}
                onLineItemDeleted={onLineItemDeleted}
                editLineItem={() => setLineItemToEditId(selectedLineItemId)}
                canEdit={canEditOffer}
              />
            )}
          </div>
        )}
      </div>
      <CreatePalletModal
        disabled={mutationIsLoading}
        onCreatePallet={onCreatePallet}
        isOpen={createModalIsVisible}
        onRequestClose={hideCreateModal}
      />
    </>
  )
}

export default PalletsEditor
