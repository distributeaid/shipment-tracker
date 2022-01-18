export enum HTTPStatusCode {
  /** Use to indicate that the request was handled, the has immediate effect. */
  OK = 200,
  /** Use to indicate that the request is handled, but the result might not be immediately visible (eventual consistency). */
  Accepted = 202,
  /** Use for empty responses. */
  NoContent = 204,
  /** Use for invalid input. */
  BadRequest = 400,
  /** Use if invalid credentials are provided. */
  Unauthorized = 401,
  /** Use if permission is missing. */
  Forbidden = 403,
  /** Use if a requested item does not exist. */
  NotFound = 404,
  /** Use if the same resource already exists, or has been updated in the meantime. */
  Conflict = 409,
  /** Use only if you actually don't know what the problem is. */
  InternalError = 500,
}
