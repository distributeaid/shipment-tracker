import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import PasswordResetToken from '../../models/password_reset_token'
import UserAccount from '../../models/user_account'
import { emailInput, passwordInput } from '../register'

const newPasswordUsingTokenInput = Type.Object(
  {
    email: emailInput,
    newPassword: passwordInput,
    code: Type.String({ pattern: '^[0-9]{6}$' }),
  },
  { additionalProperties: false },
)

const validatePasswordResetInput = validateWithJSONSchema(
  newPasswordUsingTokenInput,
)

const setNewPasswordUsingToken =
  (saltRounds = 10) =>
  async (request: Request, response: Response) => {
    const valid = validatePasswordResetInput(trimAll(request.body))
    if ('errors' in valid) {
      return response
        .status(400)
        .json(new UserInputError('New password input invalid', valid.errors))
        .end()
    }

    const token = await PasswordResetToken.findOne({
      where: {
        email: valid.value.email.toLowerCase(),
        token: valid.value.code,
      },
      order: [['createdAt', 'DESC']],
    })
    if (
      token === null ||
      token.createdAt.getTime() < Date.now() - 15 * 60 * 60 * 1000 // Tokens expire after 15 minutes
    ) {
      return response.status(400).end()
    }

    const user = await UserAccount.findOne({
      where: {
        email: valid.value.email.toLowerCase(),
      },
    })
    if (user === null) {
      return response.status(400).end()
    }
    // Update the password
    await user.update({
      passwordHash: bcrypt.hashSync(valid.value.newPassword, saltRounds),
    })
    response.status(202).end()
  }

export default setNewPasswordUsingToken
