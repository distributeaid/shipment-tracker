import { useAuth0 } from '@auth0/auth0-react'
import { createContext, FunctionComponent, useEffect, useState } from 'react'

export interface UserProfile {
  id: number
  isAdmin: boolean
  groupId?: number
}

interface UserProfileData {
  profile?: UserProfile
  /**
   * Call this method to refresh the values stored in the UserProfile
   */
  refetch: () => void
}

const fetchProfile = (token: string) => {
  return fetch('/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const UserProfileContext = createContext<UserProfileData>({
  refetch: () => {},
})

const UserProfileProvider: FunctionComponent = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0()
  const [tokenWasFetched, setTokenWasFetched] = useState(false)
  const [profile, setProfile] = useState<UserProfile>()

  const refetch = () => setTokenWasFetched(false)

  useEffect(() => {
    // We fetch the token again in case the client-side cookie has expired but
    // the remote session hasn't
    if (!tokenWasFetched) {
      getAccessTokenSilently()
        .then(fetchProfile)
        .then((response) => response.json())
        .catch(() => {
          // The user is not logged in
        })
        .then((data) => {
          setProfile(data)
        })
        .finally(() => {
          setTokenWasFetched(true)
        })
    }
  }, [tokenWasFetched, getAccessTokenSilently])

  return (
    <UserProfileContext.Provider value={{ profile, refetch }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export { UserProfileContext, UserProfileProvider }
