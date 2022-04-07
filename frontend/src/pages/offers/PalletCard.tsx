import cx from 'classnames'
import { FunctionComponent, PropsWithChildren } from 'react'
import { PalletConfig } from '../../data/constants'

interface Props extends PalletConfig {
  isSelected?: boolean
  /**
   * Callback triggered when this card asks to be selected
   */
  onSelect: () => void
}

/**
 * A fully-controlled wrapper around a <radio> input that allows users to select
 * a pallet card within the CreatePalletModal.
 */
const PalletCard: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const cellClasses = cx('border-t-2 border-b-2 py-2 transition-colors', {
    'border-navy-600': props.isSelected,
    'border-transparent': !props.isSelected,
  })

  return (
    <tr onClick={props.onSelect} className="cursor-pointer">
      <td className={cx(cellClasses, 'pl-2 rounded-l border-l-2')}>
        <label className="cursor-pointer flex items-center font-semibold">
          <input
            className="inline-block mr-2"
            type="radio"
            name="pallet-type"
            value={props.type}
            checked={props.isSelected}
            onChange={props.onSelect}
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

export default PalletCard
