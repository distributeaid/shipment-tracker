import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { authCookie } from '../authenticateRequest'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'
import { passwordInput, usernameInput } from './register'

const loginInput = Type.Object(
  {
    username: usernameInput,
    password: passwordInput,
  },
  { additionalProperties: false },
)

const validateLoginInput = validateWithJSONSchema(loginInput)

const login =
  (penaltySeconds = 10) =>
  async (request: Request, response: Response) => {
    const valid = validateLoginInput(trimAll(request.body))
    if ('errors' in valid) {
      return response
        .status(400)
        .json(new UserInputError('Login input invalid', valid.errors))
        .end()
    }

    const user = await UserAccount.findOne({
      where: {
        username: valid.value.username,
      },
    })
    if (user === null) {
      // Penalize
      await new Promise((resolve) => setTimeout(resolve, penaltySeconds * 1000))
      return response.status(401).end()
    }
    if (!bcrypt.compareSync(valid.value.password, user.passwordHash)) {
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

export default login
