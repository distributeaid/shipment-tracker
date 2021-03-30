import cx from 'classnames'
import { FunctionComponent, useState } from 'react'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { OfferQuery } from '../../types/api-types'

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
  const [selectedPallet, setSelectedPallet] = useState<typeof pallets[0]>()

  const addLineItem = () => {
    if (!selectedPallet) {
      return
    }
    const palletId = selectedPallet.id
  }

  // TODO things would be easier if we could get a single pallet + line items

  return (
    <section className="flex border border-gray-100">
      <div className="w-1/3">
        <header className="bg-gray-50 p-4 flex items-center justify-between">
          <h2 className="text-lg text-gray-800">Pallets</h2>
          <Button>Add</Button>
        </header>
        <ul className="divide-y divide-gray-100">
          {pallets.map((pallet) => (
            <li
              key={pallet.id}
              className={cx('p-4', {
                'bg-white': selectedPallet?.id === pallet.id,
                'bg-gray-50':
                  selectedPallet == null || selectedPallet.id !== pallet.id,
              })}
              onClick={() => setSelectedPallet(pallet)}
            >
              <div className="mb-2 font-semibold">Pallet {pallet.id}</div>
              <div className="flex space-x-2">
                <Badge>{pallet.palletType}</Badge>
                <Badge>{pallet.paymentStatus}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow">
        {selectedPallet == null && (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-500">
            <p>← Select a pallet to edit line items</p>
          </div>
        )}
        {selectedPallet != null && (
          <div className="h-full w-full">
            {selectedPallet.lineItems.map((item) => (
              <div key={item.id}>item {item.id}</div>
            ))}
            {selectedPallet.lineItems.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p>This pallet has no line items</p>
                  <Button onClick={addLineItem}>Add a line item</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default PalletsEditor
