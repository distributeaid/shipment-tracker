import { FunctionComponent, useEffect } from 'react'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import Spinner from '../../components/Spinner'
import useModalState from '../../hooks/useModalState'
import { useDestroyPalletMutation, usePalletQuery } from '../../types/api-types'
import { formatPalletType } from '../../utils/format'
import PalletContentSummary from './PalletContentSummary'

interface Props {
  palletId: number
  onPalletDestroyed: () => void
}

const ViewPallet: FunctionComponent<Props> = ({
  palletId,
  onPalletDestroyed,
}) => {
  const {
    data,
    refetch,
    loading: palletIsLoading,
  } = usePalletQuery({
    variables: { id: palletId },
  })

  useEffect(
    function fetchLineItem() {
      refetch({ id: palletId })
    },
    [palletId, refetch],
  )

  const [
    deleteConfirmationIsVisible,
    showDeleteConfirmation,
    hideDeleteConfirmation,
  ] = useModalState()

  const [destroyPallet] = useDestroyPalletMutation()

  const confirmDeletePallet = () => {
    destroyPallet({ variables: { id: palletId } }).then(() => {
      onPalletDestroyed()
      hideDeleteConfirmation()
    })
  }

  const pallet = data?.pallet

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 text-lg flex items-center">
          Pallet {palletId} {palletIsLoading && <Spinner className="ml-2" />}
        </h2>
        <div className="space-x-4">
          <Button onClick={showDeleteConfirmation}>Delete pallet</Button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteConfirmationIsVisible}
        confirmLabel="Delete this pallet"
        onCancel={hideDeleteConfirmation}
        onConfirm={confirmDeletePallet}
        title={`Confirm deleting pallet #${palletId}`}
      >
        Are you certain you want to delete this pallet? This action is
        irreversible.
      </ConfirmationModal>
      {pallet && (
        <div>
          <ReadOnlyField label="Type">
            {formatPalletType(pallet.palletType)}
          </ReadOnlyField>
          <h4 className="mt-6 text-lg">Contents</h4>
          <PalletContentSummary lineItems={pallet.lineItems} />
          <div className="my-6 text-gray-700">
            <p className="mb-2">
              If you're using bulk bags or boxes, please note the following
              restrictions:
            </p>
            <ul className="list-disc list-inside">
              <li>
                a pallet can contain <strong>at most</strong> 1 bulk bag
              </li>
              <li>a pallet can contain a maximum of 36 boxes</li>
              <li>
                if a pallet contains a bulk bag, it can contain a maximum of 18
                boxes
              </li>
            </ul>
          </div>
          <p className="text-lg mb-2">Add items to this pallet</p>
          <div className="divide-y">
            <div className="py-2 flex justify-between items-center">
              <p>Full pallet</p>
              <Button>Add items</Button>
            </div>
            <div className="py-2 flex justify-between items-center">
              <div>
                <p>Bulk bag</p>
                <p className="text-sm text-gray-700">1 per pallet max</p>
              </div>
              <Button>Add bulk bag</Button>
            </div>
            <div className="py-2 flex justify-between items-center">
              <div>
                <p>Boxes</p>
                <p className="text-sm text-gray-700">36 per pallet max</p>
              </div>
              <Button>Add boxes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewPallet
