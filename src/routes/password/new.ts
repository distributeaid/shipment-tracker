import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import VerificationToken from '../../models/verification_token'
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

const setNewPasswordUsingTokenAndEmail =
  (saltRounds = 10) =>
  async (request: Request, response: Response) => {
    const valid = validatePasswordResetInput(trimAll(request.body))
    if ('errors' in valid) {
      return response
        .status(400)
        .json(new UserInputError('New password input invalid', valid.errors))
        .end()
    }

    const user = await UserAccount.findOneByEmail(valid.value.email)
    if (user === null) {
      return response.status(404).end()
    }

    const token = await VerificationToken.findByUserAccountAndToken(
      user,
      valid.value.code,
    )
    if (token === undefined) return response.status(401).end()

    // Update the password
    await user.update({
      passwordHash: bcrypt.hashSync(valid.value.newPassword, saltRounds),
    })
    response.status(202).end()
  }

export default setNewPasswordUsingTokenAndEmail
