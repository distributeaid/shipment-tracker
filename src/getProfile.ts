import { Maybe } from '@graphql-tools/utils'
import { Request, Response } from 'express'
import { AuthContext } from './authenticateRequest'
import Group from './models/group'
import UserAccount from './models/user_account'

const sendProfile = (
  response: Response,
  userAccount: UserAccount,
  isAdmin = false,
  groupId?: number,
) => response.json(userAccount.asProfile(groupId, isAdmin)).end()

const getProfile = async (request: Request, response: Response) => {
  const authContext = request.user as AuthContext
  let groupForUser: Maybe<Group>
  if (!authContext.isAdmin) {
    // Note: this assumes that there is only 1 captain per group, where in
    // reality there are no restrictions on the number of groups with the same
    // captain. For now, we've agreed that this is okay, but we probably need
    // to solidify some restrictions later on.
    // See https://github.com/distributeaid/shipment-tracker/issues/133
    groupForUser = await Group.findOne({
      where: { captainId: authContext.userAccount.id },
      attributes: ['id'],
    })
  }

  sendProfile(
    response,
    authContext.userAccount,
    authContext.isAdmin,
    groupForUser?.id,
  )
}

export default getProfile
