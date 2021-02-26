import { FunctionComponent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import DistributeAidLogo from './DistributeAidLogo'

interface Props {
  title?: ReactNode
}

/**
 * A full-width element with branding and important links.
 */
const PageHeader: FunctionComponent<Props> = ({ title }) => {
  return (
    <header className="py-2 bg-da-blue-900">
      <div className="max-w-5xl px-4 mx-auto flex items-center">
        <Link to="/" aria-label="Go to the home page">
          <DistributeAidLogo />
        </Link>
        {title && <div className="ml-6 text-white">{title}</div>}
      </div>
    </header>
  )
}

export default PageHeader
