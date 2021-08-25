import { Request, Response } from 'express'
import { AuthContext, authCookie, userHash } from '../../authenticateRequest'
import UserAccount from '../../models/user_account'

const renewCookie =
  (penaltySeconds = 10) =>
  async (request: Request, response: Response) => {
    const authContext = request.user as AuthContext
    console.log(authContext)
    const user = await UserAccount.findByPk(authContext.userId)
    if (user === null) {
      // Penalize
      await new Promise((resolve) => setTimeout(resolve, penaltySeconds * 1000))
      return response.status(401).end()
    }
    if (userHash(user) !== authContext.userHash) {
      // Penalize
      await new Promise((resolve) => setTimeout(resolve, penaltySeconds * 1000))
      return response.status(401).end()
    }
    // Generate new token
    response
      .status(204)
      .cookie(...authCookie(user))
      .end()
  }

export default renewCookie
