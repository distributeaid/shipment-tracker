import { FunctionComponent, useContext } from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import ButtonLink from '../../components/ButtonLink'
import InternalLink from '../../components/InternalLink'
import TabLink from '../../components/tabs/TabLink'
import TabList from '../../components/tabs/TabList'
import { UserProfileContext } from '../../components/UserProfileContext'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  useExportShipmentToCsvMutation,
  useShipmentQuery,
} from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import ROUTES, {
  shipmentEditRoute,
  shipmentViewOffersRoute,
  shipmentViewRoute,
} from '../../utils/routes'
import ShipmentDetails from './ShipmentDetails'
import ShipmentOffers from './ShipmentOffers'

const ShipmentViewPage: FunctionComponent = () => {
  const user = useContext(UserProfileContext)
  const params = useParams<{ shipmentId: string }>()
  const shipmentId = parseInt(params.shipmentId, 10)

  const { data: shipment } = useShipmentQuery({
    variables: { id: shipmentId },
  })

  const shipmentData = shipment?.shipment

  const [
    exportShipment,
    { loading: exportIsProcessing },
  ] = useExportShipmentToCsvMutation()

  const exportToCSV = () => {
    exportShipment({ variables: { shipmentId } }).then((data) => {
      const downloadPath = data.data?.exportShipment.downloadPath

      if (downloadPath) {
        window.location.href = downloadPath
      } else {
        console.error('Unable to download the shipment')
      }
    })
  }

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
            {user?.isAdmin && (
              <Button onClick={exportToCSV}>Export to CSV</Button>
            )}
            <ButtonLink to={shipmentEditRoute(shipmentId)}>Edit</ButtonLink>
          </div>
        </header>
        <TabList>
          <TabLink to={shipmentViewRoute(shipmentId)}>Details</TabLink>
          <TabLink to={shipmentViewOffersRoute(shipmentId)}>Offers</TabLink>
        </TabList>
        <main className="pb-20">
          <Switch>
            <Route path={shipmentViewRoute(shipmentId)} exact>
              <ShipmentDetails shipmentId={shipmentId} />
            </Route>
            <Route path={shipmentViewOffersRoute(shipmentId)}>
              <ShipmentOffers shipmentId={shipmentId} />
            </Route>
          </Switch>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentViewPage
