import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react'

const TabList: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children }) => (
  <div className="border-b border-gray-200 px-4 md:px-6">
    <nav className="flex -mb-px space-x-8">{children}</nav>
  </div>
)

export default TabList
