import EventEmitter from 'events'
import nodemailer, { Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'

const host = process.env.SMTP_SERVER
const port = parseInt(process.env.SMTP_PORT ?? '587', 10)
const secure = (process.env.SMTP_SECURE ?? 'false') === 'true'
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASSWORD

export const canSendEmails = () =>
  [host, port, secure, user, pass].find((v) => v === undefined) === undefined

let transport: Transporter<SMTPTransport.SentMessageInfo> | undefined

if (canSendEmails())
  transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

export const verificationEmail = (
  user: UserAccount,
  token: VerificationToken,
) => ({
  from: `"Distribute Aid Shipment Tracker" <${process.env.SMTP_FROM}>`,
  to: `"${user.name}" <${user.email}>`,
  subject: `Verification token: ${token.token}`,
  text: `Hei 👋 ${user.name},\n\nPlease use the token ${token.token} to verify your email address.\n\nPlease do not reply to this email.`,
})

export const smtpMailer = (omnibus: EventEmitter): void => {
  if (transport === undefined) {
    console.error(`[email] Sending of emails DISABLED!`)
    return
  }
  console.debug(`[email] Sending of emails ENABLED via ${host}!`)
  omnibus.on(
    'user_registered',
    async (user: UserAccount, token: VerificationToken) => {
      console.debug(
        `[email] > ${user.email}: confirmation token ${token.token}`,
      )
      try {
        await transport!.sendMail(verificationEmail(user, token))
        console.debug('[email] > message sent')
      } catch (error) {
        console.error(`Failed to sent email: ${(error as Error).message}`)
        console.error(error)
      }
    },
  )
}
