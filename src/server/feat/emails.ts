import EventEmitter from 'events'
import { consoleMailer } from '../../mailer/console'
import { appMailer, transportFromConfig } from '../../mailer/nodemailer'

export const setUp = (omnibus: EventEmitter): void => {
  // Configure email sending
  const emailDebug = (...args: any) => console.debug('[email]', ...args)
  const maybeTransportConfig = transportFromConfig(emailDebug)
  if (maybeTransportConfig !== undefined) {
    appMailer(omnibus, maybeTransportConfig, emailDebug)
  } else {
    consoleMailer(omnibus, emailDebug)
  }
}
