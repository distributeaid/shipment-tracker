import _uniq from 'lodash/uniq'
import { LineItem, LineItemContainerType } from '../types/api-types'

/**
 * Strips empty, undefined, and null fields from an object. This method is
 * intentionally NOT recursive.
 *
 * @example setEmptyFieldsToUndefined({
 *   a: "",
 *   b: null,
 *   c: 123
 * })
 * // returns { c: 123 }
 */
export function setEmptyFieldsToUndefined<T>(data: T) {
  if (typeof data === 'object') {
    const objectWithoutNulls = { ...data } as any
    Object.keys(data).forEach((key) => {
      if (objectWithoutNulls[key] == null || objectWithoutNulls[key] === '') {
        delete objectWithoutNulls[key]
      }
    })
    return objectWithoutNulls as T
  }

  return data
}

type PartialLineItem = Pick<LineItem, 'containerType' | 'containerCount'>

/**
 * Validates the line items on a pallet by looking at the containerType and
 * containerCount of each line item
 *
 * If the contents are invalid, an `error` string will be returned.
 */
export function validatePalletContents(lineItems: PartialLineItem[]): {
  error?: string
  valid: boolean
} {
  const numLineItems = lineItems.length
  const allContainerTypes = _uniq(lineItems.map((item) => item.containerType))

  // Count the containers by type
  const containerCounts = lineItems.reduce(
    (accum, item) => {
      accum[item.containerType] += item.containerCount ?? 1
      return accum
    },
    {
      [LineItemContainerType.Box]: 0,
      [LineItemContainerType.BulkBag]: 0,
      [LineItemContainerType.FullPallet]: 0,
      [LineItemContainerType.Unset]: 0,
    },
  )

  if (
    allContainerTypes.includes(LineItemContainerType.FullPallet) &&
    numLineItems > 1
  ) {
    return {
      valid: false,
      error:
        'One type of item takes up the entire pallet, which leaves no room for other items.',
    }
  }

  if (containerCounts[LineItemContainerType.FullPallet] > 1) {
    return {
      valid: false,
      error: 'There can only be one item that takes up the entire pallet.',
    }
  }

  if (containerCounts[LineItemContainerType.Box] > 36) {
    return {
      valid: false,
      error: 'A pallet cannot contain more than 36 boxes.',
    }
  }

  if (containerCounts[LineItemContainerType.BulkBag] > 1) {
    return {
      valid: false,
      error: 'A pallet cannot contain more than 1 bulk bag.',
    }
  }

  if (
    containerCounts[LineItemContainerType.Box] > 18 &&
    containerCounts[LineItemContainerType.BulkBag] === 1
  ) {
    return {
      valid: false,
      error:
        'A pallet cannot contain more than 18 boxes if it also contains a bulk bag.',
    }
  }

  return { valid: true }
}
