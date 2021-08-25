import { Request, Response } from 'express'
import { AuthContext } from '../authenticateRequest'
import UserAccount from '../models/user_account'

const getProfile = async (request: Request, response: Response) => {
  const authContext = request.user as AuthContext
  const user = await UserAccount.findByPk(authContext.userId)
  if (user === null) return response.send(404).end()
  return response
    .json({
      username: user.username,
      ...(await user.asPublicProfile()),
    })
    .end()
}

export default getProfile
