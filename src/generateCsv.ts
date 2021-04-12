export type CsvFieldValue = string | number | null | undefined

export type CsvRow = Array<CsvFieldValue>

const convertCsvField = (value: CsvFieldValue) => {
  if (!value) {
    return '""'
  }

  switch (typeof value) {
    case 'number':
      return value
    case 'string':
      return '"' + value.replace(/[\n\s\r\v\t]+/gm, ' ') + '"'
    default:
      throw new Error(
        `unrecognized value type in CSV generation: ${typeof value}`,
      )
  }
}

const generateCsv = (rows: CsvRow[]): string =>
  rows.map((row) => row.map(convertCsvField).join(',')).join('\n')

export default generateCsv
