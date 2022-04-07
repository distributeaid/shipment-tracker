import { FunctionComponent, ReactNode } from 'react'

const DropdownMenuText: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className="px-4 py-2">{children}</div>
}

export default DropdownMenuText
