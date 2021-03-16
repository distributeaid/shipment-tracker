import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import InternalLink from '../../components/InternalLink'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  ShipmentUpdateInput,
  useShipmentQuery,
  useUpdateShipmentMutation,
} from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import { shipmentViewRoute } from '../../utils/routes'
import ShipmentForm from './ShipmentForm'

const ShipmentEditPage: FunctionComponent = () => {
  // Extract the shipment's ID from the URL
  const { shipmentId } = useParams<{ shipmentId: string }>()

  // Load the shipment's information
  const {
    data: originalShipmentData,
    loading: queryIsLoading,
  } = useShipmentQuery({ variables: { id: parseInt(shipmentId, 10) } })

  // Set up the mutation to update the shipment
  const [
    updateShipmentMutation,
    { loading: mutationIsLoading },
  ] = useUpdateShipmentMutation()

  const onSubmit = (input: ShipmentUpdateInput) => {
    updateShipmentMutation({
      variables: { id: parseInt(shipmentId, 10), input },
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
          <InternalLink
            className="inline-block mb-2"
            to={shipmentViewRoute(shipmentId)}
          >
            ← back to shipment
          </InternalLink>
          <h1 className="text-navy-800 text-3xl mb-2">
            {originalShipmentData
              ? formatShipmentName(originalShipmentData.shipment)
              : 'Shipment'}
          </h1>
        </header>
        <main className="p-4 md:p-6 max-w-lg pb-20">
          <ShipmentForm
            isLoading={queryIsLoading || mutationIsLoading}
            submitButtonLabel="Save changes"
            onSubmit={onSubmit}
            defaultValues={originalShipmentData}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentEditPage
