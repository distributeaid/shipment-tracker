import cx from 'classnames'
import { ButtonHTMLAttributes, FunctionComponent } from 'react'

export const DisableableButton: FunctionComponent<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { disabled: boolean }
> = ({ disabled, children, className, ...rest }) => (
  <button
    {...rest}
    className={cx(
      `text-lg px-4 py-2 rounded-sm w-full`,
      {
        'text-white bg-navy-800 hover:bg-opacity-90 hover:shadow': !disabled,
        'text-gray bg-gray-500 cursor-not-allowed': disabled,
      },
      className,
    )}
    type="button"
  >
    {children}
  </button>
)
