import { FunctionComponent, ReactNode } from 'react'

const FormNavigation: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <nav className="flex flex-row justify-between">{children}</nav>

export default FormNavigation
