import { FunctionComponent } from 'react'
import { PalletQuery } from '../../types/api-types'
import { validatePalletContents } from '../../utils/data'

type Props = {
  pallet: PalletQuery['pallet']
}

const PalletContentValidator: FunctionComponent<Props> = ({ pallet }) => {
  const { valid, error } = validatePalletContents(pallet)

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
