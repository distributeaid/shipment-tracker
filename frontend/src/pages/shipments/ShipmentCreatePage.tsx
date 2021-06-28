import { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  AllShipmentsDocument,
  ShipmentCreateInput,
  ShipmentStatus,
  useCreateShipmentMutation,
} from '../../types/api-types'
import { shipmentViewRoute } from '../../utils/routes'
import ShipmentForm from './ShipmentForm'

const ShipmentCreatePage: FunctionComponent = () => {
  const history = useHistory()

  const [addShipment, { loading: mutationIsLoading, error: mutationError }] =
    useCreateShipmentMutation()

  const onSubmit = (input: ShipmentCreateInput) => {
    // Create the shipment and then redirect to its "view" page
    input.status = ShipmentStatus.Open

    addShipment({
      variables: { input },
      // Fetch the updated list of shipments
      refetchQueries: [{ query: AllShipmentsDocument }],
    })
      .then(({ data }) => {
        if (data) {
          const newShipmentId = data.addShipment.id
          history.push(shipmentViewRoute(newShipmentId))
        }
      })
      .catch(console.error)
  }

  return (
    <LayoutWithNav>
      <div className="bg-white max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-navy-800 text-3xl mb-2">New shipment</h1>
          <p className="text-gray-700 max-w-xl">
            Fill out the form below to create a new shipment. You will be able
            to add offers at a later time.
          </p>
        </header>
        <main className="p-4 md:p-6 max-w-lg pb-20">
          {mutationError && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{mutationError.message}</p>
            </div>
          )}
          <ShipmentForm
            isLoading={mutationIsLoading}
            submitButtonLabel="Create shipment"
            onSubmit={onSubmit}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentCreatePage
