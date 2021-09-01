import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { authCookie } from '../authenticateRequest'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'
import { emailInput, passwordInput } from './register'

const loginInput = Type.Object(
  {
    email: emailInput,
    password: passwordInput,
  },
  { additionalProperties: false },
)

const validateLoginInput = validateWithJSONSchema(loginInput)

const login = async (request: Request, response: Response) => {
  const valid = validateLoginInput(trimAll(request.body))
  if ('errors' in valid) {
    return response
      .status(400)
      .json(new UserInputError('Login input invalid', valid.errors))
      .end()
  }

  const user = await UserAccount.findOneByEmail(valid.value.email)
  if (user === null) {
    return response.status(401).end()
  }
  if (!user.isConfirmed) {
    return response.status(403).end()
  }
  if (!bcrypt.compareSync(valid.value.password, user.passwordHash)) {
    return response.status(401).end()
  }
  // Generate new token
  response
    .status(204)
    .cookie(...authCookie(user))
    .end()
}

export default login
