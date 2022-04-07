import { FunctionComponent, PropsWithChildren, useState } from 'react'
import CloseIcon from './CloseIcon'

const Error: FunctionComponent<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  const [closed, setClosed] = useState<boolean>(false)
  if (closed) return null
  return (
    <div
      className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}
      role="alert"
    >
      {children}
      <CloseIcon color="text-red-500" onClick={() => setClosed(true)} />
    </div>
  )
}

export default Error
