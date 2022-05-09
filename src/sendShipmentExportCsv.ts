import { ForbiddenError } from 'apollo-server'
import { Request, Response } from 'express'
import { AuthContext } from './authenticateRequest'
import Shipment from './models/shipment'
import ShipmentExport from './models/shipment_export'

const displayName = (shipment: Shipment): string =>
  [
    'Shipment',
    shipment.origin,
    shipment.destination,
    shipment.labelYear,
    shipment.labelMonth.toString().padStart(2, '0'),
  ].join('-')

const sendShipmentExportCsv = async (req: Request, res: Response) => {
  const auth = req.user as AuthContext

  if (!auth.isAdmin) {
    throw new ForbiddenError('Only admins are allowed to export shipments')
  }

  const shipmentExport = await ShipmentExport.findByPk(req.params.id, {
    include: 'shipment',
  })

  if (!shipmentExport) {
    res.status(404)
    return
  }

  const filename = displayName(shipmentExport.shipment) + '.csv'

  res.contentType('text/csv')
  res.attachment(filename)
  res.send(shipmentExport.contentsCsv)
  res.end()
}

export default sendShipmentExportCsv
