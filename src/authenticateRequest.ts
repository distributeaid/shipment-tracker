import { AuthenticationError } from 'apollo-server-express'
import { Request } from 'express'
import { Maybe } from 'graphql/jsutils/Maybe'
import jwt, { GetPublicKeyOrSecret } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

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

export const authenticateRequest = async (req: Request): Promise<object> => {
  if (skipAuth) {
    return Promise.resolve({})
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

  // The contents of the decoded auth result are determined by the scopes
  // requested by the client when it got its bearer token from Auth0.
  // See https://auth0.com/docs/scopes for more info.
  return authResult.decoded
}
