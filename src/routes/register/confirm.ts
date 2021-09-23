import { Type } from '@sinclair/typebox'
import { Request, Response } from 'express'
import { errorsToProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import VerificationToken from '../../models/verification_token'
import { HTTPStatusCode } from '../../rest/response/HttpStatusCode'
import { respondWithProblem } from '../../rest/response/problem'
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

  await user.update({
    isConfirmed: true,
  })

  response.status(202).end()
}

export default confirmRegistrationByEmail
