import * as crypto from 'crypto'
import { CookieOptions } from 'express'
import { Strategy as CookieStrategy } from 'passport-cookie'
import UserAccount from './models/user_account'

type AuthCookiePayload = {
  /** user ID */
  i: number
  /** user is admin */
  a: boolean
  /** user hash */
  c: string
}

export type AuthContext = {
  userId: number
  isAdmin: boolean
  userHash: string
}

export const userHash = (user: UserAccount): string =>
  crypto
    .createHash('sha1')
    .update(`${user.id}:${user.username}:${user.passwordHash}`)
    .digest('hex')

export const authCookieName = 'auth'
export const cookieAuthStrategy = new CookieStrategy(
  {
    cookieName: authCookieName,
    signed: true,
  },
  async (value: string, done: any) => {
    try {
      return done(null, decodeAuthCookie(value))
    } catch (error) {
      return done(
        null,
        false,
        new Error(
          `Failed to decode cookie payload: ${(error as Error).message}!`,
        ),
      )
    }
  },
)

export const authCookie = (
  user: UserAccount,
  lifetimeInMinutes: number = 30,
): [string, string, CookieOptions] => [
  authCookieName,
  JSON.stringify({
    i: user.id,
    a: false,
    c: userHash(user),
  }),
  {
    signed: true,
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + lifetimeInMinutes * 60 * 1000),
  },
]

// Sends an expired cookie to the client so it will be removed
export const expireAuthCookie = (): [string, string, CookieOptions] => [
  authCookieName,
  '',
  {
    signed: true,
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() - 60 * 1000),
  },
]

export const userToAuthContext = (user: UserAccount): AuthContext => ({
  isAdmin: user.isAdmin,
  userId: user.id,
  userHash: userHash(user),
})

export const decodeAuthCookie = (value: string): AuthContext => {
  const {
    i: userId,
    a: isAdmin,
    c: userHash,
  } = JSON.parse(value) as AuthCookiePayload
  return { userId, isAdmin, userHash }
}
