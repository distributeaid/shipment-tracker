const {
  setEmptyFieldsToUndefined,
  validatePalletContents,
} = require('../../src/utils/data')
const {
  LineItemContainerType,
  LineItemCategory,
  LineItemStatus,
  PalletType,
} = require('../../src/types/api-types')

test(`setEmptyFieldsToUndefined`, () => {
  expect(
    setEmptyFieldsToUndefined({
      a: '',
      b: null,
      c: undefined,
      d: 0,
      e: 'e',
    }),
  ).toEqual({ d: 0, e: 'e' })
})

describe(`validatePalletContents`, () => {
  test("should verify when a pallet's content is valid", () => {
    expect(
      validatePalletContents([
        {
          category: LineItemCategory.Clothing,
          containerType: LineItemContainerType.Box,
          dangerousGoods: [],
          id: 0,
          itemCount: 10,
          offerPalletId: 0,
          status: LineItemStatus.Accepted,
        },
      ]),
    ).toStrictEqual({ valid: true })
  })

  test('returns an error when the pallet contains too many boxes', () => {
    expect(
      validatePalletContents([
        {
          category: LineItemCategory.Clothing,
          containerType: LineItemContainerType.Box,
          dangerousGoods: [],
          id: 0,
          itemCount: 10,
          containerCount: 40, // too many boxes
          offerPalletId: 0,
          status: LineItemStatus.Accepted,
        },
      ]),
    ).toStrictEqual({
      valid: false,
      error: 'A pallet cannot contain more than 36 boxes.',
    })
  })

  test('returns an error when the pallet contains too many bulk bags', () => {
    expect(
      validatePalletContents([
        {
          category: LineItemCategory.Clothing,
          containerType: LineItemContainerType.BulkBag,
          dangerousGoods: [],
          id: 0,
          itemCount: 10,
          containerCount: 1,
          offerPalletId: 0,
          status: LineItemStatus.Accepted,
        },
        {
          category: LineItemCategory.Clothing,
          containerType: LineItemContainerType.BulkBag,
          dangerousGoods: [],
          id: 0,
          itemCount: 10,
          containerCount: 1, // there can only be 1 bulk bag per pallet
          offerPalletId: 0,
          status: LineItemStatus.Accepted,
        },
      ]),
    ).toStrictEqual({
      valid: false,
      error: 'A pallet cannot contain more than 1 bulk bag.',
    })
  })

  test('returns an error when the pallet contains too many bulk bags and boxes', () => {
    expect(
      validatePalletContents([
        {
          category: LineItemCategory.Clothing,
          containerType: LineItemContainerType.BulkBag,
          dangerousGoods: [],
          id: 0,
          itemCount: 10,
          containerCount: 1,
          offerPalletId: 0,
          status: LineItemStatus.Accepted,
        },
        {
          category: LineItemCategory.Clothing,
          containerType: LineItemContainerType.Box,
          dangerousGoods: [],
          id: 0,
          itemCount: 10,
          containerCount: 20, // only 18 boxes can be stored with a bulk bag
          offerPalletId: 0,
          status: LineItemStatus.Accepted,
        },
      ]),
    ).toStrictEqual({
      valid: false,
      error:
        'A pallet cannot contain more than 18 boxes if it also contains a bulk bag.',
    })
  })
})
