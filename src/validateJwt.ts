import dotenv from 'dotenv'
import jwt, { GetPublicKeyOrSecret, VerifyCallback } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

dotenv.config()

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

type SigningKey = {
  publicKey?: string
  rsaPublicKey?: string
}

const getKey: GetPublicKeyOrSecret = (header, callback) => {
  if (!header?.kid) {
    return callback('Header is missing kid')
  }

  client.getSigningKey(
    header.kid,
    (error, key: SigningKey) => {
      if (error != null) callback(error)

      const signingKey: string | undefined = key.publicKey || key.rsaPublicKey

      callback(null, signingKey)
    },
  )
}

export type AuthResult = {
  decoded: object | null
  error?: object
}

export const validateJwt = async (token: string): Promise<AuthResult> => {
  return new Promise((resolve, reject) => {
    if (!!token) {
      return reject({ error: 'no token provided' })
    }

    const bearerToken = token.split(' ')

    jwt.verify(
      bearerToken[1],
      getKey,
      {
        audience: process.env.API_IDENTIFIER,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
      },
      (error, decoded) => {
        if (error) {
          resolve({ decoded: null, error })
        }
        if (decoded) {
          resolve({ decoded })
        }
      },
    )
  })
}
