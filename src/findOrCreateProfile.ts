import { Request, Response } from 'express'

import UserAccount from './models/user_account'
import { authenticateRequest } from './authenticateRequest'
import { sequelize } from './sequelize'

const userAccountRepository = sequelize.getRepository(UserAccount)

const findOrCreateProfile = async (request: Request, response: Response) => {
  const auth = await authenticateRequest(request)

  if (auth.userAccount != null) {
    console.info('found account for profile', auth.claims.sub)
    response.status(200).end()
    return
  }

  console.info('creating account for profile', auth.claims.sub)

  const userAccount = await userAccountRepository.create({
    auth0Id: auth.claims.sub,
  })

  console.info('created user account', userAccount.id)

  response.status(200).end()
}

export default findOrCreateProfile
