import { Response } from 'express'
import { ProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { HTTPStatusCode } from './HttpStatusCode'

export const respondWithProblem = (
  response: Response,
  problem: ProblemDetail & { status: HTTPStatusCode },
) => {
  response.status(problem.status).json(problem).end()
}
