import { InputHTMLAttributes } from 'react'
import { RegisterOptions } from 'react-hook-form'

/**
 * Adds error messages for the following validations:
 * - required
 * - min
 * - max
 * - minLength
 * - maxLength
 */
export const augmentRegisterOptionsForInput = (
  registerOptions: RegisterOptions,
  inputProps: InputHTMLAttributes<HTMLInputElement>,
) => {
  const options = Object.assign({}, registerOptions)

  if (inputProps.type === 'number') {
    options.valueAsNumber = true

    // A required input with type="number" will always fail if the value is 0
    // Therefore, we need a custom validation
    if (options.required === true) {
      delete options.required
      options.validate = Object.assign({}, options.validate, {
        required: (value: any) => {
          if (value == null || isNaN(value) || value === '') {
            return 'This field is required'
          }
        },
      })
    }
  }

  if (options.required === true) {
    options.required = 'This field is required'
  }

  if (typeof options.min === 'number') {
    options.min = {
      value: options.min,
      message: `Enter a value equal to or greater than ${options.min}`,
    }
  }

  if (typeof options.max === 'number') {
    options.max = {
      value: options.max,
      message: `Enter a value equal to or less than ${options.max}`,
    }
  }

  if (typeof options.minLength === 'number') {
    options.minLength = {
      value: options.minLength,
      message: `Insert at least ${options.minLength} characters`,
    }
  }

  if (typeof options.maxLength === 'number') {
    options.maxLength = {
      value: options.maxLength,
      message: `Insert less than ${options.maxLength} characters`,
    }
  }

  return options
}

/**
 * Adds error messages for the following validations:
 * - required
 * - minLength
 * - maxLength
 */
export const augmentRegisterOptionsForTextArea = (
  registerOptions: RegisterOptions,
) => {
  const options = Object.assign({}, registerOptions)

  if (options.required === true) {
    options.required = 'This field is required'
  }

  if (typeof options.minLength === 'number') {
    options.minLength = {
      value: options.minLength,
      message: `Insert at least ${options.minLength} characters`,
    }
  }

  if (typeof options.maxLength === 'number') {
    options.maxLength = {
      value: options.maxLength,
      message: `Insert less than ${options.maxLength} characters`,
    }
  }

  return options
}
