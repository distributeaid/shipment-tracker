import { Type } from '@sinclair/typebox'
import { Request, Response } from 'express'
import { AuthContext } from '../../authenticateRequest'
import { errorsToProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { validateIdInput } from '../../input-validation/idInputSchema'
import { validateWithJSONSchema } from '../../input-validation/validateWithJSONSchema'
import UserAccount from '../../models/user_account'
import { HTTPStatusCode } from '../../rest/response/HttpStatusCode'
import { respondWithProblem } from '../../rest/response/problem'
import { emailInput } from '../register'

const adminUpdateUserInput = Type.Object(
  {
    isConfirmed: Type.Optional(Type.Boolean()),
    isAdmin: Type.Optional(Type.Boolean()),
    email: Type.Optional(emailInput),
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  },
  { additionalProperties: false },
)

const validateAdminUpdateUserInput =
  validateWithJSONSchema(adminUpdateUserInput)

export const adminUpdateUser = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id, 10)
  // Validate user id and update input
  const validId = validateIdInput({ id })
  if ('errors' in validId) {
    return respondWithProblem(response, errorsToProblemDetail(validId.errors))
  }

  const validInput = validateAdminUpdateUserInput(request.body)
  if ('errors' in validInput) {
    return respondWithProblem(
      response,
      errorsToProblemDetail(validInput.errors),
    )
  }

  // Check if user is admin
  const authContext = request.user as AuthContext
  if (!authContext.isAdmin)
    return response.sendStatus(HTTPStatusCode.Forbidden).end()

  // Find user
  const user = await UserAccount.findByPk(validId.value.id)
  if (user === null)
    return respondWithProblem(response, {
      title: `User with id ${validId.value.id} not found!`,
      status: HTTPStatusCode.NotFound,
    })

  await user.update(validInput.value)

  return response.status(HTTPStatusCode.NoContent).end()
}
