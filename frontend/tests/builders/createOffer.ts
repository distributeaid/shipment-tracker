import {
  OfferStatus,
  PalletType,
  PaymentStatus,
} from '../../src/types/api-types'

const createOffer = ({ id, offerId }: { id: number; offerId: number }) => ({
  contact: { email: 'offer@example.com', name: 'Offer Name' },
  id,
  offerId,
  photoUris: [],
  sendingGroupId: 3,
  shipmentId: 1,
  status: OfferStatus.Draft,
  pallets: [
    {
      id: 2,
      lineItems: [],
      offerId: 2,
      palletCount: 1,
      palletType: PalletType.Euro,
      paymentStatus: PaymentStatus.Uninitiated,
    },
  ],
})
export default createOffer
