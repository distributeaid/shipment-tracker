import cx from 'classnames'
import _merge from 'lodash/merge'
import _omit from 'lodash/omit'
import _pick from 'lodash/pick'
import {
  FunctionComponent,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { augmentRegisterOptionsForInput } from './formUtils'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /**
   * If true, the field will be displayed with a red border
   */
  hasError?: boolean
  /**
   * The register function from `react-hook-form`'s `useForm()` hook used for validation and submission
   */
  register?: UseFormRegister<any>
  /**
   * A set of options in the format supported by `react-hook-form`.
   *
   * ⚠️ If validations for `min`, `max`, `minLength`, `maxLength`, or `required`
   * are provided in this object, they will override the props of the same name
   * passed individually. This allows users to define custom error messages if
   * they so wish:
   *
   * @example
   * <TextInput
   *   label="Age"
   *   required
   *   min={16} />
   *
   * @example
   * <TextInput
   *   label="Age"
   *   registerOptions={{
   *     required: "Age is a required field",
   *     min: {
   *       value: 16,
   *       message: "You must be at least 16 to create offers"
   *     }
   *   }} />
   */
  registerOptions?: RegisterOptions
}

const PROPS_TO_PICK = [
  'min',
  'max',
  'minLength',
  'maxLength',
  'required',
] as const

const TextInput: FunctionComponent<PropsWithChildren<Props>> = ({
  type = 'text',
  hasError = false,
  register,
  registerOptions,
  ...otherProps
}) => {
  const { disabled, readOnly, className, name } = otherProps
  if (!name) {
    throw new Error('Every input field needs a name')
  }

  const classes = cx(
    className,
    'w-full border px-3 py-2 rounded transition focus:outline-none focus:shadow-outline focus:ring ring-navy-300 focus:border-navy-600',
    {
      'border-gray-300 hover:border-gray-400':
        !hasError && !readOnly && !disabled,
      'border-red-400': hasError,
      'bg-gray-100': readOnly || disabled,
      'cursor-not-allowed': disabled,
    },
  )

  if (register) {
    /**
     * Merge the `registerOptions` onto the props. This allows users to define
     * custom validations if they so wish.
     * @see registerOptions
     */
    let customOptions: RegisterOptions = _merge(
      _pick(otherProps, PROPS_TO_PICK),
      registerOptions || {},
    )

    // Add validations and error messages
    customOptions = augmentRegisterOptionsForInput(customOptions, {
      ...otherProps,
      type,
    })

    // Custom validations don't mesh with browser validations, so if a register
    // hook is provided, we delete the browser validations
    otherProps = _omit(otherProps, [
      'min',
      'max',
      'minLength',
      'maxLength',
      'required',
    ])

    return (
      <input
        {...otherProps}
        type={type}
        className={classes}
        aria-invalid={hasError}
        {...register(name, customOptions)}
      />
    )
  }

  return (
    <input
      {...otherProps}
      aria-invalid={hasError}
      type={type}
      className={classes}
    />
  )
}

export default TextInput
