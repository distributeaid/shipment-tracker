import cx from 'classnames'
import { FunctionComponent, SVGProps } from 'react'

interface Props extends SVGProps<SVGSVGElement> {
  direction?: 'up' | 'right' | 'down' | 'left'
}

const ChevronIcon: FunctionComponent<Props> = ({
  direction,
  className,
  ...otherProps
}) => {
  const classes = cx(className, {
    'transform rotate-90': direction === 'down',
    'transform rotate-180': direction === 'left',
    'transform -rotate-90': direction === 'up',
  })

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={classes}
      {...otherProps}
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default ChevronIcon
