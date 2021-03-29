import { ForbiddenError } from 'apollo-server'
import { Express } from 'express'
import { google } from 'googleapis'
import { pick } from 'lodash'

const { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

const warn = (varName: string) =>
  console.warn(`Missing ${varName}, google auth won't work`)

if (process.env.NODE_ENV?.toUpperCase() !== 'TEST') {
  if (!BASE_URL) warn('BASE_URL')
  if (!GOOGLE_CLIENT_ID) warn('GOOGLE_CLIENT_ID')
  if (!GOOGLE_CLIENT_SECRET) warn('GOOGLE_CLIENT_SECRET')
}

const CALLBACK_PATH = '/google-oauth-callback'
const CALLBACK_URL = `${BASE_URL}${CALLBACK_PATH}`
const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
]

export const createAuthClient = () =>
  new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CALLBACK_URL)

export function authUrl() {
  if (!BASE_URL) throw new Error('Missing BASE_URL')
  if (!GOOGLE_CLIENT_ID) throw new Error('Missing GOOGLE_CLIENT_ID')
  if (!GOOGLE_CLIENT_SECRET) throw new Error('Missing GOOGLE_CLIENT_SECRET')

  return createAuthClient().generateAuthUrl({
    access_type: 'offline',
    scope: DEFAULT_SCOPES,
  })
}

export function addGoogleAuthCallback(server: Express) {
  server.get(CALLBACK_PATH, async (request, response) => {
    if (request.query.error) {
      throw new ForbiddenError('Unsuccessful authentication with google')
    }

    const credentials = await createAuthClient().getToken(
      request.query['code'] as string,
    )
    const cookieContents = pick(credentials, [
      'refresh_token',
      'expiry_date',
      'access_token',
      'token_type',
      'id_token',
    ])

    console.log('Google auth result:', cookieContents)

    response.cookie('google-oauth-state', JSON.stringify(cookieContents))
    response.redirect('/')
  })
}
