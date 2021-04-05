import cx from 'classnames'
import _merge from 'lodash/merge'
import _pick from 'lodash/pick'
import { CSSProperties, FunctionComponent, SelectHTMLAttributes } from 'react'
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

const BACKGROUND_IMAGE: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundPosition: 'right .5rem center',
  backgroundSize: '1.5em 1.5em',
} as const

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
    'appearance-none bg-no-repeat w-full border px-3 py-2 rounded transition focus:outline-none focus:shadow-outline focus:ring ring-navy-300 focus:border-navy-600',
    {
      'border-gray-300 hover:border-gray-400': !hasError && !disabled,
      'border-red-400': hasError,
      'cursor-pointer': !disabled,
      'cursor-not-allowed bg-gray-100': disabled,
    },
  )

  if (register != null) {
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
        style={BACKGROUND_IMAGE}
        className={classes}
        {...register(name, customOptions)}
      >
        {children}
      </select>
    )
  }

  return (
    <select {...otherProps} style={BACKGROUND_IMAGE} className={classes}>
      {children}
    </select>
  )
}

export default SelectInput
