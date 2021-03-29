import { ForbiddenError } from 'apollo-server'
import { MutationResolvers } from '../server-internal-types'

const updateProfileWithGoogleAuthState: MutationResolvers['updateProfileWithGoogleAuthState'] = async (
  _,
  { input },
  { auth },
) => {
  if (!auth.isAdmin) {
    throw new ForbiddenError(
      'Non-admins cannot add google auth to their profiles',
    )
  }

  const { userAccount } = auth

  return (await userAccount.update({ googleAuthState: input })).asProfile()
}

export { updateProfileWithGoogleAuthState }
