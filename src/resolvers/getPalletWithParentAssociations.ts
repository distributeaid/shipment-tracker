import Offer from '../models/offer'
import Pallet from '../models/pallet'

export default async function getPalletWithParentAssociations(
  id: number,
): Promise<Pallet | null> {
  return Pallet.findByPk(id, {
    include: {
      model: Offer,
      as: 'offer',
      include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
    },
  })
}
