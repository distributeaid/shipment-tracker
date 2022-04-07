import { FunctionComponent, PropsWithChildren } from 'react'
import { PalletType } from '../../types/api-types'
import {
  PalletLineItem,
  validatePalletContents,
} from '../../utils/validatePalletContents'

type Props = {
  palletType: PalletType
  lineItems: PalletLineItem[]
}

const PalletContentValidator: FunctionComponent<PropsWithChildren<Props>> = ({
  palletType,
  lineItems,
}) => {
  const palletValidationResult = validatePalletContents(palletType, lineItems)

  if ('errors' in palletValidationResult) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded mb-4">
        <h4 className="font-semibold mb-2">Problematic pallet configuration</h4>
        <ul>
          {palletValidationResult.errors.map(({ message }, k) => (
            <li key={k}>{message}</li>
          ))}
        </ul>
      </div>
    )
  }

  return null
}

export default PalletContentValidator
