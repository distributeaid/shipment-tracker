import { FunctionComponent } from 'react'
import logo60 from '../images/da-logo-60.png'
import logo120 from '../images/da-logo-120.png'
import logo180 from '../images/da-logo-180.png'

/**
 * Image that displays the Distribute Aid logo and wordmark.
 */
const DistributeAidLogo: FunctionComponent = () => (
  <img
    alt=""
    className="block"
    width="60"
    height="48"
    srcSet={`${logo60} 1x, ${logo120} 2x, ${logo180} 3x`}
  />
)

export default DistributeAidLogo
