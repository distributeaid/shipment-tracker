import EventEmitter from 'events'
import { events } from '../events'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'

export const consoleMailer = (
  omnibus: EventEmitter,
  debug: (...args: any[]) => void,
): void => {
  omnibus.on(
    events.user_registered,
    (user: UserAccount, token: VerificationToken) => {
      debug(`${user.email}: confirmation token ${token.token}`)
    },
  )
  omnibus.on(
    events.user_password_reset_requested,
    (user: UserAccount, token: VerificationToken) => {
      debug(`${user.email}: confirmation token ${token.token}`)
    },
  )
}
