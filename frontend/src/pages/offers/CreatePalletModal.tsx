import { FormEvent, FunctionComponent, useEffect, useState } from 'react'
import Button from '../../components/Button'
import Label from '../../components/forms/Label'
import { CloseReason, ModalBaseProps } from '../../components/modal/ModalBase'
import PlainModal from '../../components/modal/PlainModal'
import { PALLET_CONFIGS } from '../../data/constants'
import { PalletType } from '../../types/api-types'
import PalletCard from './PalletCard'

interface Props extends Pick<ModalBaseProps, 'onRequestClose' | 'isOpen'> {
  /**
   * Callback triggered by submitting the form in the modal
   */
  onCreatePallet: (palletType: PalletType) => void
  /**
   * If true, the controls in the modal will stop responding to user input
   */
  disabled?: boolean
}

/**
 * Allow users to create a new pallet for a specific offer.
 */
const CreatePalletModal: FunctionComponent<Props> = (props) => {
  const [palletType, setPalletType] = useState<PalletType>(PalletType.Standard)

  useEffect(
    function resetPalletTypeOnMount() {
      if (props.isOpen) {
        setPalletType(PalletType.Standard)
      }
    },
    [props.isOpen],
  )

  const onSubmitForm = (event: FormEvent) => {
    event.preventDefault()
    props.onCreatePallet(palletType)
  }

  const selectPalletType = (type: PalletType) => {
    if (!props.disabled) {
      setPalletType(type)
    }
  }

  return (
    <PlainModal
      modalWidth="40rem"
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
    >
      <form className="p-4" onSubmit={onSubmitForm}>
        <h2 className="text-lg font-semibold mb-6">Create a new pallet</h2>

        <Label required>Pallet type</Label>
        <p className="mb-4">
          Choose the pallet type that best matches the{' '}
          <strong>maximum dimensions</strong> of the items to transport. If your
          pallet doesn't fit within those dimensions, please let us know at{' '}
          <a
            className="text-blue-700 hover:underline"
            href="mailto:dom@distributeaid.org"
          >
            dom@distributeaid.org
          </a>
          .
        </p>
        <table className="w-full border-separate" style={{ borderSpacing: 0 }}>
          <thead>
            <tr className="text-gray-600">
              <th></th>
              <th className="pb-1 text-right uppercase text-sm text-gray-500 font-semibold">
                Weight
              </th>
              <th className="pb-1 text-right uppercase text-sm text-gray-500 font-semibold">
                Length
              </th>
              <th className="pb-1 text-right uppercase text-sm text-gray-500 font-semibold">
                Width
              </th>
              <th className="pb-1 pr-2 text-right uppercase text-sm text-gray-500 font-semibold border-r-2 border-transparent">
                Height
              </th>
            </tr>
          </thead>
          <tbody>
            {PALLET_CONFIGS.map((pallet) => (
              <PalletCard
                {...pallet}
                onSelect={() => selectPalletType(pallet.type)}
                isSelected={palletType === pallet.type}
                key={pallet.type}
              />
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            disabled={props.disabled}
            onClick={() => props.onRequestClose(CloseReason.Cancel)}
          >
            Cancel
          </Button>
          <Button disabled={props.disabled} type="submit" variant="primary">
            Create pallet
          </Button>
        </div>
      </form>
    </PlainModal>
  )
}

export default CreatePalletModal
