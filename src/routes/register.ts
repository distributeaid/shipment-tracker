import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { authCookie } from '../authenticateRequest'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'

export const usernameInput = Type.String({
  pattern: '^[a-z0-9._-]{1,255}$',
  title: 'Username',
})

export const passwordInput = Type.String({
  pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
  title: 'Password',
})

const registerUserInput = Type.Object(
  {
    username: usernameInput,
    name: Type.String({ minLength: 1, maxLength: 255 }),
    password: passwordInput,
  },
  { additionalProperties: false },
)

const validateRegisterUserInput = validateWithJSONSchema(registerUserInput)

const registerUser =
  (saltRounds = 10) =>
  async (request: Request, response: Response) => {
    const valid = validateRegisterUserInput(trimAll(request.body))
    if ('errors' in valid) {
      return response
        .status(400)
        .json(
          new UserInputError('User registration input invalid', valid.errors),
        )
        .end()
    }

    const user = await UserAccount.create({
      passwordHash: bcrypt.hashSync(valid.value.password, saltRounds),
      username: valid.value.username,
      name: valid.value.name,
    })

    return response
      .status(202)
      .cookie(...authCookie(user))
      .end()
  }

export default registerUser
