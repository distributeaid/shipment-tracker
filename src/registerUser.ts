import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { v4 } from 'uuid'
import { authTokenCookieName } from './authenticateRequest'
import UserAccount from './models/user_account'

// FIXME: Add input validation
const registerUser =
  (saltRounds = 10) =>
  async (request: Request, response: Response) => {
    const token = v4()
    await UserAccount.create({
      passwordHash: bcrypt.hashSync(request.body.password, saltRounds),
      token,
      username: request.body.username,
    })
    response
      .status(202)
      .cookie(authTokenCookieName, token, { signed: true })
      .end()
  }

export default registerUser
