import { Request, Response } from 'express'
import { authenticateRequest } from './authenticateRequest'
import UserAccount from './models/user_account'

const sendProfile = (
  response: Response,
  userAccount: UserAccount,
  isAdmin = false,
) => response.json(userAccount.asProfile(isAdmin)).end()

const findOrCreateProfile = async (request: Request, response: Response) => {
  const auth = await authenticateRequest(request)

  if (auth.userAccount != null) {
    console.info('found account for profile', auth.claims.sub)

    sendProfile(response, auth.userAccount, auth.isAdmin)
    return
  }

  console.info('creating account for profile', auth.claims.sub)

  const userAccount = await UserAccount.create({
    auth0Id: auth.claims.sub,
  })

  console.info('created user account', userAccount.id)

  sendProfile(response, userAccount)
}

export default findOrCreateProfile
