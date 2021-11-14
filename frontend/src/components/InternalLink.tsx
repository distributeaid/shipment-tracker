import cx from 'classnames'
import { FunctionComponent } from 'react'
import { Link, LinkProps } from 'react-router-dom'

const InternalLink: FunctionComponent<LinkProps> = ({
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
