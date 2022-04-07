import cx from 'classnames'
import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react'

const PlaceholderField: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ className, ...otherProps }) => {
  return (
    <div className={cx('w-full', className)} {...otherProps}>
      <div className="bg-gray-200 rounded mb-2 h-5 w-1/2"></div>
      <div className="bg-gray-200 rounded border border-gray-200 p-2">
        &nbsp;
      </div>
    </div>
  )
}

export default PlaceholderField
