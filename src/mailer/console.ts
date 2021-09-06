import EventEmitter from 'events'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'

export const consoleMailer = (
  omnibus: EventEmitter,
  debug: (...args: any[]) => void,
): void => {
  omnibus.on(
    'user_registered',
    (user: UserAccount, token: VerificationToken) => {
      debug(`${user.email}: confirmation token ${token.token}`)
    },
  )
}
