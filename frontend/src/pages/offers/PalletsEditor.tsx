import cx from 'classnames'
import { FunctionComponent, useState } from 'react'
import Button from '../../components/Button'
import ChevronIcon from '../../components/icons/ChevronIcon'
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

  const [createModalIsVisible, showCreateModal, hideCreateModal] =
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

  return (
    <>
      <div className="w-80 flex-shrink-0 h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg text-gray-700">Pallets</span>
          <Button disabled={mutationIsLoading} onClick={showCreateModal}>
            Add a pallet
          </Button>
        </div>
        <ul className="divide-y divide-gray-100">
          {pallets.map((pallet, index) => (
            <li
              key={pallet.id}
              className="bg-white"
              data-qa={`pallet-${pallet.id}`}
              onClick={() => selectPallet(pallet.id)}
            >
              <div className="bg-white">
                <div
                  className={cx(
                    'p-4 flex items-center text-gray-800 cursor-pointer border-l-4 border-transparent',
                    {
                      'hover:bg-gray-100':
                        pallet.id !== selectedPalletId ||
                        selectedLineItemId != null,
                      'border-navy-600 font-semibold':
                        pallet.id === selectedPalletId,
                      'bg-navy-100':
                        pallet.id === selectedPalletId &&
                        selectedLineItemId == null,
                    },
                  )}
                >
                  <ChevronIcon
                    className="w-5 h-5 mr-4 text-gray-500"
                    direction={
                      pallet.id === selectedPalletId ? 'down' : 'right'
                    }
                  />
                  Pallet {index + 1}
                </div>
                {selectedPalletId === pallet.id && (
                  <div className="flex flex-col pb-4 pr-4 pl-8">
                    {selectedPalletData.data?.pallet.lineItems.map((item) => (
                      <button
                        type="button"
                        className={cx(
                          'px-4 py-2 text-left border-l-4 border-transparent',
                          {
                            'hover:bg-gray-100': item.id !== selectedLineItemId,
                            'border-navy-500 bg-navy-100 text-navy-700':
                              item.id === selectedLineItemId,
                          },
                        )}
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedLineItemId(item.id)
                        }}
                      >
                        {item.description || `Item ${item.id}`}
                      </button>
                    ))}
                    <Button
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        addLineItem(pallet.id)
                      }}
                    >
                      Add an item
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
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
