import { FunctionComponent, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { useAllShipmentsQuery, useOfferQuery } from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import { shipmentViewOffersRoute } from '../../utils/routes'

const ViewOfferPage: FunctionComponent = () => {
  const params = useParams<{ shipmentId: string; offerId: string }>()
  const offerId = parseInt(params.offerId, 10)
  const shipmentId = parseInt(params.shipmentId, 10)

  // Figure out the shipment ID from the path
  const { data: shipments } = useAllShipmentsQuery()
  const targetShipment = useMemo(() => {
    if (shipments?.listShipments) {
      return shipments.listShipments.find(
        (shipment) => shipment.id === shipmentId,
      )
    }
    return null
  }, [shipments, shipmentId])

  const { data } = useOfferQuery({ variables: { id: offerId } })

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200">
          <InternalLink
            className="inline-block mb-2"
            to={shipmentViewOffersRoute(shipmentId)}
          >
            ← back to shipment
          </InternalLink>
          <h1 className="text-navy-800 text-3xl">Offer details</h1>
        </header>
        <main className="p-4 md:p-6 max-w-lg pb-20 space-y-6">
          {data?.offer && (
            <>
              <ReadOnlyField label="Shipment">
                {targetShipment && (
                  <>
                    <p className="">{formatShipmentName(targetShipment)}</p>
                    <p className="text-gray-500 text-sm">
                      {targetShipment.sendingHub.name} →{' '}
                      {targetShipment.receivingHub.name}
                    </p>
                  </>
                )}
              </ReadOnlyField>
              <ReadOnlyField label="Group">
                {data.offer.sendingGroupId}
              </ReadOnlyField>
            </>
          )}
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ViewOfferPage
