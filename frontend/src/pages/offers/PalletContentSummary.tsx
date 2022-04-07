import { FunctionComponent, PropsWithChildren } from 'react'
import { LineItem } from '../../types/api-types'
import { formatContainerType, gramsToKilos } from '../../utils/format'

type Props = {
  lineItems: Pick<
    LineItem,
    | 'id'
    | 'containerType'
    | 'description'
    | 'itemCount'
    | 'containerCount'
    | 'containerWeightGrams'
  >[]
}

const PalletContentSummary: FunctionComponent<PropsWithChildren<Props>> = ({
  lineItems,
}) => {
  if (lineItems.length === 0) {
    return <p className="text-gray-600">This pallet is empty</p>
  }

  const totalWeightInKilos = gramsToKilos(
    lineItems.reduce((sum, item) => {
      return sum + (item.containerWeightGrams ?? 0) * (item.containerCount ?? 1)
    }, 0),
  )

  const totalCountOfItems = lineItems.reduce(
    (sum, item) => sum + item.itemCount,
    0,
  )

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
          <th className="p-2 pl-4 text-left font-semibold">Items</th>
          <th className="p-2 text-right font-semibold">Amount</th>
          <th className="p-2 pr-4 text-right font-semibold">Weight</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map((item) => (
          <tr key={item.id} className="border border-gray-50">
            <td className="p-2 pl-4">
              <div className="text-gray-700 font-semibold">
                {item.description}
              </div>
              <div className="text-gray-600 text-sm">
                {formatContainerType(
                  item.containerType,
                  item.containerCount ?? 1,
                )}
              </div>
            </td>
            <td className="p-2 text-right">{item.itemCount}</td>
            <td className="p-2 pr-4 text-right">
              {gramsToKilos(
                (item.containerWeightGrams ?? 1) * (item.containerCount ?? 1),
              )}{' '}
              kg
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className="bg-gray-50 text-gray-600">
        <tr>
          <td className="p-2 pl-4 text-sm uppercase font-semibold">Total</td>
          <td className="p-2 text-right">{totalCountOfItems}</td>
          <td className="p-2 pr-4 text-right">{totalWeightInKilos} kg</td>
        </tr>
      </tfoot>
    </table>
  )
}

export default PalletContentSummary
