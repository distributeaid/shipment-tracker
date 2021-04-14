import { FunctionComponent, useContext } from 'react'
import { useParams } from 'react-router-dom'
import ButtonLink from '../../components/ButtonLink'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import { UserProfileContext } from '../../components/UserProfileContext'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { useGroupQuery } from '../../types/api-types'
import { formatCountryCodeToName, formatGroupType } from '../../utils/format'
import ROUTES, { groupEditRoute } from '../../utils/routes'

const GroupViewPage: FunctionComponent = () => {
  const { profile } = useContext(UserProfileContext)

  // Extract the group's ID from the URL
  const groupId = parseInt(useParams<{ groupId: string }>().groupId, 10)

  // Load the group's information
  const { data: group } = useGroupQuery({
    variables: { id: groupId },
  })

  const groupData = group?.group

  const canEditGroup = profile?.isAdmin || profile?.groupId === groupId

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200 md:flex items-center">
          <div className="flex-grow">
            {profile?.isAdmin && (
              <InternalLink
                className="inline-block mb-2"
                to={ROUTES.GROUP_LIST}
              >
                ← back to list
              </InternalLink>
            )}
            <h1 className="text-navy-800 text-2xl md:text-3xl mb-2">
              {groupData?.name}
            </h1>
            <p className="text-gray-700">
              Aid groups are entities that support the distribution of items and
              services across the world.
            </p>
          </div>
          {canEditGroup && (
            <div className="flex-shrink mt-4 md:mt-0">
              <ButtonLink to={groupEditRoute(groupId)}>Edit</ButtonLink>
            </div>
          )}
        </header>
        {groupData && (
          <main className="p-4 md:p-6 max-w-lg pb-20 space-y-6">
            <ReadOnlyField label="Group type">
              {groupData && formatGroupType(groupData.groupType)}
            </ReadOnlyField>
            <ReadOnlyField label="Location">
              {groupData.primaryLocation.townCity},{' '}
              {formatCountryCodeToName(groupData.primaryLocation.countryCode)}
            </ReadOnlyField>
            <ReadOnlyField label="Primary contact">
              <p className="font-semibold mb-4">
                {groupData.primaryContact.name}
              </p>
              <div className="space-y-2">
                <ReadOnlyField label="Email" hideIfEmpty stacked>
                  {groupData.primaryContact.email}
                </ReadOnlyField>
                <ReadOnlyField label="WhatsApp" hideIfEmpty stacked>
                  {groupData.primaryContact.whatsApp}
                </ReadOnlyField>
                <ReadOnlyField label="Phone" hideIfEmpty stacked>
                  {groupData.primaryContact.phone}
                </ReadOnlyField>
                <ReadOnlyField label="Signal" hideIfEmpty stacked>
                  {groupData.primaryContact.signal}
                </ReadOnlyField>
              </div>
            </ReadOnlyField>
          </main>
        )}
      </div>
    </LayoutWithNav>
  )
}

export default GroupViewPage
