import { PropsWithChildren } from 'react-router/node_modules/@types/react'

const FormNavigation = ({ children }: PropsWithChildren<unknown>) => (
  <nav className="flex flex-row justify-between">{children}</nav>
)

export default FormNavigation
