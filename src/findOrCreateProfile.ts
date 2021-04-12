import { Request, Response } from 'express'
import { Maybe } from 'graphql-tools'
import { authenticateRequest } from './authenticateRequest'
import Group from './models/group'
import UserAccount from './models/user_account'

const sendProfile = (
  response: Response,
  userAccount: UserAccount,
  isAdmin = false,
  groupId?: number,
) => response.json(userAccount.asProfile(isAdmin, groupId)).end()

const findOrCreateProfile = async (request: Request, response: Response) => {
  const auth = await authenticateRequest(request)

  if (auth.userAccount != null) {
    console.info('found account for profile', auth.claims.sub)

    let groupForUser: Maybe<Group>
    if (!auth.isAdmin) {
      groupForUser = await Group.findOne({
        where: { captainId: auth.userAccount.id },
        attributes: ['id'],
      })
    }

    sendProfile(response, auth.userAccount, auth.isAdmin, groupForUser?.id)
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
