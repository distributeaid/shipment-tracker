import cx from 'classnames'
import _merge from 'lodash/merge'
import _pick from 'lodash/pick'
import { FunctionComponent, SelectHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string
  /**
   * If true, the field will be displayed with a red border
   */
  hasError?: boolean
  /**
   * The register function from `react-hook-form`'s `useForm()` hook used for validation and submission
   */
  register?: UseFormRegister<any>
  /**
   * The register function from `react-hook-form`'s `useForm()` hook used for validation and submission
   */
  registerOptions?: RegisterOptions
  /**
   * If true, the value of each option will be cast to a number using parseInt()
   */
  castAsNumber?: boolean
}

const SelectInput: FunctionComponent<Props> = ({
  hasError = false,
  register,
  registerOptions,
  castAsNumber,
  ...otherProps
}) => {
  const { disabled, className, children, name } = otherProps

  const classes = cx(
    className,
    'appearance-none dropdown-arrow bg-no-repeat w-full border px-3 py-2 rounded transition focus:outline-none focus:shadow-outline focus:ring ring-navy-300 focus:border-navy-600',
    {
      'border-gray-300 hover:border-gray-400': !hasError && !disabled,
      'border-red-400': hasError,
      'cursor-pointer': !disabled,
      'cursor-not-allowed bg-gray-100': disabled,
    },
  )

  if (register) {
    const customOptions: RegisterOptions = _merge(
      _pick(otherProps, ['required']),
      registerOptions,
    )

    if (castAsNumber) {
      customOptions.valueAsNumber = true
    }

    if (otherProps.required) {
      customOptions.required = 'This field is required'
      delete otherProps.required
    }

    return (
      <select
        {...otherProps}
        className={classes}
        {...register(name, customOptions)}
      >
        {children}
      </select>
    )
  }

  return (
    <select {...otherProps} className={classes}>
      {children}
    </select>
  )
}

export default SelectInput
