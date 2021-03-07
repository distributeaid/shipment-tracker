import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithNav from '../layouts/LayoutWithNav'

/**
 * The root page for all admin activities
 */
const AdminPage: FunctionComponent = () => {
  return (
    <LayoutWithNav>
      <div className="text-da-navy-100 flex flex-col space-y-2">
        <Link to="/groups">Groups</Link>
        <Link to="/users">Users (in construction)</Link>
      </div>
    </LayoutWithNav>
  )
}

export default AdminPage
