import { NextFunction, Request, Response } from 'express'
import { request } from 'https'

/**
 * Implements the friendlyCaptch verification as an express middleware.
 *
 * @see https://docs.friendlycaptcha.com/#/verification_api
 */
export const captchaCheck =
  (
    secret: string,
    endpoint = new URL('https://api.friendlycaptcha.com/api/v1/siteverify'),
  ) =>
  (req: Request, expressResponse: Response, next: NextFunction) => {
    if ((req.headers['x-friendly-captcha']?.length ?? 0) <= 0)
      return expressResponse
        .status(401)
        .send('Missing CAPTCHA in x-friendly-captcha header')
    const r = request(
      {
        host: endpoint.host,
        path: endpoint.pathname,
        protocol: endpoint.protocol,
        method: 'POST',
        port: 443,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
      (res) => {
        let data: Buffer[] = []
        res.on('data', (d) => data.push(d))
        res.on('end', () => {
          const { success, errors } = JSON.parse(Buffer.concat(data).toString())
          if (success === true) return next()
          return expressResponse.status(401).send(JSON.stringify(errors))
        })
      },
    )
    r.write(
      JSON.stringify({
        solution: req.headers['x-friendly-captcha'],
        secret,
      }),
    )
    r.end()
  }
