import { FunctionComponent, useState } from 'react'
import useModalState from '../../hooks/useModalState'
import {
  OfferDocument,
  OfferQuery,
  PalletCreateInput,
  PalletDocument,
  PalletType,
  useCreateLineItemMutation,
  useCreatePalletMutation,
  usePalletLazyQuery,
} from '../../types/api-types'
import CreatePalletModal from './CreatePalletModal'
import LineItemForm from './LineItemForm'
import PalletsEditorSidebar from './PalletsEditorSidebar'
import ViewLineItem from './ViewLineItem'
import ViewPallet from './ViewPallet'
interface Props {
  offerId: number
  pallets?: OfferQuery['offer']['pallets']
}

/**
 * This is a 2-column UI with a list of pallets on the left and details aobut
 * each line-item on the right.
 */
const PalletsEditor: FunctionComponent<Props> = ({ offerId, pallets = [] }) => {
  // TODO move this to the URL
  const [selectedPalletId, setSelectedPalletId] = useState<number>()

  const [createLineItem] = useCreateLineItemMutation()

  const [getPallet, selectedPalletData] = usePalletLazyQuery()

  const [selectedLineItemId, setSelectedLineItemId] = useState<number>()

  const [allowEditingLineItem, setEditingMode] = useState(false)

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
      setSelectedLineItemId(data.data?.addLineItem.id)
      setEditingMode(true)
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
            />
          </div>
        )}
        {selectedPalletId != null && selectedLineItemId != null && (
          <div className="h-full w-full p-8">
            {allowEditingLineItem ? (
              <LineItemForm
                lineItemId={selectedLineItemId}
                palletType={
                  selectedPalletData.data?.pallet.palletType ||
                  PalletType.Standard
                }
                onEditingComplete={() => setEditingMode(false)}
              />
            ) : (
              <ViewLineItem
                lineItemId={selectedLineItemId}
                onLineItemDeleted={onLineItemDeleted}
                editLineItem={() => setEditingMode(true)}
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
