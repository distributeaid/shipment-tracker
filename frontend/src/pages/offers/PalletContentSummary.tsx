import { FunctionComponent } from 'react'
import { LineItem } from '../../types/api-types'
import { gramsToKilos } from '../../utils/format'

type Props = {
  lineItems: Pick<
    LineItem,
    | 'id'
    | 'offerPalletId'
    | 'status'
    | 'containerType'
    | 'category'
    | 'description'
    | 'itemCount'
    | 'dangerousGoods'
    | 'containerCount'
    | 'containerWeightGrams'
  >[]
}

const PalletContentSummary: FunctionComponent<Props> = ({ lineItems }) => {
  if (lineItems.length === 0) {
    return <div>This pallet is empty</div>
  }

  const totalWeightInKilos = gramsToKilos(
    lineItems.reduce((sum, item) => {
      return sum + (item.containerWeightGrams ?? 0)
    }, 0),
  )

  return (
    <ul className="divide-y">
      {lineItems.map((item) => (
        <li key={item.id} className="py-2">
          <div className="text-gray-700 font-semibold">{item.description}</div>
          <div className="text-gray-600">
            {item.itemCount} items total &bull; {item.containerCount ?? 1}{' '}
            {item.containerType}
          </div>
        </li>
      ))}
      <li className="pt-2">
        Total weight of contents: {totalWeightInKilos} kilos
      </li>
    </ul>
  )
}

export default PalletContentSummary
