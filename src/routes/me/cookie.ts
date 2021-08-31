import { Request, Response } from 'express'
import {
  AuthContext,
  authCookie,
  expireAuthCookie,
  userHash,
} from '../../authenticateRequest'
import UserAccount from '../../models/user_account'

export const renewCookie = async (request: Request, response: Response) => {
  const authContext = request.user as AuthContext
  const user = await UserAccount.findByPk(authContext.userId)
  if (user === null) {
    // Penalize
    return response.status(401).end()
  }
  if (userHash(user) !== authContext.userHash) {
    // Penalize
    return response.status(401).end()
  }
  // Generate new token
  response
    .status(204)
    .cookie(...authCookie(user))
    .end()
}

export const deleteCookie = (_: Request, response: Response) =>
  response
    .status(204)
    .cookie(...expireAuthCookie())
    .end()
