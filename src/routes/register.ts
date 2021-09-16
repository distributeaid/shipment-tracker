import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import EventEmitter from 'events'
import { Request, Response } from 'express'
import { events } from '../events'
import { generateDigits } from '../generateDigits'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'

export const emailInput = Type.String({
  format: 'email',
  title: 'Email',
})

export const passwordInput = Type.String({
  pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$',
  title: 'Password',
})

const registerUserInput = Type.Object(
  {
    email: emailInput,
    name: Type.String({ minLength: 1, maxLength: 255 }),
    password: passwordInput,
  },
  { additionalProperties: false },
)

const validateRegisterUserInput = validateWithJSONSchema(registerUserInput)

const registerUser =
  (omnibus: EventEmitter, saltRounds = 10) =>
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

    try {
      const user = await UserAccount.create({
        passwordHash: bcrypt.hashSync(valid.value.password, saltRounds),
        email: valid.value.email,
        name: valid.value.name,
      })
      // Generate new token
      const token = await VerificationToken.create({
        userAccountId: user.id,
        token: generateDigits(6),
      })
      omnibus.emit(events.user_registered, user, token)
      return response.status(202).end()
    } catch (error) {
      if ((error as Error).name === 'SequelizeUniqueConstraintError') {
        return response.status(409).end()
      }
      console.error(error)
      return response.status(500).end()
    }
  }

export default registerUser
