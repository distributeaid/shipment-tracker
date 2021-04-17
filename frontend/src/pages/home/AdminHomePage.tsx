import { FunctionComponent } from 'react'
import CogIcon from '../../components/icons/CogIcon'
import TruckIcon from '../../components/icons/TruckIcon'
import InternalLink from '../../components/InternalLink'
import ROUTES from '../../utils/routes'

const AdminHomePage: FunctionComponent = () => {
  return (
    <div>
      <p className="mb-4 text-gray-600 max-w-2xl">
        As an administrator, you are allowed to manage shipments, groups, and
        users. Remember that with great power comes great responsibility!
      </p>
      <p className="mb-8 text-gray-600 max-w-2xl">
        Please reach out to the Distribute Aid team if you have any questions.
      </p>
      <h2 className="text-gray-700 font-medium mb-2 text-lg">Quick links</h2>
      <ul className="space-y-1">
        <li>
          <InternalLink
            to={ROUTES.SHIPMENT_LIST}
            className="inline-flex items-center"
          >
            <TruckIcon className="w-4 h-4 mr-1" /> View all shipments
          </InternalLink>
        </li>
        <li>
          <InternalLink
            to={ROUTES.GROUP_LIST}
            className="inline-flex items-center"
          >
            <CogIcon className="w-4 h-4 mr-1" />
            Manage groups
          </InternalLink>
        </li>
      </ul>
    </div>
  )
}

export default AdminHomePage
