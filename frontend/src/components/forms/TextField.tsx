import { ErrorMessage } from '@hookform/error-message'
import cx from 'classnames'
import _get from 'lodash/get'
import { nanoid } from 'nanoid'
import {
  ChangeEvent,
  FunctionComponent,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react'
import {
  DeepMap,
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'
import InlineError from './InlineError'
import Label from './Label'
import TextInput from './TextInput'

const isDev = process.env.NODE_ENV === 'development'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  /**
   * The ID of the input, used to map the label to the input element
   */
  id?: string
  /**
   * A required label for the field
   */
  label: ReactNode
  /**
   * A name added to the input element can be used for form parsing and
   * validation
   */
  name: string
  /**
   * A placeholder value for the input
   */
  placeholder?: string
  /**
   * If true, the input will not be editable, but the text will remain
   * selectable
   */
  readOnly?: boolean
  /**
   * A string that represents a custom validation error
   */
  error?: string
  /**
   * The type of the input element. Defaults to "text"
   */
  type?: string
  /**
   * If true, the input field will not be editable or selectable
   */
  disabled?: boolean
  /**
   * Callback triggered when the text changes. Works the same way as a regular
   * input element.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /**
   * The register function from `react-hook-form`'s `useForm()` hook used for validation and submission
   */
  register?: UseFormRegister<any>
  /**
   * The register function from `react-hook-form`'s `useForm()` hook used for validation and submission
   */
  registerOptions?: RegisterOptions
  /**
   * A set of FieldErrors provided by `react-hook-form`
   */
  errors?: DeepMap<any, FieldError>
  /**
   * An optional way to provide extra information about this field
   */
  helpText?: ReactNode
}

const TextField: FunctionComponent<PropsWithChildren<Props>> = ({
  id,
  label,
  errors,
  helpText,
  ...otherProps
}) => {
  // Create a unique ID in case the use doesn't provide one
  const [uniqueId] = useState(nanoid())

  const fieldId = id || uniqueId

  // The name can be nested, eg 'primaryContact.name', in which case doing
  // errors['primaryContact.name'] wouldn't work. Thus, enter lodash.get
  const hasError = _get(errors, otherProps.name, null) != null

  if (isDev && otherProps.register != null && errors == null) {
    console.warn(`The field "${otherProps.name}" is missing an "errors" prop`)
  }

  return (
    <div className={cx('w-full', { hidden: otherProps.hidden })}>
      <Label htmlFor={fieldId} required={otherProps.required}>
        {label}
      </Label>
      {helpText && <p className="text-sm text-gray-600 mb-2">{helpText}</p>}
      <ErrorMessage
        name={otherProps.name}
        errors={errors || {}}
        as={InlineError}
      />
      <TextInput {...otherProps} hasError={hasError} id={fieldId} />
    </div>
  )
}

export default TextField
