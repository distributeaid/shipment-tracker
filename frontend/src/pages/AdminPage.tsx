import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import CogIcon from '../components/icons/CogIcon'
import UserIcon from '../components/icons/UserIcon'
import LayoutWithNav from '../layouts/LayoutWithNav'

/**
 * The root page for all admin activities
 */
const AdminPage: FunctionComponent = () => {
  return (
    <LayoutWithNav>
      <div className="bg-white max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200 md:flex items-center justify-between">
          <h1 className="text-navy-800 text-3xl mb-4 md:mb-0">Admin</h1>
        </header>
        <main className="p-4">
          <div className="text-navy-800 flex flex-col space-y-2">
            <Link to="/groups" className="flex items-center hover:underline">
              <CogIcon className="w-5 h-5 mr-1" />
              Manage groups
            </Link>
            <Link to="/users" className="flex items-center hover:underline">
              <UserIcon className="w-5 h-5 mr-1" /> Users
            </Link>
          </div>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default AdminPage
