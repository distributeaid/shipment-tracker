import { FunctionComponent, useEffect } from 'react'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import Spinner from '../../components/Spinner'
import useModalState from '../../hooks/useModalState'
import { usePalletQuery } from '../../types/api-types'
import { formatPalletType } from '../../utils/format'

interface Props {
  palletId: number
}

const ViewPallet: FunctionComponent<Props> = ({ palletId }) => {
  const { data, refetch, loading: palletIsLoading } = usePalletQuery({
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

  const confirmDeletePallet = () => {
    // TODO
  }

  const pallet = data?.pallet

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 text-lg flex items-center">
          Pallet {palletId} {palletIsLoading && <Spinner className="ml-2" />}
        </h2>
        <div className="space-x-4">
          <Button onClick={showDeleteConfirmation}>Delete</Button>
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
        </div>
      )}
    </div>
  )
}

export default ViewPallet
