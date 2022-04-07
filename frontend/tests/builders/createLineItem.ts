import {
  LineItem,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
} from '../../src/types/api-types'

const createLineItem = ({
  id,
  description,
}: {
  id: number
  description: string
}): LineItem => ({
  affirmLiability: true,
  category: LineItemCategory.Food,
  containerCount: 1,
  containerHeightCm: 175,
  containerLengthCm: 120,
  containerType: LineItemContainerType.FullPallet,
  containerWeightGrams: 12000,
  containerWidthCm: 80,
  createdAt: '',
  dangerousGoods: [],
  description,
  id,
  itemCount: 1,
  offerPalletId: 1,
  photoUris: [],
  status: LineItemStatus.Proposed,
  statusChangeTime: '',
  tosAccepted: false,
  updatedAt: '2022-03-16T07:56:23.076Z',
})

export default createLineItem
