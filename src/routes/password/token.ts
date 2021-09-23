import { Type } from '@sinclair/typebox'
import EventEmitter from 'events'
import { Request, Response } from 'express'
import { events } from '../../events'
import { generateDigits } from '../../generateDigits'
import { errorsToProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { trimAll } from '../../input-validation/trimAll'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import VerificationToken from '../../models/verification_token'
import { HTTPStatusCode } from '../../rest/response/HttpStatusCode'
import { respondWithProblem } from '../../rest/response/problem'
import { emailInput } from '../register'

const passwordResetInput = Type.Object(
  {
    email: emailInput,
  },
  { additionalProperties: false },
)

const validatePasswordResetInput = validateWithJSONSchema(passwordResetInput)

const sendVerificationTokenByEmail =
  (omnibus: EventEmitter) => async (request: Request, response: Response) => {
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
    // Generate new token
    const token = await VerificationToken.create({
      userAccountId: user.id,
      token: generateDigits(6),
    })
    omnibus.emit(events.user_password_reset_requested, user, token)
    response.status(202).end()
  }

export default sendVerificationTokenByEmail
