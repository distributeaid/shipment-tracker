import { FunctionComponent, ReactNode } from 'react'

const FormFooter: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <footer className="mt-4 space-y-6">{children}</footer>

export default FormFooter
