import { FunctionComponent, useState } from 'react'
import { useParams } from 'react-router-dom'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import InternalLink from '../../components/InternalLink'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  OfferDocument,
  PalletCreateInput,
  PalletType,
  useCreatePalletMutation,
  useGroupQuery,
  useOfferQuery,
  useShipmentQuery,
} from '../../types/api-types'
import { formatShipmentName } from '../../utils/format'
import { shipmentViewOffersRoute } from '../../utils/routes'
import CreatePalletModal from './CreatePalletModal'

const ViewOfferPage: FunctionComponent = () => {
  const params = useParams<{ shipmentId: string; offerId: string }>()
  const offerId = parseInt(params.offerId, 10)
  const shipmentId = parseInt(params.shipmentId, 10)

  const { data: shipment } = useShipmentQuery({
    variables: { id: shipmentId },
  })

  const { data: offer } = useOfferQuery({ variables: { id: offerId } })

  const sendingGroupId = offer?.offer.sendingGroupId
  const { data: sendingGroup } = useGroupQuery({
    skip: !sendingGroupId, // Don't execute this query until the group ID is known
    variables: { id: sendingGroupId! },
  })

  const [showCreatePalletModal, setShowCreatePalletModal] = useState(false)

  const displayCreatePalletModal = () => {
    setShowCreatePalletModal(true)
  }

  const hideModal = () => {
    setShowCreatePalletModal(false)
  }

  const [
    addPallet,
    { loading: mutationIsLoading, error: mutationError },
  ] = useCreatePalletMutation({
    refetchQueries: [{ query: OfferDocument, variables: { id: offerId } }],
    awaitRefetchQueries: true,
  })

  const onCreatePallet = (palletType: PalletType) => {
    const newPallet: PalletCreateInput = {
      palletType,
      offerId,
    }

    addPallet({ variables: { input: newPallet } }).then(() => [hideModal()])
  }

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content bg-white">
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
          {mutationError && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{mutationError.message}</p>
            </div>
          )}
          {offer?.offer && (
            <>
              <ReadOnlyField label="Shipment">
                {shipment?.shipment && (
                  <>
                    <p className="">{formatShipmentName(shipment.shipment)}</p>
                    <p className="text-gray-500 text-sm">
                      {shipment.shipment.sendingHub.name} →{' '}
                      {shipment.shipment.receivingHub.name}
                    </p>
                  </>
                )}
              </ReadOnlyField>
              <ReadOnlyField label="Group">
                {sendingGroup?.group.name}
              </ReadOnlyField>
              <div className="flex justify-between items-center">
                <h2 className="text-gray-700 font-semibold">Pallets</h2>
                {offer.offer.pallets.length > 0 && (
                  <Button
                    disabled={mutationIsLoading}
                    onClick={displayCreatePalletModal}
                  >
                    Add a pallet
                  </Button>
                )}
              </div>
              {offer.offer.pallets.length === 0 && (
                <div className="p-4 flex flex-col space-y-4 items-center justify-center text-gray-500 bg-gray-50 rounded">
                  <span>There are no pallets in this offer</span>
                  <Button
                    disabled={mutationIsLoading}
                    onClick={displayCreatePalletModal}
                  >
                    Add a pallet
                  </Button>
                </div>
              )}
              {offer.offer.pallets.length > 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border border-gray-100 text-gray-500 font-semibold text-sm uppercase text-left">
                      <th className="p-2 pl-4">Pallet</th>
                      <th className="p-2">Type</th>
                      <th className="p-2 pr-4">Payment status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offer.offer.pallets.map((pallet, index) => (
                      <tr key={pallet.id} className="border border-gray-100">
                        <td className="p-2 pl-4">Pallet {index + 1}</td>
                        <td className="p-2">
                          <Badge>{pallet.palletType}</Badge>
                        </td>
                        <td className="p-2 pr-4">
                          <Badge>{pallet.paymentStatus}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
          <CreatePalletModal
            disabled={mutationIsLoading}
            onCreatePallet={onCreatePallet}
            isOpen={showCreatePalletModal}
            onRequestClose={hideModal}
          />
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ViewOfferPage
