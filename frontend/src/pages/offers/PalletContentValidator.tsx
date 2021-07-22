import { FunctionComponent } from 'react'
import { LineItem } from '../../types/api-types'
import { validatePalletContents } from '../../utils/data'

type Props = {
  lineItems: Pick<LineItem, 'containerType' | 'containerCount'>[]
}

const PalletContentValidator: FunctionComponent<Props> = ({ lineItems }) => {
  const { valid, error } = validatePalletContents(lineItems)

  if (!valid) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
        <h4 className="font-semibold mb-2">Invalid pallet contents</h4>
        <p>{error}</p>
      </div>
    )
  }

  return null
}

export default PalletContentValidator
