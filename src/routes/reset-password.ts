import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { AuthContext, authCookie } from '../authenticateRequest'
import { trimAll } from '../input-validation/trimAll'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import UserAccount from '../models/user_account'
import { passwordInput } from './register'

const resetPasswordInput = Type.Object(
  {
    currentPassword: passwordInput,
    newPassword: passwordInput,
  },
  { additionalProperties: false },
)

const validateResetPasswordInput = validateWithJSONSchema(resetPasswordInput)

const resetPassword =
  (saltRounds = 10) =>
  async (request: Request, response: Response) => {
    const valid = validateResetPasswordInput(trimAll(request.body))
    if ('errors' in valid) {
      return response
        .status(400)
        .json(new UserInputError('Password reset input invalid', valid.errors))
        .end()
    }

    const authContext = request.user as AuthContext
    const user = await UserAccount.findByPk(authContext.userId)
    if (user === null) return response.send(404).end()

    if (!bcrypt.compareSync(valid.value.currentPassword, user.passwordHash)) {
      return response.status(400).end()
    }

    if (valid.value.currentPassword === valid.value.newPassword) {
      return response.status(400).end()
    }

    const passwordHash = bcrypt.hashSync(valid.value.newPassword, saltRounds)
    await user.update({
      passwordHash,
    })

    return response
      .cookie(...authCookie(user))
      .status(204)
      .end()
  }

export default resetPassword
