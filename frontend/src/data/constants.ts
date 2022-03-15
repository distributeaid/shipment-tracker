import {
  DangerousGoods,
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  OfferStatus,
  PalletType,
  PaymentStatus,
  ShipmentStatus,
} from '../types/api-types'
import { enumValues } from '../utils/types'

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * A value + label pair of months for use in Select fields.
 * Note that the value starts at 1 (January)
 */
export const MONTH_OPTIONS = MONTHS.map((month, index) => ({
  label: month,
  value: index + 1,
}))

export const GROUP_TYPE_OPTIONS = [
  { label: 'Regular group', value: GroupType.Regular },
  { label: 'DA hub', value: GroupType.DaHub },
]

export const OFFER_STATUS_OPTIONS = enumValues(OfferStatus).map((routeKey) => ({
  label: routeKey,
  value: routeKey,
}))

/**
 * Order of shipment statuses:
 * draft → announced → open to offers → aid matching → staging at a hub
 * → in transit → complete
 *
 * A shipment can also be 'abandoned' or 'archived' at any point.
 */
export const SHIPMENT_STATUS_OPTIONS = [
  { label: 'Draft', value: ShipmentStatus.Draft },
  { label: 'Announced', value: ShipmentStatus.Announced },
  { label: 'Open to offers', value: ShipmentStatus.Open },
  { label: 'Aid matching', value: ShipmentStatus.AidMatching },
  { label: 'Staging at a hub', value: ShipmentStatus.Staging },
  { label: 'In transit', value: ShipmentStatus.InProgress },
  { label: 'Complete', value: ShipmentStatus.Complete },
  { label: 'Abandoned', value: ShipmentStatus.Abandoned },
  { label: 'Archived', value: ShipmentStatus.Archived },
] as const

export const PALLET_PAYMENT_STATUS_OPTIONS = [
  {
    label: 'Not yet initiated',
    value: PaymentStatus.Uninitiated,
  },
  {
    label: 'Invoiced',
    value: PaymentStatus.Invoiced,
  },
  {
    label: 'Paid',
    value: PaymentStatus.Paid,
  },
  {
    label: "Won't pay",
    value: PaymentStatus.WontPay,
  },
]

export const LINE_ITEM_CATEGORY_OPTIONS = [
  { label: 'Not set', value: LineItemCategory.Unset },
  {
    label: "Clothing (men's, women's, children's, babies, shoes)",
    value: LineItemCategory.Clothing,
  },
  {
    label: 'Shelter & Bedding (tents, sleeping bags, roll mats, blankets)',
    value: LineItemCategory.Shelter,
  },
  {
    label:
      'Hygiene & Toiletries (toothbrush, deodorant, shampoo, diapers, soap, etc.)',
    value: LineItemCategory.Hygiene,
  },
  {
    label:
      'Food & Drink (canned food, dried food, cooking oil, bottled water, etc.)',
    value: LineItemCategory.Food,
  },
  {
    label:
      'Games & Toys (board games, card games, musical instruments, baby toys)',
    value: LineItemCategory.Games,
  },
  {
    label: 'Electronics (phones, batteries, cables, laptops)',
    value: LineItemCategory.Electronics,
  },
  {
    label: 'Medical (bandages, plasters, first aid supplies)',
    value: LineItemCategory.Medical,
  },
  { label: 'PPE (masks, antibacterial hand gel)', value: LineItemCategory.Ppe },
  { label: 'Other', value: LineItemCategory.Other },
]

export const LINE_ITEM_CONTAINER_OPTIONS = [
  { label: 'Not set', value: LineItemContainerType.Unset },
  { label: 'Box', value: LineItemContainerType.Box },
  { label: 'Bulk bag', value: LineItemContainerType.BulkBag },
  { label: 'Full pallet', value: LineItemContainerType.FullPallet },
] as const

export interface PalletConfig {
  name: string
  type: PalletType
  weightKg: number
  lengthCm: number
  widthCm: number
  heightCm: number
}

export const PALLET_CONFIGS: PalletConfig[] = [
  {
    name: 'Standard pallet',
    type: PalletType.Standard,
    weightKg: 700,
    lengthCm: 120,
    widthCm: 100,
    heightCm: 175,
  },
  {
    name: 'Euro pallet',
    type: PalletType.Euro,
    weightKg: 550,
    lengthCm: 120,
    widthCm: 80,
    heightCm: 175,
  },
]

export const DANGEROUS_GOODS_LIST = [
  { value: DangerousGoods.Batteries, label: 'Batteries' },
  { value: DangerousGoods.Explosive, label: 'Explosives' },
  { value: DangerousGoods.Flammable, label: 'Flammable' },
  { value: DangerousGoods.Liquids, label: 'Liquids' },
  { value: DangerousGoods.Medicine, label: 'Medicine' },
  { value: DangerousGoods.Other, label: 'Other' },
] as const
