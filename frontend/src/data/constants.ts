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
