import { FunctionComponent } from 'react'
import TopNavigation from '../components/TopNavigation'

/**
 * Application layout for logged-in users with a header at the top.
 */
const LayoutWithNav: FunctionComponent = ({ children }) => {
  return (
    <>
      <TopNavigation />
      {children}
    </>
  )
}

export default LayoutWithNav
