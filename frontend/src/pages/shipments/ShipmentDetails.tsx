import { FunctionComponent } from 'react'
import Badge from '../../components/Badge'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import Spinner from '../../components/Spinner'
import { useShipmentQuery } from '../../types/api-types'
import {
  formatCountryCodeToName,
  formatLabelMonth,
  formatShippingRouteName,
  getShipmentStatusBadgeColor,
} from '../../utils/format'

interface Props {
  shipmentId: number
}

const ShipmentDetails: FunctionComponent<Props> = ({ shipmentId }) => {
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
      <div className="flex space-x-6">
        <ReadOnlyField label="Date">
          {formatLabelMonth(shipmentData.labelMonth)} {shipmentData.labelYear}
        </ReadOnlyField>
        <ReadOnlyField label="Status">
          <Badge color={getShipmentStatusBadgeColor(shipmentData.status)}>
            {shipmentData.status}
          </Badge>
        </ReadOnlyField>
      </div>
      <h2 className="font-semibold mt-6 mb-4">Itinerary</h2>
      <p className="text-gray-600 mb-4">
        This shipment follows the{' '}
        <span className="font-semibold text-gray-800">
          {formatShippingRouteName(shipmentData.shippingRoute)}
        </span>{' '}
        route.
      </p>
      <div className="md:flex items-center">
        <div className="border border-gray-200 p-4 md:p-6 rounded flex-shrink-0">
          <div className="uppercase text-xs text-gray-500">From</div>
          <div className="text-lg md:text-xl text-gray-800 my-2">
            {shipmentData.sendingHub.name}
          </div>
          <div className="text-gray-600">
            {shipmentData.sendingHub.primaryLocation.townCity},{' '}
            {formatCountryCodeToName(
              shipmentData.sendingHub.primaryLocation.countryCode,
            )}
          </div>
        </div>
        <div className="text-2xl text-gray-500 p-2 md:p-4 transform md:-rotate-90 text-center">
          ↓
        </div>
        <div className="border border-gray-200 p-4 md:p-6 rounded flex-shrink-0">
          <div className="uppercase text-xs text-gray-500">To</div>
          <div className="text-lg md:text-xl text-gray-800 my-2">
            {shipmentData.receivingHub.name}
          </div>
          <div className="text-gray-600">
            {shipmentData.receivingHub.primaryLocation.townCity},{' '}
            {formatCountryCodeToName(
              shipmentData.receivingHub.primaryLocation.countryCode,
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipmentDetails
