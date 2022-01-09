import { Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { AuthContext, ExpressCookieForUser } from '../../authenticateRequest'
import { errorsToProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import { HTTPStatusCode } from '../../rest/response/HttpStatusCode'
import { respondWithProblem } from '../../rest/response/problem'
import { hashPassword, passwordInput } from '../register'

const changePasswordInput = Type.Object(
  {
    currentPassword: passwordInput,
    newPassword: passwordInput,
  },
  { additionalProperties: false },
)

const validateChangePasswordInput = validateWithJSONSchema(changePasswordInput)

const changePassword =
  ({
    authCookie,
    saltRounds,
  }: {
    authCookie: ExpressCookieForUser
    saltRounds?: number
  }) =>
  async (request: Request, response: Response) => {
    const valid = validateChangePasswordInput(trimAll(request.body))
    if ('errors' in valid) {
      return respondWithProblem(response, errorsToProblemDetail(valid.errors))
    }

    if (valid.value.currentPassword === valid.value.newPassword) {
      return respondWithProblem(response, {
        title: `Current and new password cannot be the same.`,
        status: HTTPStatusCode.BadRequest,
      })
    }

    const authContext = request.user as AuthContext
    const user = await UserAccount.findByPk(authContext.userId)
    if (user === null)
      return respondWithProblem(response, {
        title: `User for token not found!`,
        status: HTTPStatusCode.NotFound,
      })

    if (!bcrypt.compareSync(valid.value.currentPassword, user.passwordHash)) {
      return respondWithProblem(response, {
        title: `Current password did not match.`,
        status: HTTPStatusCode.Unauthorized,
      })
    }

    const passwordHash = hashPassword(valid.value.newPassword, saltRounds)
    await user.update({
      passwordHash,
    })

    return response
      .cookie(...authCookie(user))
      .status(HTTPStatusCode.NoContent)
      .end()
  }

export default changePassword
