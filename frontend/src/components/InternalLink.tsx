import cx from 'classnames'
import { FunctionComponent, PropsWithChildren } from 'react'
import { Link, LinkProps } from 'react-router-dom'

const InternalLink: FunctionComponent<PropsWithChildren<LinkProps>> = ({
  className,
  children,
  ...otherProps
}) => {
  const classes = cx('text-navy-700 font-semibold hover:underline', className)

  return (
    <Link className={classes} {...otherProps}>
      {children}
    </Link>
  )
}

export default InternalLink
