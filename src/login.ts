import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { v4 } from 'uuid'
import { authTokenCookieName } from './authenticateRequest'
import UserAccount from './models/user_account'

// FIXME: Add input validation
const login =
  (penaltySeconds = 10) =>
  async (request: Request, response: Response) => {
    const user = await UserAccount.findOne({
      where: {
        username: request.body.username,
      },
    })
    if (user === null) {
      // Penalize
      await new Promise((resolve) => setTimeout(resolve, penaltySeconds * 1000))
      return response.status(401).end()
    }
    if (!bcrypt.compareSync(request.body.password, user.passwordHash)) {
      // Penalize
      await new Promise((resolve) => setTimeout(resolve, penaltySeconds * 1000))
      return response.status(401).end()
    }
    // Generate new token
    const token = v4()
    await user.update({ token })
    response
      .status(204)
      .cookie(authTokenCookieName, token, { signed: true })
      .end()
  }

export default login
