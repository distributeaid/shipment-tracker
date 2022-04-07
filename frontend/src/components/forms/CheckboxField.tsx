import cx from 'classnames'
import {
  FunctionComponent,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  containerClassName?: string
}

const CheckboxField: FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  containerClassName,
  ...otherProps
}) => (
  <label
    className={cx(
      'flex items-center space-x-2 cursor-pointer',
      containerClassName,
    )}
  >
    <input type="checkbox" {...otherProps} />
    <span>{label}</span>
  </label>
)

export default CheckboxField
