import cx from 'classnames'
import { FunctionComponent, useState } from 'react'
import {
  OfferQuery,
  PalletDocument,
  useCreateLineItemMutation,
  usePalletLazyQuery,
} from '../../types/api-types'
import LineItemForm from './LineItemForm'
interface Props {
  pallets: OfferQuery['offer']['pallets']
  initiateDeletePallet: (palletId: number) => void
}

/**
 * This is a 2-column UI with a list of pallets on the left and details aobut
 * each line-item on the right.
 */
const PalletsEditor: FunctionComponent<Props> = ({ pallets }) => {
  // TODO move this to the URL?
  const [selectedPalletId, setSelectedPalletId] = useState<number>()

  const [createLineItem] = useCreateLineItemMutation()

  const [getPallet, selectedPalletData] = usePalletLazyQuery()

  const [selectedLineItemId, setSelectedLineItemId] = useState<number>()

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
      setSelectedLineItemId(data.data?.addLineItem.id)
    })
  }

  return (
    <section className="flex border border-gray-100">
      <div className="w-1/3">
        <ul className="divide-y divide-gray-100">
          {pallets.map((pallet) => (
            <li
              key={pallet.id}
              className="bg-white"
              onClick={() => selectPallet(pallet.id)}
            >
              <div
                className={cx('p-4 bg-white border-l-4 border-transparent', {
                  'border-blue-500': selectedPalletId === pallet.id,
                })}
              >
                <div className="mb-2 font-semibold">Pallet {pallet.id}</div>
                {selectedPalletId === pallet.id && (
                  <div className="border border-gray-200 flex flex-col mt-2 rounded">
                    {selectedPalletData.data?.pallet.lineItems.map((item) => (
                      <button
                        type="button"
                        className={cx('px-4 py-2 text-left border-l-4', {
                          'border-blue-500': item.id === selectedLineItemId,
                        })}
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedLineItemId(item.id)
                        }}
                      >
                        Item {item.id}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="px-4 py-2 text-left border-t"
                      onClick={(e) => {
                        e.stopPropagation()
                        addLineItem(pallet.id)
                      }}
                    >
                      Add a line item
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow border-l border-gray-100">
        {selectedPalletId == null && (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-500">
            <p>← Select a pallet</p>
          </div>
        )}
        {selectedPalletId != null && selectedLineItemId == null && (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-500">
            <p>← Select a line item</p>
          </div>
        )}
        {selectedPalletId != null && selectedLineItemId != null && (
          <div className="h-full w-full p-4">
            <LineItemForm lineItemId={selectedLineItemId} />
          </div>
        )}
      </div>
    </section>
  )
}

export default PalletsEditor
