import { Request, Response } from 'express'
import { AuthContext } from '../authenticateRequest'
import UserAccount from '../models/user_account'
import { HTTPStatusCode } from '../rest/response/HttpStatusCode'

export const adminListUsers = async (request: Request, response: Response) => {
  const authContext = request.user as AuthContext
  if (!authContext.isAdmin)
    return response.sendStatus(HTTPStatusCode.Forbidden).end()
  return response
    .json(
      (await UserAccount.findAll()).map(
        ({ id, email, name, isAdmin, isConfirmed }) => ({
          id,
          email,
          name,
          isAdmin,
          isConfirmed,
        }),
      ),
    )
    .end()
}
