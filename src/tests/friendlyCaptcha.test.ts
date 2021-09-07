import { Request, Response } from 'express'
import nock from 'nock'
import { captchaCheck } from '../friendlyCaptcha'

describe('captchaCheck', () => {
  it('should reject request if no CAPTCHA solution is present', () => {
    const f = captchaCheck('secret')
    const mockResponse: any = {
      status: jest.fn(() => mockResponse),
      send: jest.fn(() => mockResponse),
    }
    const next = jest.fn()
    f({ headers: {} } as Request, mockResponse as unknown as Response, next)

    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.send).toHaveBeenCalledWith(
      'Missing CAPTCHA in x-friendly-captcha header',
    )
    expect(next).not.toHaveBeenCalled()
  })

  describe('should verify CAPTCHA solution', () => {
    test('solution is correct', async () => {
      const scope = nock('https://api.friendlycaptcha.com')
        .post('/api/v1/siteverify', {
          solution: 'foo',
          secret: 'secret',
        })
        .reply(200, { success: true })

      const f = captchaCheck('secret')

      await new Promise((resolve) => {
        f(
          { headers: { [`x-friendly-captcha`]: 'foo' } } as unknown as Request,
          {} as unknown as Response,
          resolve,
        )
      })

      expect(scope.isDone()).toBeTruthy()
    })

    test('solution is wrong', async () => {
      const scope = nock('https://api.friendlycaptcha.com')
        .post('/api/v1/siteverify', {
          solution: 'foo',
          secret: 'secret',
        })
        .reply(200, { success: false, errors: ['Some error'] })

      const f = captchaCheck('secret')

      const next = jest.fn()

      let mockResponse: any

      await new Promise<void>((resolve) => {
        mockResponse = {
          status: jest.fn(() => mockResponse),
          send: jest.fn(() => {
            resolve()
          }),
        }

        f(
          { headers: { [`x-friendly-captcha`]: 'foo' } } as unknown as Request,
          mockResponse as unknown as Response,
          next,
        )
      })

      expect(scope.isDone()).toBeTruthy()
      expect(next).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.send).toHaveBeenCalledWith(
        JSON.stringify(['Some error']),
      )
    })
  })
})
