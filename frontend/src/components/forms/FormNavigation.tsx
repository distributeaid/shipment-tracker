import { FC } from 'react'

const FormNavigation: FC = ({ children }) => (
  <nav className="flex flex-row justify-between">{children}</nav>
)

export default FormNavigation
