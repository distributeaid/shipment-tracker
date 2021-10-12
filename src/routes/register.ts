import { Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import EventEmitter from 'events'
import { Request, Response } from 'express'
import { events } from '../events'
import { generateDigits } from '../generateDigits'
import { errorsToProblemDetail } from '../input-validation/errorsToProblemDetail'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'
import { HTTPStatusCode } from '../rest/response/HttpStatusCode'
import { respondWithProblem } from '../rest/response/problem'
import { getRequestId } from '../server/addRequestId'

export const emailInput = Type.String({
  format: 'email',
  title: 'Email',
})

export const passwordInput = Type.String({
  pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$',
  title: 'Password',
})

export const hashPassword = (password: string, saltRounds: number): string =>
  bcrypt.hashSync(password, saltRounds)

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
      return respondWithProblem(response, errorsToProblemDetail(valid.errors))
    }

    try {
      const user = await UserAccount.create({
        passwordHash: hashPassword(valid.value.password, saltRounds),
        email: valid.value.email,
        name: valid.value.name,
      })
      // Generate new token
      const token = await VerificationToken.create({
        userAccountId: user.id,
        token: generateDigits(6),
      })
      omnibus.emit(events.user_registered, user, token)
      return response.status(HTTPStatusCode.Accepted).end()
    } catch (error) {
      if ((error as Error).name === 'SequelizeUniqueConstraintError') {
        return respondWithProblem(response, {
          title: `User with email ${valid.value.email} already registered!`,
          status: HTTPStatusCode.Conflict,
        })
      }
      console.error(getRequestId(response), error)
      return respondWithProblem(response, {
        title: 'An unexpected problem occurred.',
        status: HTTPStatusCode.InternalError,
        detail: `Request ID: ${getRequestId(response)}`,
      })
    }
  }

export default registerUser
