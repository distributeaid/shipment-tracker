import { gql, useMutation, useQuery } from '@apollo/client'
import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Shipment, ShipmentUpdateInput } from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import ShipmentForm from './ShipmentForm'

const ALL_SHIPMENT_FIELDS = gql`
  fragment AllShipmentFields on Shipment {
    id
    shippingRoute
    labelYear
    labelMonth
    offerSubmissionDeadline
    status
  }
`

const GET_SHIPMENT = gql`
  ${ALL_SHIPMENT_FIELDS}
  query Shipment($id: Int!) {
    shipment(id: $id) {
      ...AllShipmentFields
    }
  }
`

const UPDATE_SHIPMENT_MUTATION = gql`
  ${ALL_SHIPMENT_FIELDS}
  mutation Shipment($id: Int!, $input: ShipmentUpdateInput!) {
    updateShipment(id: $id, input: $input) {
      ...AllShipmentFields
    }
  }
`

const ShipmentEditPage: FunctionComponent = () => {
  // Extract the shipment's ID from the URL
  const { shipmentId } = useParams<{ shipmentId: string }>()

  // Load the shipment's information
  const { data: originalShipmentData, loading: queryIsLoading } = useQuery<{
    shipment: Shipment
  }>(GET_SHIPMENT, {
    variables: { id: parseInt(shipmentId, 10) },
  })

  // Set up the mutation to update the shipment
  const [updateShipment, { loading: mutationIsLoading }] = useMutation(
    UPDATE_SHIPMENT_MUTATION,
  )

  const onSubmit = (input: ShipmentUpdateInput) => {
    updateShipment({
      variables: { id: parseInt(shipmentId, 10), input },
    }).catch((error) => {
      console.log(error)
    })
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-4 md:p-6 border-b border-gray-200">
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
            defaultValues={originalShipmentData?.shipment}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentEditPage
