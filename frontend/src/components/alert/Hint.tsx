import { useState } from 'react'
import { withLocalStorage } from '../../utils/withLocalStorage'

export const Hint = ({
  id,
  title,
  text,
  className,
}: {
  id: string
  title: string | JSX.Element
  text: string | JSX.Element
  className?: string
}) => {
  const storedIsHidden = withLocalStorage<boolean>(`${id}:isHidden`, false)

  const [isHidden, setIsHidden] = useState<boolean>(storedIsHidden.get())

  if (isHidden) return null

  return (
    <div
      className={`bg-navy-100 border border-navy-400 text-navy-700 px-4 py-3 rounded relative ${className}`}
      role="alert"
    >
      <strong className="font-bold pr-2">
        <em>{title}</em>
      </strong>
      <span className="block sm:inline">{text}</span>
      <span
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={() => {
          storedIsHidden.set(true)
          setIsHidden(true)
        }}
      >
        <svg
          className="fill-current h-6 w-6 text-navy-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  )
}
