import { useAllGroupsMinimalQuery } from '../types/api-types'
import { useAuth } from './useAuth'

export const useGroupLeaderGroups = () => {
  const { me: profile } = useAuth()

  const { data } = useAllGroupsMinimalQuery({
    variables: {
      captainId: profile?.id,
    },
    fetchPolicy: 'no-cache',
  })
  return data?.listGroups ?? []
}
