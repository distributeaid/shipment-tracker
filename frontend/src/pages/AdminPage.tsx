import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithNav from '../layouts/LayoutWithNav'

/**
 * The root page for all admin activities
 */
const AdminPage: FunctionComponent = () => {
  return (
    <LayoutWithNav>
      <div className="bg-white max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <h1 className="text-navy-800 text-3xl mb-2">Admin</h1>
        <div className="text-navy-800 flex flex-col space-y-2">
          <Link to="/groups">Groups</Link>
          <Link to="/users">Users (in construction)</Link>
        </div>
      </div>
    </LayoutWithNav>
  )
}

export default AdminPage
