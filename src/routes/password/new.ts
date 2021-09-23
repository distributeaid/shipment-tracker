import { Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { errorsToProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import VerificationToken from '../../models/verification_token'
import { HTTPStatusCode } from '../../rest/response/HttpStatusCode'
import { respondWithProblem } from '../../rest/response/problem'
import { emailInput, passwordInput } from '../register'

const newPasswordUsingTokenInput = Type.Object(
  {
    email: emailInput,
    newPassword: passwordInput,
    token: Type.String({ pattern: '^[0-9]{6}$' }),
  },
  { additionalProperties: false },
)

const validatePasswordResetInput = validateWithJSONSchema(
  newPasswordUsingTokenInput,
)

const setNewPasswordUsingTokenAndEmail =
  (saltRounds = 10) =>
  async (request: Request, response: Response) => {
    const valid = validatePasswordResetInput(trimAll(request.body))
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

    const token = await VerificationToken.findByUserAccountAndToken(
      user,
      valid.value.token,
    )
    if (token === undefined)
      return respondWithProblem(response, {
        title: `User with email ${valid.value.email} and token ${valid.value.token} not found!`,
        status: HTTPStatusCode.Unauthorized,
      })

    // Update the password
    await user.update({
      passwordHash: bcrypt.hashSync(valid.value.newPassword, saltRounds),
    })
    response.status(HTTPStatusCode.OK).end()
  }

export default setNewPasswordUsingTokenAndEmail
