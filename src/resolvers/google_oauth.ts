import { ForbiddenError } from 'apollo-server'
import { authUrl } from '../googleOAuth'
import { QueryResolvers } from '../server-internal-types'

const googleOAuthUrl: QueryResolvers['googleOAuthUrl'] = async (
  _,
  __,
  context,
) => {
  if (!context.auth.isAdmin) {
    throw new ForbiddenError(
      'Non-admins cannot access Shipment Tracker google resources',
    )
  }

  return authUrl()
}

export { googleOAuthUrl }
