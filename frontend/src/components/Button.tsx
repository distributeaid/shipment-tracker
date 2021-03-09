import { FunctionComponent, ButtonHTMLAttributes, Ref } from 'react'
import cx from 'classnames'

import ButtonIcon from './ButtonIcon'

/**
 * By default, it should look like a neutral button
 *
 * If it needs added weight, use the primary variant
 * If it's in a table row and needs to be shorter, use the slim variant
 *
 * Inspiration:
 * - https://polaris.shopify.com/components/actions/button
 * - https://primer.style/css/components/buttons
 *
 */

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Use this in a table or list to avoid increasing the height of the container.
   */
  slim?: boolean
  /**
   * Choose the right button for your context
   * @param default This is the default button. Use another style if the button requires a different visual weight.
   * @param primary Used to highlight the most important actions. Use sparingly! Avoid showing multiple primary buttons in the same section.
   */
  variant?: 'default' | 'primary'
  /**
   * An optional way to pass a ref down to the <button> element
   */
  forwardRef?: Ref<HTMLButtonElement>
}

const Button: FunctionComponent<ButtonProps> & { Icon: typeof ButtonIcon } = ({
  variant = 'default',
  slim = false,
  type = 'button',
  forwardRef,
  ...otherProps
}) => {
  const { disabled, className, children } = otherProps

  const classes = cx(
    'inline-flex items-center text-sm leading-5 font-medium rounded whitespace-no-wrap focus:outline-none focus:shadow-outline transition ease-in-out duration-150',
    className,
    {
      // Default
      'bg-white border border-gray-300 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow focus:border-da-navy-200 active:bg-gray-50 active:text-gray-900':
        variant === 'default' && !disabled,
      'bg-gray-50 border border-gray-300 text-gray-400 focus:border-da-navy-200':
        variant === 'default' && disabled,
      // Primary variant
      'bg-da-navy-100 hover:bg-da-navy-50 border border-transparent text-white active:bg-da-navy-200':
        variant === 'primary' && !disabled,
      'bg-da-navy-200 border border-transparent text-da-navy-400':
        variant === 'primary' && disabled,
      // Sizing
      'px-4 py-2': !slim,
      'px-3 py-1': slim,
      // Disabled stuff
      'cursor-not-allowed': disabled,
    },
  )

  if (disabled) {
    otherProps['aria-disabled'] = 'true'
  }

  return (
    <button {...otherProps} ref={forwardRef} type={type} className={classes}>
      {children}
    </button>
  )
}

Button.Icon = ButtonIcon

export default Button
