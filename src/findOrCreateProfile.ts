import { Request, Response } from 'express'

import { UserProfile } from './server-internal-types'
import UserAccount from './models/user_account'
import { authenticateRequest } from './authenticateRequest'
import { sequelize } from './sequelize'

const sendProfile = (
  response: Response,
  userAccount: UserAccount,
  isAdmin = false,
) => {
  const profile: UserProfile = { id: userAccount.id, isAdmin }

  response.json(profile).end()
}

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
