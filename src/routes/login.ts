import { Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { authCookie } from '../authenticateRequest'
import { errorsToProblemDetail } from '../input-validation/errorsToProblemDetail'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'
import { HTTPStatusCode } from '../rest/response/HttpStatusCode'
import { respondWithProblem } from '../rest/response/problem'
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
    return respondWithProblem(response, errorsToProblemDetail(valid.errors))
  }

  const user = await UserAccount.findOneByEmail(valid.value.email)
  if (user === null) {
    return respondWithProblem(response, {
      title: `User with email ${valid.value.email} not found!`,
      status: HTTPStatusCode.NotFound,
    })
  }
  if (!bcrypt.compareSync(valid.value.password, user.passwordHash)) {
    return respondWithProblem(response, {
      title: `Provided password did not match.`,
      status: HTTPStatusCode.Unauthorized,
    })
  }
  if (!user.isConfirmed) {
    return respondWithProblem(response, {
      title: `User with email ${valid.value.email} is not confirmed!`,
      status: HTTPStatusCode.Forbidden,
    })
  }
  // Generate new token
  const [name, val, options] = authCookie(user)
  response
    .status(HTTPStatusCode.NoContent)
    .cookie(name, val, options)
    .header('Expires', options.expires.toString())
    .end()
}

export default login
