import EventEmitter from 'events'
import { Transporter } from 'nodemailer'
import { appMailer } from '../mailer/nodemailer'

describe('appMailer', () => {
  it('should send an email with a token when a user registers', () => {
    const sendMailMock = jest.fn()
    sendMailMock.mockImplementationOnce(() => Promise.resolve())
    const omnibus = new EventEmitter()

    appMailer(omnibus, {
      transport: {
        sendMail: sendMailMock,
      } as unknown as Transporter<unknown>,
      fromEmail: 'no-reply@distributeaid.org',
    })

    omnibus.emit(
      'user_registered',
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
      text: `Hei 👋 Alex,\n\nPlease use the token 123456 to verify your email address.\n\nPlease do not reply to this email.`,
    })
  })
})
