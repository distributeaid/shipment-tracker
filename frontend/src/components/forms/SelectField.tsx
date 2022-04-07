import { ErrorMessage } from '@hookform/error-message'
import cx from 'classnames'
import _get from 'lodash/get'
import { nanoid } from 'nanoid'
import {
  ChangeEvent,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
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
import SelectInput from './SelectInput'
export interface SelectOption {
  label: ReactNode
  value: string | number
  disabled?: boolean
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  /**
   * The ID of the input, used to map the label to the input element
   */
  id?: string
  /**
   * A required label for the field
   */
  label: ReactNode
  /**
   * A required name added to the input element can be used for form parsing and
   * validation
   */
  name: string
  /**
   * If true, the input will not be editable, but the text will remain
   * selectable
   */
  readOnly?: boolean
  /**
   * The type of the input element. Defaults to "text"
   */
  type?: string
  /**
   * If true, the input field will not be editable or selectable
   */
  disabled?: boolean
  /**
   * A required list of options to display in the dropdown
   */
  options: readonly SelectOption[]
  /**
   * Callback triggered when the text changes. Works the same way as a regular
   * input element.
   */
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
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
  /**
   * A set of FieldErrors provided by `react-hook-form`
   */
  errors?: DeepMap<any, FieldError>
}

const SelectField: FunctionComponent<PropsWithChildren<Props>> = ({
  id,
  label,
  errors,
  options = [],
  className,
  ...otherProps
}) => {
  // Create a unique ID in case the use doesn't provide one
  const [uniqueId] = useState(nanoid())

  const fieldId = id || uniqueId

  // The name can be nested, eg 'primaryContact.name', in which case doing
  // errors['primaryContact.name'] wouldn't work. Thus, enter lodash.get
  const hasError = _get(errors, otherProps.name, null) != null

  return (
    <div className={cx(className, 'w-full')}>
      <Label htmlFor={fieldId} required={otherProps.required}>
        {label}
      </Label>

      <ErrorMessage
        name={otherProps.name}
        errors={errors || {}}
        as={InlineError}
      />

      <SelectInput {...otherProps} hasError={hasError} id={fieldId}>
        {options.map((option) => (
          <option
            value={option.value}
            key={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}

export default SelectField
