import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import Badge from '../../components/Badge'
import ButtonLink from '../../components/ButtonLink'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { useShipmentQuery } from '../../types/api-types'
import {
  formatCountryCodeToName,
  formatLabelMonth,
  formatShipmentName,
  getShipmentStatusBadgeColor,
} from '../../utils/format'
import ROUTES, { shipmentEditRoute } from '../../utils/routes'

const ShipmentViewPage: FunctionComponent = () => {
  // Extract the shipment's ID from the URL
  const { shipmentId } = useParams<{ shipmentId: string }>()

  // Load the shipment's information
  const { data: shipment } = useShipmentQuery({
    variables: { id: parseInt(shipmentId, 10) },
  })

  const shipmentData = shipment?.shipment

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200 md:flex items-center">
          <div className="flex-grow">
            <InternalLink
              className="inline-block mb-2"
              to={ROUTES.SHIPMENT_LIST}
            >
              ← back to shipments
            </InternalLink>
            <h1 className="text-navy-800 text-2xl md:text-3xl mb-2">
              {shipmentData ? formatShipmentName(shipmentData) : ''}
            </h1>
          </div>
          <div className="flex-shrink mt-4 md:mt-0">
            <ButtonLink to={shipmentEditRoute(shipmentId)}>Edit</ButtonLink>
          </div>
        </header>
        {shipmentData && (
          <main className="p-4 md:p-6 max-w-lg pb-20">
            <div className="flex space-x-6">
              <ReadOnlyField label="Date">
                {formatLabelMonth(shipmentData.labelMonth)}{' '}
                {shipmentData.labelYear}
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
              <span className="text-semibold text-gray-800">
                {shipmentData.shippingRoute}
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
          </main>
        )}
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentViewPage
