import { FunctionComponent } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import ButtonLink from '../../components/ButtonLink'
import InternalLink from '../../components/InternalLink'
import TabLink from '../../components/tabs/TabLink'
import TabList from '../../components/tabs/TabList'
import { useAuth } from '../../hooks/useAuth'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { ShipmentStatus, useShipmentQuery } from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import ROUTES, {
  shipmentEditRoute,
  shipmentViewOffersRoute,
  shipmentViewRoute,
} from '../../utils/routes'
import DownloadCSVMenu from './DownloadCSVMenu'
import ShipmentDetails from './ShipmentDetails'
import ShipmentOffers from './ShipmentOffers'

const ShipmentViewPage: FunctionComponent = () => {
  const { me: profile } = useAuth()
  const shipmentId = parseInt(
    useParams<{ shipmentId: string }>().shipmentId ?? '-1',
    10,
  )

  const { data: shipment } = useShipmentQuery({
    variables: { id: shipmentId },
  })
  const shipmentData = shipment?.shipment

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content bg-white">
        <header className="p-4 md:p-6 md:flex items-center">
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
          <div className="flex-shrink space-x-4 mt-4 md:mt-0">
            {profile?.isAdmin && shipment && (
              <DownloadCSVMenu shipment={shipment.shipment} />
            )}
            {profile?.isAdmin && (
              <ButtonLink to={shipmentEditRoute(shipmentId)}>Edit</ButtonLink>
            )}
          </div>
        </header>

        <TabList>
          <TabLink to={shipmentViewRoute(shipmentId)}>Details</TabLink>
          <TabLink to={shipmentViewOffersRoute(shipmentId)}>Offers</TabLink>
        </TabList>
        <main className="pb-20">
          <Routes>
            <Route
              path={ROUTES.SHIPMENT.VIEW}
              element={<ShipmentDetails shipmentId={shipmentId} />}
            />
            <Route
              path={ROUTES.SHIPMENT.OFFER_LIST}
              element={
                <ShipmentOffers
                  shipmentId={shipmentId}
                  allowNewOffers={shipmentData?.status === ShipmentStatus.Open}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentViewPage
