import { LineItem } from '../../src/types/api-types'

const createPallet = ({
  id,
  lineItems,
}: {
  id: number
  lineItems: Array<LineItem>
}) => ({
  createdAt: '2022-03-16T07:56:23.076Z',
  id,
  lineItems,
  length: 2,
  offerId: 2,
  palletType: 'EURO',
  palletCount: 1,
  paymentStatusChangeTime: '2022-03-16T07:56:23.076Z',
  updatedAt: '2022-03-16T07:56:23.076Z',
})

export default createPallet
