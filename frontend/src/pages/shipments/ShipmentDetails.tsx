import { FunctionComponent, PropsWithChildren } from 'react'
import { Hint } from '../../components/alert/Hint'
import Badge from '../../components/Badge'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import Spinner from '../../components/Spinner'
import { useShipmentQuery } from '../../types/api-types'
import {
  formatLabelMonth,
  formatShipmentStatus,
  getShipmentStatusBadgeColor,
} from '../../utils/format'
import { shipmentViewOffersRoute } from '../../utils/routes'

interface Props {
  shipmentId: number
}

const ShipmentDetails: FunctionComponent<PropsWithChildren<Props>> = ({
  shipmentId,
}) => {
  const { data: shipment } = useShipmentQuery({
    variables: { id: shipmentId },
  })

  const shipmentData = shipment?.shipment

  if (!shipmentData) {
    return (
      <div className="min-h-half-screen flex items-center justify-center flex-col">
        <span>Loading shipment details</span>
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <Hint
        id={'select-offers'}
        title={`What's next:`}
        text={
          <>
            Select the{' '}
            <InternalLink to={shipmentViewOffersRoute(shipmentId)}>
              Offers
            </InternalLink>{' '}
            tab to create an offer for this shipment.
          </>
        }
        className="mb-4"
      />
      <div className="flex space-x-6">
        <ReadOnlyField label="Date">
          {formatLabelMonth(shipmentData.labelMonth)} {shipmentData.labelYear}
        </ReadOnlyField>
        <ReadOnlyField label="Status">
          <Badge color={getShipmentStatusBadgeColor(shipmentData.status)}>
            {formatShipmentStatus(shipmentData.status)}
          </Badge>
        </ReadOnlyField>
      </div>
      <h2 className="font-semibold mt-6 mb-4">Itinerary</h2>
      <div className="md:flex items-center">
        <div className="border border-gray-200 p-4 md:p-6 rounded flex-shrink-0 space-y-2">
          <div className="uppercase text-xs text-gray-500 mb-2">From</div>
          {shipmentData.sendingHubs.map((hub) => (
            <div key={hub.id}>
              <div className="text-lg md:text-xl text-gray-800">{hub.name}</div>
              <div className="text-gray-600">
                {hub.locality}
                {hub.country && (
                  <>
                    {', '}
                    {hub.country.alias ?? hub.country.shortName}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-2xl text-gray-500 p-2 md:p-4 transform md:-rotate-90 text-center">
          ↓
        </div>
        <div className="border border-gray-200 p-4 md:p-6 rounded flex-shrink-0 space-y-2">
          <div className="uppercase text-xs text-gray-500 mb-2">Via</div>
          {shipmentData.receivingHubs.map((hub) => (
            <div key={hub.id}>
              <div className="text-lg md:text-xl text-gray-800">{hub.name}</div>
              <div className="text-gray-600">
                {hub.locality}
                {hub.country && (
                  <>
                    {', '}
                    {hub.country.alias ?? hub.country.shortName}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-2xl text-gray-500 p-2 md:p-4 transform md:-rotate-90 text-center">
          ↓
        </div>
        <div className="border border-gray-200 p-4 md:p-6 rounded flex-shrink-0 space-y-2">
          <div className="uppercase text-xs text-gray-500 mb-2">To</div>
          {shipmentData.receivingGroups.map((group) => (
            <div key={group.id}>
              <div className="text-lg md:text-xl text-gray-800">
                {group.name}
              </div>
              <div className="text-gray-600">
                {group.locality}
                {group.country && (
                  <>
                    {', '}
                    {group.country.alias ?? group.country.shortName}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShipmentDetails
