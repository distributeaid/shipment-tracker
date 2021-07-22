import { ApolloError } from '@apollo/client'
import _pick from 'lodash/pick'
import { FunctionComponent, useState } from 'react'
import { useParams } from 'react-router-dom'
import InternalLink from '../../components/InternalLink'
import useSaveConfirmation from '../../hooks/useSaveConfirmation'
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
  const { shipmentId } = useParams<{ shipmentId: string }>()
  const [error, setError] = useState<string>()
  const { showConfirmation, triggerConfirmation } = useSaveConfirmation()

  const { data: originalShipmentData, loading: queryIsLoading } =
    useShipmentQuery({ variables: { id: parseInt(shipmentId, 10) } })

  // Set up the mutation to update the shipment
  const [updateShipmentMutation, { loading: mutationIsLoading }] =
    useUpdateShipmentMutation()

  const onSubmit = (input: ShipmentUpdateInput) => {
    setError(undefined)

    const formattedInput = _pick(input, [
      'shippingRoute',
      'labelYear',
      'labelMonth',
      'sendingHubs',
      'receivingHubs',
      'status',
      'pricing',
    ])

    updateShipmentMutation({
      variables: { id: parseInt(shipmentId, 10), input: formattedInput },
    })
      .then(() => {
        triggerConfirmation()
      })
      .catch((error: ApolloError) => {
        setError(error.message)
        console.error(error)
      })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto bg-white border-l border-r border-gray-200 min-h-content">
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
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-sm mb-6">
              {error}
            </div>
          )}
          <ShipmentForm
            isLoading={queryIsLoading || mutationIsLoading}
            submitButtonLabel="Save changes"
            onSubmit={onSubmit}
            defaultValues={originalShipmentData}
            showSaveConfirmation={showConfirmation}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentEditPage
