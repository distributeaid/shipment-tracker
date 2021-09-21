import { PropsWithChildren } from 'react-router/node_modules/@types/react'

const FormFooter = ({ children }: PropsWithChildren<unknown>) => (
  <footer className="mt-4">{children}</footer>
)

export default FormFooter
