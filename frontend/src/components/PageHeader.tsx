import { FunctionComponent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import DistributeAidLogo from './DistributeAidLogo'
import DropdownMenu from './DropdownMenu'

interface Props {
  title?: ReactNode
  /**
   * If true, the user's information and "log out" button will be hidden.
   * Use this prop when you want to show the page header while things are
   * still loading.
   */
  hideControls?: boolean
}

/**
 * A full-width element that sits at the top of the page. It displays the DA
 * branding and a dropdown-menu with some account information.
 */
const PageHeader: FunctionComponent<Props> = ({ title, hideControls }) => {
  const { user, logout } = useAuth0()

  return (
    <header className="py-2 bg-da-blue-900">
      <div className="max-w-5xl px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" aria-label="Go to the home page">
            <DistributeAidLogo className="block" />
          </Link>
          {title && <span className="ml-6 text-white">{title}</span>}
        </div>
        {!hideControls && (
          <div className="flex items-center text-white">
            <DropdownMenu position="right">
              <DropdownMenu.Text>
                <div>{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </DropdownMenu.Text>
              <DropdownMenu.Divider />
              <DropdownMenu.Button onClick={() => logout()}>
                Log out
              </DropdownMenu.Button>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  )
}

export default PageHeader
