import { FunctionComponent } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  OfferCreateInput,
  OffersForShipmentDocument,
  useCreateOfferMutation,
} from '../../types/api-types'
import { offerViewRoute } from '../../utils/routes'
import CreateOfferForm from './CreateOfferForm'

const CreateOfferPage: FunctionComponent = () => {
  const params = useParams<{ shipmentId: string }>()
  const shipmentId = parseInt(params.shipmentId, 10)

  const history = useHistory()

  const [
    addOffer,
    { loading: mutationIsLoading, error: mutationError },
  ] = useCreateOfferMutation({
    refetchQueries: [
      { query: OffersForShipmentDocument, variables: { shipmentId } },
    ],
  })

  const onSubmit = (input: OfferCreateInput) => {
    // Create the new offer, then navigate to its page
    addOffer({ variables: { input } })
      .then(({ data }) => {
        if (data) {
          const { shipmentId, id } = data.addOffer
          history.push(offerViewRoute(shipmentId, id))
        }
      })
      .catch(console.error)
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-navy-800 text-3xl">New offer</h1>
        </header>
        <main className="p-4 md:p-6 max-w-lg pb-20">
          {mutationError && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{mutationError.message}</p>
            </div>
          )}
          <CreateOfferForm
            shipmentId={shipmentId}
            isLoading={mutationIsLoading}
            submitButtonLabel="Create offer"
            onSubmit={onSubmit}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default CreateOfferPage
