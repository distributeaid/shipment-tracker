import { ForbiddenError } from 'apollo-server'
import { Request, Response } from 'express'
import { authenticateRequest } from './authenticateRequest'
import ShipmentExport from './models/shipment_export'

const sendShipmentExportCsv = async (req: Request, res: Response) => {
  const auth = await authenticateRequest(req)

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

  const filename = shipmentExport.shipment.displayName()

  res.contentType('text/plain')
  res.set('Content-Disposition', `attachment; filename=${filename}`)
  res.send(shipmentExport.contentsCsv)
  res.end()
}

export default sendShipmentExportCsv
