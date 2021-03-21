import { ForbiddenError, UserInputError } from 'apollo-server'
import { GoogleSheetRow } from '../createGoogleSheet'
import LineItem from '../models/line_item'
import Offer from '../models/offer'
import Pallet from '../models/pallet'
import Shipment from '../models/shipment'
import ShipmentExport from '../models/shipment_export'
import { MutationResolvers } from '../server-internal-types'

const exportShipment: MutationResolvers['exportShipment'] = async (
  _,
  { shipmentId },
  { auth, services },
) => {
  if (!auth.isAdmin) {
    throw new ForbiddenError('Must be admin')
  }

  const shipment = await Shipment.findByPk(shipmentId, {
    include: {
      association: 'offers',
      include: [
        {
          association: 'pallets',
          include: {
            // @ts-ignore
            association: 'lineItems',
            include: [
              {
                association: 'acceptedReceivingGroup',
              },
              {
                association: 'proposedReceivingGroup',
              },
            ],
          },
        },
        { association: 'sendingGroup' },
      ],
    },
  })

  if (!shipment) {
    throw new UserInputError(`Shipment ${shipmentId} does not exist`)
  }

  const rows = shipment.offers.flatMap((offer) =>
    offer.pallets.flatMap((pallet) =>
      pallet.lineItems.map((lineItem) =>
        makeExportRow(offer, pallet, lineItem),
      ),
    ),
  )

  const googleSheetUrl = await services.createGoogleSheet(
    shipment.displayName(),
    rows,
  )

  const exportRecord = await ShipmentExport.create({
    googleSheetUrl,
    shipmentId,
    userAccountId: auth.userAccount.id,
  })

  return exportRecord.toWireFormat()
}

function makeExportRow(
  offer: Offer,
  pallet: Pallet,
  lineItem: LineItem,
): GoogleSheetRow {
  const contact = offer.contact || offer.sendingGroup.primaryContact
  const receivingGroupName = lineItem?.acceptedReceivingGroup
    ? `${lineItem.acceptedReceivingGroup.name} (accepted)`
    : `${lineItem?.proposedReceivingGroup?.name} (proposed)`

  return [
    offer.sendingGroup.name,
    contact?.name,
    contact?.email,
    contact?.whatsApp,
    receivingGroupName,
    'UK Hub -- what is this?',
    lineItem.category,
    lineItem.description,
    lineItem.offerPalletId,
    lineItem.containerCount,
    pallet.weightGrams(),
    lineItem.dangerousGoods.join(', ') || 'None',
    lineItem.sendingHubDeliveryDate?.toISOString()?.split('T')[0],
  ]
}

export { exportShipment }
