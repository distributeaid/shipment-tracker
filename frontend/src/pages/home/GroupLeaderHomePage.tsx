import { FunctionComponent } from 'react'
import ButtonLink from '../../components/ButtonLink'
import CheckIcon from '../../components/icons/CheckIcon'
import CogIcon from '../../components/icons/CogIcon'
import TruckIcon from '../../components/icons/TruckIcon'
import InternalLink from '../../components/InternalLink'
import { useGroupLeaderGroups } from '../../hooks/useGroupLeaderGroups'
import ROUTES, { groupViewRoute } from '../../utils/routes'

const GroupLeaderHomePage: FunctionComponent = () => {
  const groups = useGroupLeaderGroups()

  if (groups.length > 0) {
    return (
      <div>
        <h2 className="text-gray-700 font-medium mb-2 text-lg">Quick links</h2>
        <ul>
          <li>
            <InternalLink
              to={ROUTES.SHIPMENT_LIST}
              className="inline-flex items-center"
            >
              <TruckIcon className="w-4 h-4 mr-1" /> Shipments
            </InternalLink>
          </li>
          {groups.map((group) => (
            <li key={group.id}>
              <InternalLink
                to={groupViewRoute(group.id)}
                className="inline-flex items-center"
              >
                <CogIcon className="w-4 h-4 mr-1" />
                Group settings
                {groups.length > 1 && <span>for {group.name}</span>}
              </InternalLink>
            </li>
          ))}
        </ul>
        <h2 className="text-gray-700 font-medium mb-2 mt-8 text-lg">
          Onboarding
        </h2>
        <p className="text-gray-500">You've completed the onboarding.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-gray-700 font-medium mb-4 text-lg">Onboarding</h2>
      <div className="rounded border border-gray-200 p-4 relative mb-4">
        <CheckIcon className="w-6 h-6 absolute -right-2 -top-2 text-green-700" />
        <div className="font-semibold text-gray-600">1. Create an account</div>
        <div className="text-gray-500">This step is complete</div>
      </div>
      <div className="rounded border border-gray-200 p-4 relative md:flex items-center">
        <div className="flex-grow mb-4 md:mb-0">
          <div className="font-semibold text-gray-600">
            2. Set up your group
          </div>
          <div className="text-gray-500">Fill out a short questionnaire</div>
        </div>
        <ButtonLink
          className="w-full md:w-auto"
          variant="primary"
          to={ROUTES.GROUP_CREATE}
        >
          Create group
        </ButtonLink>
      </div>
    </div>
  )
}

export default GroupLeaderHomePage
