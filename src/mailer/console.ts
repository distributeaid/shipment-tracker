import EventEmitter from 'events'
import UserAccount from '../models/user_account'
import VerificationToken from '../models/verification_token'

export const consoleMailer = (omnibus: EventEmitter): void => {
  omnibus.on(
    'user_registered',
    (user: UserAccount, token: VerificationToken) => {
      console.debug(
        `[email] > ${user.email}: confirmation token ${token.token}`,
      )
    },
  )
}
