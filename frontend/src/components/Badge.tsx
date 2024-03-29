import cx from 'classnames'
import { FunctionComponent, PropsWithChildren } from 'react'

export type BadgeColor =
  | 'red'
  | 'navy'
  | 'blue'
  | 'green'
  | 'gray'
  | 'yellow'
  | 'purple'

const Badge: FunctionComponent<
  PropsWithChildren<{
    color?: BadgeColor
    className?: string
  }>
> = ({ color = 'gray', className, children }) => {
  const classes = cx(className, 'rounded-sm py-1 px-2 text-sm font-semibold', {
    'bg-red-100 text-red-700': color === 'red',
    'bg-navy-100 text-navy-600': color === 'navy',
    'bg-blue-100 text-blue-700': color === 'blue',
    'bg-green-100 text-green-700': color === 'green',
    'bg-gray-100 text-gray-600': color === 'gray',
    'bg-yellow-100 text-yellow-700': color === 'yellow',
    'bg-purple-100 text-purple-700': color === 'purple',
  })

  return <span className={classes}>{children}</span>
}

export default Badge
