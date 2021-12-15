import cx from 'classnames'
import _merge from 'lodash/merge'
import _omit from 'lodash/omit'
import _pick from 'lodash/pick'
import { FunctionComponent, TextareaHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'
import { augmentRegisterOptionsForTextArea } from './formUtils'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
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
   * @example
   * <TextArea
   *   label="Age"
   *   required
   *   minLength={16} />
   *
   * @example
   * <TextArea
   *   label="Age"
   *   registerOptions={{
   *     required: "Input is required.",
   *     maxLength: {
   *       value: 255,
   *       message: "You must input at most 255 characters."
   *     }
   *   }} />
   */
  registerOptions?: RegisterOptions
}

const PROPS_TO_PICK = ['minLength', 'maxLength', 'required'] as const

const TextArea: FunctionComponent<Props> = ({
  hasError = false,
  register,
  registerOptions,
  ...otherProps
}) => {
  const { disabled, readOnly, className, name } = otherProps
  if (!name) {
    throw new Error('Every textarea field needs a name')
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
    customOptions = augmentRegisterOptionsForTextArea(customOptions)

    // Custom validations don't mesh with browser validations, so if a register
    // hook is provided, we delete the browser validations
    otherProps = _omit(otherProps, ['minLength', 'maxLength', 'required'])

    return (
      <textarea
        {...otherProps}
        className={classes}
        aria-invalid={hasError}
        {...register(name, customOptions)}
      />
    )
  }

  return (
    <textarea {...otherProps} aria-invalid={hasError} className={classes} />
  )
}

export default TextArea
