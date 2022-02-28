import { LineItemContainerType, PalletType } from '../../src/types/api-types'
import { validatePalletContents } from '../../src/utils/validatePalletContents'

describe(`validatePalletContents`, () => {
  test("should verify when a pallet's content is valid", () => {
    expect(
      validatePalletContents(PalletType.Standard, [
        {
          containerType: LineItemContainerType.Box,
          containerCount: 10,
          containerHeightCm: 10,
          containerWidthCm: 10,
          containerLengthCm: 10,
          containerWeightGrams: 1000,
        },
      ]),
    ).toStrictEqual({ valid: true })
  })

  test('returns an error when the pallet contains too many bulk bags', () => {
    expect(
      validatePalletContents(PalletType.Standard, [
        {
          containerType: LineItemContainerType.BulkBag,
          containerWeightGrams: 1000,
        },
        {
          containerType: LineItemContainerType.BulkBag,
          containerWeightGrams: 1000,
        },
      ]),
    ).toStrictEqual({
      errors: [
        {
          type: 'oversize',
          message: 'A pallet can only contain one bulk bag.',
        },
      ],
    })
  })

  test('returns an error when the pallet contains a full pallet sized item and other items', () => {
    expect(
      validatePalletContents(PalletType.Standard, [
        {
          containerType: LineItemContainerType.FullPallet,
          containerWeightGrams: 1000,
        },
        {
          containerType: LineItemContainerType.Box,
          containerCount: 50,
          containerHeightCm: 25,
          containerWidthCm: 50,
          containerLengthCm: 30,
          containerWeightGrams: 1000,
        },
      ]),
    ).toStrictEqual({
      errors: [
        {
          type: 'oversize',
          message:
            'A pallet with a pallet sized item cannot contain other items.',
        },
      ],
    })
  })

  test('returns an error when the pallet contains too many bulk bags and boxes', () => {
    expect(
      validatePalletContents(
        // 1.2 * 1 * 1.75 = 2.1,
        PalletType.Standard,
        [
          // 2.1 - 0.85 = 1.25
          {
            containerType: LineItemContainerType.BulkBag,
            containerWeightGrams: 1000,
          },
          // 1.25 - 50 * 0.25 * 0.50 * 0.30 = -0.625
          {
            containerType: LineItemContainerType.Box,
            containerCount: 50,
            containerHeightCm: 25,
            containerWidthCm: 50,
            containerLengthCm: 30,
            containerWeightGrams: 1000,
          },
        ],
      ),
    ).toStrictEqual({
      errors: [
        {
          message:
            'The pallet configuration needs 0.625 m³ more volume than supported by the pallet (2.1 m³).',
          type: 'oversize',
        },
      ],
    })
  })

  test('returns an error when the pallet contains too much weigth', () => {
    expect(
      validatePalletContents(
        // 700 kg
        PalletType.Standard,
        [
          // 700 - 120 = 580
          // Washing machine: 120kg
          {
            containerType: LineItemContainerType.Box,
            containerWeightGrams: 120 * 1000,
            containerCount: 1,
            containerHeightCm: 85,
            containerWidthCm: 60,
            containerLengthCm: 60,
          },
          // 1000 liter water
          {
            containerType: LineItemContainerType.Box,
            containerCount: 1000,
            containerHeightCm: 10,
            containerWidthCm: 10,
            containerLengthCm: 10,
            containerWeightGrams: 1000,
          },
        ],
      ),
    ).toStrictEqual({
      errors: [
        {
          message:
            'The pallet configuration weighs 420 kg more than supported by the pallet (700 kg).',
          type: 'overweight',
        },
      ],
    })
  })
})
