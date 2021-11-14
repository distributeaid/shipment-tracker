import { PropsWithChildren } from 'react-router/node_modules/@types/react'

const FormFooter = ({ children }: PropsWithChildren<unknown>) => (
  <footer className="mt-4 space-y-6">{children}</footer>
)

export default FormFooter
