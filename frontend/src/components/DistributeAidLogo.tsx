import { FunctionComponent } from 'react'
import logo60 from '../images/da-logo-60.png'
import logo120 from '../images/da-logo-120.png'
import logo180 from '../images/da-logo-180.png'

interface Props {
  alt?: string
  className?: string
}

/**
 * Image that displays the Distribute Aid logo and wordmark.
 */
const DistributeAidLogo: FunctionComponent<Props> = ({
  alt = '',
  className,
}) => (
  <img
    alt={alt}
    className={className}
    width="60"
    height="48"
    srcSet={`${logo60} 1x, ${logo120} 2x, ${logo180} 3x`}
  />
)

export default DistributeAidLogo
