import cx from 'classnames'
import { FunctionComponent } from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'

const TabLink: FunctionComponent<LinkProps> = ({ children, ...otherProps }) => {
  const { pathname } = useLocation()
  const isActive = pathname === otherProps.to

  const classes = cx(
    'whitespace-no-wrap py-4 px-1 border-b-2 font-medium text-sm leading-5',
    {
      'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300': !isActive,
      'border-blue-500 text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700': isActive,
    },
  )

  return (
    <Link {...otherProps} className={classes}>
      {children}
    </Link>
  )
}

export default TabLink
