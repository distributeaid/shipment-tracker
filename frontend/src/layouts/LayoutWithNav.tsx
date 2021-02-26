import { FunctionComponent, ReactNode } from 'react'
import PageHeader from '../components/PageHeader'

interface Props {
  headerTitle?: ReactNode
}

/**
 * Application layout for logged-in users with a header at the top.
 */
const LayoutWithNav: FunctionComponent<Props> = ({ children, headerTitle }) => {
  return (
    <>
      <PageHeader title={headerTitle} />
      {children}
    </>
  )
}

export default LayoutWithNav
