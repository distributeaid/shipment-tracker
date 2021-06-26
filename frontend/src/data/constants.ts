import {
  DangerousGoods,
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  OfferStatus,
  PalletType,
  PaymentStatus,
  ShipmentStatus,
  ShippingRoute,
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
  { label: 'Receiving group', value: GroupType.ReceivingGroup },
  { label: 'Sending group', value: GroupType.SendingGroup },
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
  { label: 'Other (washing machines)', value: LineItemCategory.Other },
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
    widthCm: 120,
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
  {
    name: 'Ton bag',
    type: PalletType.Custom,
    weightKg: 300,
    lengthCm: 100,
    widthCm: 100,
    heightCm: 90,
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

export const COUNTRY_CODES_TO_NAME = {
  AF: 'Afghanistan',
  AX: 'Åland Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'AndorrA',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: "Cote D'Ivoire",
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island and Mcdonald Islands',
  VA: 'Vatican',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: 'North Korea',
  KR: 'South Korea',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Laos',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestine',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'Reunion',
  RO: 'Romania',
  RU: 'Russia',
  RW: 'RWANDA',
  SH: 'Saint Helena',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and the Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  CS: 'Serbia and Montenegro',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and the South Sandwich Islands',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UM: 'United States Minor Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Viet Nam',
  VG: 'British Virgin Islands',
  VI: 'U.S. Virgin Islands',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
}

export const COUNTRY_CODE_OPTIONS = Object.entries(COUNTRY_CODES_TO_NAME).map(
  ([countryCode, countryName]) => ({
    label: countryName,
    value: countryCode,
  }),
)

export const SENDING_REGIONS = [
  { code: 'UK', label: 'United Kingdom' },
  { code: 'DE', label: 'Germany' },
]

export const RECEIVING_REGIONS = [
  { code: 'FR', label: 'France' },
  { code: 'GR', label: 'Greece' },
  { code: 'CS', label: 'Serbia' },
  { code: 'BA', label: 'Bosnia' },
  { code: 'LB', label: 'Lebanon' },
]

export const SHIPPING_ROUTE_OPTIONS = [
  {
    value: ShippingRoute.DeToBa,
    label: 'Germany to Bosnia',
  },
  {
    value: ShippingRoute.DeToCs,
    label: 'Germany to Serbia',
  },
  {
    value: ShippingRoute.DeToFr,
    label: 'Germany to France',
  },
  {
    value: ShippingRoute.DeToGr,
    label: 'Germany to Greece',
  },
  {
    value: ShippingRoute.DeToLb,
    label: 'Germany to Lebanon',
  },
  {
    value: ShippingRoute.UkToBa,
    label: 'UK to Bosnia',
  },
  {
    value: ShippingRoute.UkToCs,
    label: 'UK to Serbia',
  },
  {
    value: ShippingRoute.UkToFr,
    label: 'UK to France',
  },
  {
    value: ShippingRoute.UkToGr,
    label: 'UK to Greece',
  },
  {
    value: ShippingRoute.UkToLb,
    label: 'UK to Lebanon',
  },
]
