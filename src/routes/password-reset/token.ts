import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import { Request, Response } from 'express'
import { generateDigits } from '../../generateDigits'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import PasswordResetToken from '../../models/password_reset_token'
import UserAccount from '../../models/user_account'
import { emailInput } from '../register'

const passwordResetInput = Type.Object(
  {
    email: emailInput,
  },
  { additionalProperties: false },
)

const validatePasswordResetInput = validateWithJSONSchema(passwordResetInput)

const passwordResetToken = async (request: Request, response: Response) => {
  const valid = validatePasswordResetInput(trimAll(request.body))
  if ('errors' in valid) {
    return response
      .status(400)
      .json(new UserInputError('Password reset input invalid', valid.errors))
      .end()
  }

  const user = await UserAccount.findOne({
    where: {
      email: valid.value.email.toLowerCase(),
    },
  })
  if (user === null) {
    // Don't tell we did not find the account
    return response.status(202).end()
  }
  // Generate new token
  await PasswordResetToken.create({
    email: user.email,
    token: generateDigits(6),
  })
  // TODO: email the token
  response.status(202).end()
}

export default passwordResetToken
