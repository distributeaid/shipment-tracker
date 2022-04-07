import {
  ButtonHTMLAttributes,
  FunctionComponent,
  PropsWithChildren,
} from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const DropdownMenuButton: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  ...otherProps
}) => {
  return (
    <button
      type="button"
      className="block px-4 py-2 w-full text-left hover:bg-gray-100"
      {...otherProps}
    >
      {children}
    </button>
  )
}

export default DropdownMenuButton
