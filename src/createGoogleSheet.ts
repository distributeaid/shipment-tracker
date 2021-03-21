export type GoogleSheetRow = Array<string | number | null | undefined>

export default async function createGoogleSheet(
  title: string,
  rows: Array<GoogleSheetRow>,
) {
  console.log('DOING IT FOR REAL')
  return 'stub-url'
}
