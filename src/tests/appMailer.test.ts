import EventEmitter from 'events'
import { Transporter } from 'nodemailer'
import { events } from '../events'
import { appMailer } from '../mailer/nodemailer'

describe('appMailer', () => {
  describe('should send an email with a token', () => {
    let sendMailMock: jest.Mock
    const omnibus = new EventEmitter()
    beforeEach(() => {
      sendMailMock = jest.fn()
      sendMailMock.mockImplementationOnce(() => Promise.resolve())
      appMailer(omnibus, {
        transport: {
          sendMail: sendMailMock,
        } as unknown as Transporter<unknown>,
        fromEmail: 'no-reply@distributeaid.org',
      })
    })

    test.each([
      [events.user_registered],
      [events.user_password_reset_requested],
    ])('%s', (event) => {
      omnibus.emit(
        event,
        {
          name: 'Alex',
          email: 'alex@example.com',
        },
        {
          token: '123456',
        },
      )
      expect(sendMailMock).toHaveBeenCalledWith({
        from: `"Distribute Aid Shipment Tracker" <no-reply@distributeaid.org>`,
        to: `"Alex" <alex@example.com>`,
        subject: `Verification token: 123456`,
        text: `Hey 👋 Alex,\n\nPlease use the token 123456 to verify your email address.\n\nPlease do not reply to this email.\n\nIf you need support, please contact help@distributeaid.org.`,
      })
    })
  })
})
