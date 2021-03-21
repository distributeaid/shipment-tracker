import { google } from 'googleapis'

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env

if (!GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('Missing GOOGLE_API_KEY')
}

const sheets = google.sheets('v4')

export type GoogleSheetRow = Array<string | number | null | undefined>

export default async function createGoogleSheet(
  title: string,
  rows: Array<GoogleSheetRow>,
): Promise<string> {
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title },
    },
  })

  if (createResponse.statusText !== 'OK') {
    throw new Error(
      `Received non-OK response from google sheets for create: ${createResponse.statusText}`,
    )
  }

  if (!createResponse.data.spreadsheetUrl) {
    throw new Error(
      `Google sheet create response does not include spreadheetUrl`,
    )
  }

  const updateResponse = await sheets.spreadsheets.values.update({
    spreadsheetId: createResponse.data.spreadsheetId,
    range: 'A1:A1',
    requestBody: {
      values: rows,
    },
  })

  if (updateResponse.statusText !== 'OK') {
    throw new Error(
      `Received non-OK response from google sheets for update: ${updateResponse.statusText}`,
    )
  }

  return createResponse.data.spreadsheetUrl
}
