import { Strategy as CookieStrategy } from 'passport-cookie'
import UserAccount from './models/user_account'

const fakeAccount = UserAccount.build({
  username: '',
  token: '',
  passwordHash: '',
})

export type AuthContext = {
  userAccount: UserAccount
  isAdmin: boolean
}

export type ErrorInfo = {
  message: string
}

export const fakeAdminAuth: AuthContext = {
  userAccount: fakeAccount,
  isAdmin: true,
}

export const fakeUserAuth: AuthContext = {
  userAccount: fakeAccount,
  isAdmin: false,
}

export const authenticateWithToken = async (
  token: string,
): Promise<AuthContext | ErrorInfo> => {
  try {
    const userAccount = await UserAccount.findOne({
      where: { token },
    })
    if (userAccount === null) return { message: 'User not found for token.' }
    return { userAccount, isAdmin: false }
  } catch (err) {
    return { message: (err as Error).message }
  }
}

export const authTokenCookieName = 'token'
export const cookieAuthStrategy = new CookieStrategy(
  {
    cookieName: authTokenCookieName,
    signed: true,
  },
  async (token: string, done: any) => {
    const res = await authenticateWithToken(token)
    if ('userAccount' in res) return done(null, res)
    return done(null, false, res)
  },
)
