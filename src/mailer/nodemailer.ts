import EventEmitter from 'events'
import nodemailer, { Transporter } from 'nodemailer'
import { events } from '../events'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'

const host = process.env.SMTP_SERVER
const port = parseInt(process.env.SMTP_PORT ?? '587', 10)
const secure = (process.env.SMTP_SECURE ?? 'false') === 'true'
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASSWORD
const fromEmail = process.env.SMTP_FROM

const canSendEmails =
  [host, port, secure, user, pass, fromEmail].filter((v) => v === undefined)
    .length === 0

export const transportFromConfig = (
  debug?: (...args: any[]) => void,
):
  | {
      transport: Transporter<unknown>
      fromEmail: string
    }
  | undefined => {
  if (canSendEmails) {
    debug?.(`Sending of emails ENABLED via ${host}!`)
    return {
      transport: nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      }),
      fromEmail: fromEmail as string,
    }
  }
  console.error(`Sending of emails DISABLED!`)
}

export const verificationEmail = (
  user: UserAccount,
  token: VerificationToken,
  fromEmail: string,
) => ({
  from: `"Distribute Aid Shipment Tracker" <${fromEmail}>`,
  to: `"${user.name}" <${user.email}>`,
  subject: `Verification token: ${token.token}`,
  text: `Hei 👋 ${user.name},\n\nPlease use the token ${token.token} to verify your email address.\n\nPlease do not reply to this email.`,
})

export const appMailer = (
  omnibus: EventEmitter,
  {
    transport,
    fromEmail,
  }: { transport: Transporter<unknown>; fromEmail: string },
  debug?: (...args: any[]) => void,
): void => {
  const sendEmailVerificationToken = async (
    user: UserAccount,
    token: VerificationToken,
  ) => {
    debug?.(`> ${user.email}: confirmation token ${token.token}`)
    try {
      await transport.sendMail(verificationEmail(user, token, fromEmail))
      debug?.('> message sent')
    } catch (error) {
      console.error(`Failed to sent email: ${(error as Error).message}`)
      console.error(error)
    }
  }
  omnibus.on(events.user_registered, sendEmailVerificationToken)
  omnibus.on(events.user_password_reset_requested, sendEmailVerificationToken)
}
