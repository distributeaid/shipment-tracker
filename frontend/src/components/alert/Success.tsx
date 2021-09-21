import { FunctionComponent, useState } from 'react'
import CloseIcon from './CloseIcon'

const Success: FunctionComponent<{ className?: string }> = ({
  children,
  className,
}) => {
  const [closed, setClosed] = useState<boolean>(false)
  if (closed) return null
  return (
    <div
      className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative ${className}`}
      role="alert"
    >
      {children}
      <CloseIcon color="text-green-500" onClick={() => setClosed(true)} />
    </div>
  )
}

export default Success
