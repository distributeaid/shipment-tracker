import { AuthenticationError } from 'apollo-server-express'
import { Request } from 'express'
import { Maybe } from 'graphql/jsutils/Maybe'
import jwt, { GetPublicKeyOrSecret } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import UserAccount from './models/user_account'
import { sequelize } from './sequelize'
import { omit } from 'lodash'

const userAccountRepository = sequelize.getRepository(UserAccount)

const skipAuth = process.env.AUTH_MODE === 'SKIP'

// These values are from the perspective of Auth0.
// audience is the Shipment Tracker API, while issuer is the
// distributeaid tenant in Auth0 that owns the API.
// jwksUri is where we can get the signing key from Auth0.
const audience: Maybe<string> =
  process.env.API_IDENTIFIER || 'https://da-shipping-tracker-dev'
const issuer = process.env.AUTH0_ISSUER || 'https://distributeaid.eu.auth0.com/'
const jwksUri =
  process.env.AUTH0_JWKS_URI ||
  'https://distributeaid.eu.auth0.com/.well-known/jwks.json'

const client = jwksClient({
  jwksUri,
})

type SigningKey = {
  publicKey?: string
  rsaPublicKey?: string
}

const getAuth0SigningKey: GetPublicKeyOrSecret = (header, callback) => {
  if (!header?.kid) {
    return callback('Header is missing kid')
  }

  client.getSigningKey(header.kid, (error, key: SigningKey) => {
    if (error != null) callback(error)

    const signingKey: string | undefined = key.publicKey || key.rsaPublicKey

    callback(null, signingKey)
  })
}

type AuthResult = {
  decoded: object | null
  error?: object
}

const validateJwt = async (token: string): Promise<AuthResult> => {
  return new Promise((resolve, reject) => {
    if (!token.startsWith('Bearer ')) {
      return reject({ error: 'Auth token is malformed' })
    }

    const bearerToken = token.split(' ')[1]

    jwt.verify(
      bearerToken,
      getAuth0SigningKey,
      {
        audience,
        issuer,
        algorithms: ['RS256'],
      },
      (error, decoded) => {
        resolve({ decoded: decoded!, error: error! })
      },
    )
  })
}

const ROLES_KEY = 'http://id.distributeaid.org/role'

type CommonAuthClaims = {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
  permissions: string[]
}

export type RawAuthClaims = CommonAuthClaims & {
  [ROLES_KEY]: string[]
}

export type AuthClaims = CommonAuthClaims & {
  roles: string[]
}

export type Auth = {
  claims: AuthClaims
  userAccount: UserAccount
}

const fakeAccount = userAccountRepository.build({ auth0Id: '' })
const fakeClaims = {
  roles: [],
  iss: '',
  sub: '',
  aud: [],
  iat: 0,
  exp: 0,
  azp: '',
  scope: '',
  permissions: [],
}

export const authenticateRequest = async (req: Request): Promise<Auth> => {
  if (skipAuth) {
    return Promise.resolve({ userAccount: fakeAccount, claims: fakeClaims })
  }

  const { authorization: token } = req.headers

  if (token == null) {
    throw new AuthenticationError('you must be logged in')
  }

  let authResult: AuthResult
  try {
    authResult = await validateJwt(token)
  } catch (e) {
    throw new AuthenticationError(e)
  }

  if (authResult.error != null) {
    throw new AuthenticationError(JSON.stringify(authResult.error))
  }

  if (authResult.decoded == null) {
    throw new AuthenticationError(
      'Authentication completed but no payload was provided.',
    )
  }

  const rawClaims = authResult.decoded as RawAuthClaims
  const [userAccount, _created] = await userAccountRepository.findOrCreate({
    where: { auth0Id: rawClaims.sub },
  })

  const roles = rawClaims[ROLES_KEY]
  const claims = omit(rawClaims, ROLES_KEY)

  return { userAccount, claims: { roles, ...claims } }
}
