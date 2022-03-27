import { FunctionComponent, useEffect } from 'react'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import Spinner from '../../components/Spinner'
import { usePalletQuery } from '../../types/api-types'
import { formatPalletType } from '../../utils/format'
import PalletContentSummary from './PalletContentSummary'
import PalletContentValidator from './PalletContentValidator'
import PalletForm from './PalletForm'

interface Props {
  palletId: number
  onPalletDestroyed: () => void
  /**
   * Whether this pallet can be edited (edits are only allowed for draft offers)
   */
  canEdit: boolean
}

const ViewPallet: FunctionComponent<Props> = ({
  palletId,
  onPalletDestroyed,
  canEdit,
}) => {
  const {
    data,
    refetch,
    loading: palletIsLoading,
  } = usePalletQuery({
    variables: { id: palletId },
  })

  useEffect(
    function fetchLineItems() {
      refetch({ id: palletId })
    },
    [palletId, refetch],
  )

  const pallet = data?.pallet

  return (
    <div>
      {pallet && (
        <>
          {canEdit && (
            <PalletForm pallet={pallet} onPalletDestroyed={onPalletDestroyed} />
          )}
          {!canEdit && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-700 text-lg flex items-center">
                  Pallet {palletIsLoading && <Spinner className="ml-2" />}
                </h2>
              </div>
              <div>
                <ReadOnlyField label="Count">
                  {pallet.palletCount}
                </ReadOnlyField>
                <ReadOnlyField label="Type">
                  {formatPalletType(pallet.palletType)}
                </ReadOnlyField>
              </div>
            </>
          )}
          <div>
            <h3 className="mt-6 mb-2 text-lg">Contents</h3>
            <PalletContentValidator
              palletType={pallet.palletType}
              lineItems={pallet.lineItems}
            />
            <PalletContentSummary lineItems={pallet.lineItems} />
            <div className="my-6 text-gray-700 bg-gray-50 rounded p-4">
              <p className="mb-2">
                If you're using bulk bags or boxes, please note the following
                restrictions:
              </p>
              <ul className="list-disc list-inside">
                <li>a pallet can contain at most 1 bulk bag</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ViewPallet
