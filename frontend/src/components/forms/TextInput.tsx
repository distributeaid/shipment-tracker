import { FunctionComponent, InputHTMLAttributes } from 'react'
import cx from 'classnames'
import { FormRegisterType } from '../../types/form-types'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /**
   * If true, the field will be displayed with a red border
   */
  hasError?: boolean
  /**
   * The register function from `react-hook-form`'s `useForm()` hook used for validation and submission
   */
  register?: FormRegisterType
}

const TextInput: FunctionComponent<Props> = ({
  type = 'text',
  hasError = false,
  register,
  ...otherProps
}) => {
  const { disabled, readOnly, className } = otherProps

  const classes = cx(
    className,
    'w-full border px-3 py-2 rounded focus:outline-none focus:shadow-outline focus:border-da-navy-200',
    {
      'border-gray-300 hover:border-gray-400':
        !hasError && !readOnly && !disabled,
      'border-red-400': hasError,
      'bg-gray-100': readOnly || disabled,
      'cursor-not-allowed': disabled,
    },
  )
  return (
    <input
      {...otherProps}
      ref={register ? register({ required: otherProps.required }) : undefined}
      type={type}
      className={classes}
    />
  )
}

export default TextInput
