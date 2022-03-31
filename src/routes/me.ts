import { Request, Response } from 'express'
import { AuthContext } from '../authenticateRequest'
import UserAccount from '../models/user_account'
import { HTTPStatusCode } from '../rest/response/HttpStatusCode'

const getProfile = async (request: Request, response: Response) => {
  const authContext = request.user as AuthContext
  const user = await UserAccount.findByPk(authContext.userId)
  if (user === null) return response.sendStatus(HTTPStatusCode.NotFound).end()
  return response
    .json({
      email: user.email,
      ...(await user.asPublicProfile()),
    })
    .end()
}

export default getProfile
