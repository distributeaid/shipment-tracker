import { PALLET_CONFIGS } from '../data/constants'
import { LineItem, LineItemContainerType, PalletType } from '../types/api-types'
import { formatNumberToFixedWithoutTrailingZeros } from './format'

export type PalletLineItem = Pick<
  LineItem,
  | 'containerType'
  | 'containerCount'
  | 'containerHeightCm'
  | 'containerLengthCm'
  | 'containerWidthCm'
  | 'containerWeightGrams'
>

export type PalletValidationError = {
  type:
    | 'overweight'
    | 'oversize'
    | 'unknown_configuration'
    | 'missing_specification'
  message: string
}

/**
 * Validates the line items on a pallet by looking at the containerType and
 * containerCount of each line item
 *
 * If the contents are invalid, an `error` string will be returned.
 *
 * Validation works by:
 * - considering the volume of all lineItems, it should be
 *   less or equal to the pallet that contains them.
 * - considering the weight of all lineItems, it should be less or equal to
 *   the max weight the pallet allows.
 *
 * This is an extremely simplified approach.
 */
export function validatePalletContents(
  palletType: PalletType,
  lineItems: PalletLineItem[],
): { valid: true } | { errors: PalletValidationError[] } {
  const config = PALLET_CONFIGS.find(({ type: t }) => t === palletType)
  if (config === undefined)
    return {
      errors: [
        {
          type: 'unknown_configuration',
          message: `Unknown pallet type: ${palletType}!`,
        },
      ],
    }

  const numLineItems = lineItems.length

  const containerTypeCount = lineItems.reduce(
    (count, { containerType }) => ({
      ...count,
      [containerType]: (count[containerType] ?? 0) + 1,
    }),
    {} as Record<LineItemContainerType, number>,
  )

  // Only one bulk bag allowed
  if ((containerTypeCount[LineItemContainerType.BulkBag] ?? 0) > 1) {
    return {
      errors: [
        {
          type: 'oversize',
          message: 'A pallet can only contain one bulk bag.',
        },
      ],
    }
  }

  // Can have exactly one item, if item is pallet size
  if (
    (containerTypeCount[LineItemContainerType.FullPallet] ?? 0) >= 1 &&
    numLineItems > 1
  ) {
    return {
      errors: [
        {
          type: 'oversize',
          message:
            'A pallet with a pallet sized item cannot contain other items.',
        },
      ],
    }
  }

  // Add up all volume and weight
  const palletMaxVolumeM =
    (config.heightCm / 100) * (config.widthCm / 100) * (config.lengthCm / 100)
  const palletMaxWeightKg = config.weightKg
  let remainingPalletVolumeM = palletMaxVolumeM
  let remaingPalletWeightKg = palletMaxWeightKg

  for (const item of lineItems) {
    // Subtract weigth
    if (
      item.containerWeightGrams === null ||
      item.containerWeightGrams === undefined
    )
      return {
        errors: [
          {
            type: 'missing_specification',
            message: `Line item of type ${item.containerType} does not specify weigth.`,
          },
        ],
      }

    let containerCount = item.containerCount
    if (item.containerType === LineItemContainerType.BulkBag) {
      // There can only be exactly one per pallet
      containerCount = 1
    }
    if (containerCount === null || containerCount === undefined)
      return {
        errors: [
          {
            type: 'missing_specification',
            message: `Line item of type ${item.containerType} does not specify count.`,
          },
        ],
      }
    remaingPalletWeightKg -= containerCount * (item.containerWeightGrams / 1000)

    // Subtract volume
    switch (item.containerType) {
      case LineItemContainerType.FullPallet:
        remainingPalletVolumeM = 0
        break
      case LineItemContainerType.BulkBag:
        remainingPalletVolumeM -= 1 * 1 * 0.85
        break
      default:
        const { containerHeightCm, containerLengthCm, containerWidthCm } = item

        if (
          containerHeightCm === null ||
          containerHeightCm === undefined ||
          containerLengthCm === null ||
          containerLengthCm === undefined ||
          containerWidthCm === null ||
          containerWidthCm === undefined
        ) {
          return {
            errors: [
              {
                type: 'missing_specification',
                message: `Line item of type ${item.containerType} does not specify measures.`,
              },
            ],
          }
        }
        remainingPalletVolumeM -=
          containerCount *
          (containerHeightCm / 100) *
          (containerLengthCm / 100) *
          (containerWidthCm / 100)
    }
  }

  const errors: PalletValidationError[] = []

  if (remainingPalletVolumeM < 0) {
    errors.push({
      type: 'oversize',
      message: `The pallet configuration needs ${formatNumberToFixedWithoutTrailingZeros(
        Math.abs(remainingPalletVolumeM),
      )} m³ more volume than supported by the pallet (${formatNumberToFixedWithoutTrailingZeros(
        palletMaxVolumeM,
      )} m³).`,
    })
  }

  if (remaingPalletWeightKg < 0) {
    errors.push({
      type: 'overweight',
      message: `The pallet configuration weighs ${formatNumberToFixedWithoutTrailingZeros(
        Math.abs(remaingPalletWeightKg),
      )} kg more than supported by the pallet (${formatNumberToFixedWithoutTrailingZeros(
        palletMaxWeightKg,
      )} kg).`,
    })
  }

  if (errors.length > 0) return { errors }

  return { valid: true }
}
