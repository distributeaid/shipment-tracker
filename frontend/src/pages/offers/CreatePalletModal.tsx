import cx from 'classnames'
import { FormEvent, FunctionComponent, useEffect, useState } from 'react'
import Button from '../../components/Button'
import Label from '../../components/forms/Label'
import { CloseReason, ModalBaseProps } from '../../components/model/ModalBase'
import PlainModal from '../../components/model/PlainModal'
import { PalletType } from '../../types/api-types'

interface Props extends Pick<ModalBaseProps, 'onRequestClose' | 'isOpen'> {
  onCreatePallet: (palletType: PalletType) => void
}

interface PalletCardProps extends PalletConfig {
  isSelected?: boolean
  onClick: (type: PalletType) => void
}

const PalletCard: FunctionComponent<PalletCardProps> = (props) => {
  const cellClasses = cx('border-t-2 border-b-2 py-2 transition-colors', {
    'border-navy-600': props.isSelected,
    'border-transparent': !props.isSelected,
  })

  return (
    <tr onClick={() => props.onClick(props.type)} className="cursor-pointer">
      <td className={cx(cellClasses, 'pl-2 rounded-l border-l-2')}>
        <label className="cursor-pointer flex items-center font-semibold">
          <input
            className="inline-block mr-2"
            type="radio"
            name="pallet-type"
            value={props.type}
            checked={props.isSelected}
            onChange={() => props.onClick(props.type)}
          />
          {props.name}
        </label>
      </td>
      <td className={cx('text-lg text-right', cellClasses)}>
        {props.weightKg} <span className="text-gray-500">kg</span>
      </td>
      <td className={cx('text-lg text-right', cellClasses)}>
        {props.lengthCm} <span className="text-gray-500">cm</span>
      </td>
      <td className={cx('text-lg text-right', cellClasses)}>
        {props.widthCm} <span className="text-gray-500">cm</span>
      </td>
      <td
        className={cx(
          'text-lg text-right pr-2 rounded-r border-r-2',
          cellClasses,
        )}
      >
        {props.heightCm} <span className="text-gray-500">cm</span>
      </td>
    </tr>
  )
}

interface PalletConfig {
  name: string
  type: PalletType
  weightKg: number
  lengthCm: number
  widthCm: number
  heightCm: number
}

const PALLET_CONFIGS: PalletConfig[] = [
  {
    name: 'Standard pallet',
    type: PalletType.Standard,
    weightKg: 700,
    lengthCm: 120,
    widthCm: 120,
    heightCm: 175,
  },
  {
    name: 'Euro pallet',
    type: PalletType.Euro,
    weightKg: 550,
    lengthCm: 120,
    widthCm: 80,
    heightCm: 175,
  },
  {
    name: 'Ton bag',
    type: PalletType.Custom,
    weightKg: 300,
    lengthCm: 100,
    widthCm: 100,
    heightCm: 90,
  },
]

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
    setPalletType(type)
  }

  return (
    <PlainModal
      modalWidth="35rem"
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
    >
      <form className="p-4" onSubmit={onSubmitForm}>
        <h2 className="text-lg font-semibold mb-6">Create a new pallet</h2>

        <Label required>Pallet type</Label>
        <p className="mb-4">
          Choose the pallet type that best matches the items to transport.
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
                onClick={selectPalletType}
                isSelected={palletType === pallet.type}
                key={pallet.type}
              />
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end space-x-4">
          <Button onClick={() => props.onRequestClose(CloseReason.Cancel)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create pallet
          </Button>
        </div>
      </form>
    </PlainModal>
  )
}

export default CreatePalletModal
