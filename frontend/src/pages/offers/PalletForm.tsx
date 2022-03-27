import _pick from 'lodash/pick'
import { FunctionComponent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import TextField from '../../components/forms/TextField'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import useModalState from '../../hooks/useModalState'
import {
  PalletQuery,
  PalletUpdateInput,
  useDestroyPalletMutation,
  useUpdatePalletMutation,
} from '../../types/api-types'
import { formatPalletType } from '../../utils/format'

const PalletForm: FunctionComponent<{
  /**
   * The ID of the pallet to display
   */
  pallet: PalletQuery['pallet']
  onPalletDestroyed: () => void
}> = ({ pallet, onPalletDestroyed }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PalletUpdateInput>()

  useEffect(
    function resetForm() {
      if (pallet) {
        reset({
          ...pallet,
        })
      }
    },
    [pallet, reset],
  )

  const [updatePallet, { loading: mutationIsLoading }] =
    useUpdatePalletMutation()

  const submitForm = handleSubmit((input) => {
    // We need to send all the fields from PalletUpdateInput, even the ones
    // that didn't change. We then _pick the fields to make sure we don't send
    // things like `id` or `__typename`.
    let updatedLineItem = _pick(Object.assign({}, pallet, input), [
      'palletCount',
      'palletType',
    ])

    updatePallet({
      variables: { id: pallet.id, input: updatedLineItem },
    })
  })

  const [
    deleteConfirmationIsVisible,
    showDeleteConfirmation,
    hideDeleteConfirmation,
  ] = useModalState()

  const [destroyPallet] = useDestroyPalletMutation()

  const confirmDeletePallet = () => {
    destroyPallet({ variables: { id: pallet.id } }).then(() => {
      onPalletDestroyed()
      hideDeleteConfirmation()
    })
  }

  return (
    <form onSubmit={submitForm} className="pb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 text-lg flex items-center mb-4">Pallet</h2>
        <div className="space-x-4">
          <Button onClick={showDeleteConfirmation}>Delete pallet</Button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={deleteConfirmationIsVisible}
        confirmLabel="Delete this pallet"
        onCancel={hideDeleteConfirmation}
        onConfirm={confirmDeletePallet}
        title={`Confirm deleting pallet #${pallet.id}`}
      >
        <>
          <p className="mb-2">
            Are you certain you want to delete this pallet? This will also
            delete all the items stored on it.
          </p>
          <p>This action is irreversible.</p>
        </>
      </ConfirmationModal>
      {/* FIXME: make pallet type editable */}
      <ReadOnlyField label="Type">
        {formatPalletType(pallet.palletType)}
      </ReadOnlyField>
      <fieldset className="mt-12 ">
        <legend className={'block text-gray-600 text-sm mb-2'}>Count</legend>
        <TextField
          label="Total number of pallets"
          name="palletCount"
          type="number"
          required
          className="max-w-xs"
          helpText="You can offer exactly the same pallet configuration multiple times."
          min={1}
          register={register}
          errors={errors}
        />
      </fieldset>

      <fieldset className="mt-12 flex justify-end">
        <div className="space-x-4">
          <Button variant="primary" type="submit" disabled={mutationIsLoading}>
            Save pallet
          </Button>
        </div>
      </fieldset>
    </form>
  )
}

export default PalletForm
