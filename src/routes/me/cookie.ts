import { Request, Response } from 'express'
import {
  AuthContext,
  authCookie,
  expireAuthCookie,
  userHash,
} from '../../authenticateRequest'
import UserAccount from '../../models/user_account'
import { HTTPStatusCode } from '../../rest/response/HttpStatusCode'
import { respondWithProblem } from '../../rest/response/problem'

export const renewCookie = async (request: Request, response: Response) => {
  const authContext = request.user as AuthContext
  const user = await UserAccount.findByPk(authContext.userId)
  if (user === null) {
    return respondWithProblem(response, {
      title: `User for token not found!`,
      status: HTTPStatusCode.NotFound,
    })
  }
  if (userHash(user) !== authContext.userHash) {
    return respondWithProblem(response, {
      title: `Cookie now longer valid!`,
      status: HTTPStatusCode.Unauthorized,
    })
  }
  // Generate new token
  response
    .status(HTTPStatusCode.NoContent)
    .cookie(...authCookie(user))
    .end()
}

export const deleteCookie = (_: Request, response: Response) =>
  response
    .status(HTTPStatusCode.NoContent)
    .cookie(...expireAuthCookie())
    .end()
