import { Response } from 'express'
import { ProblemDetail } from '../../input-validation/errorsToProblemDetail'
import { HTTPStatusCode } from './HttpStatusCode'

export const respondWithProblem = (
  response: Response,
  problem: ProblemDetail & { status: HTTPStatusCode },
) => {
  response
    .status(problem.status)
    // @see https://datatracker.ietf.org/doc/html/rfc7807#section-3
    .header('Content-Type', 'application/problem+json; charset=utf-8')
    .send(JSON.stringify(problem))
    .end()
}
