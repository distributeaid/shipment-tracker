import { Type } from '@sinclair/typebox'
import { UserInputError } from 'apollo-server-express'
import { Request, Response } from 'express'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import VerificationToken from '../../models/verification_token'
import { emailInput } from '../register'

const confirmRegistrationByEmailInput = Type.Object(
  {
    email: emailInput,
    token: Type.String({ pattern: '^[0-9]{6}$', title: 'verification token' }),
  },
  { additionalProperties: false },
)

const validateConfirmRegistrationByEmailInput = validateWithJSONSchema(
  confirmRegistrationByEmailInput,
)

const confirmRegistrationByEmail = async (
  request: Request,
  response: Response,
) => {
  const valid = validateConfirmRegistrationByEmailInput(trimAll(request.body))
  if ('errors' in valid) {
    return response
      .status(400)
      .json(
        new UserInputError('Confirm registration input invalid', valid.errors),
      )
      .end()
  }

  const user = await UserAccount.findOneByEmail(valid.value.email)
  if (user === null) {
    return response.status(404).end()
  }
  const token = await VerificationToken.findByUserAccountAndToken(
    user,
    valid.value.token,
  )
  if (token === undefined) return response.status(401).end()

  await user.update({
    isConfirmed: true,
  })

  response.status(202).end()
}

export default confirmRegistrationByEmail
