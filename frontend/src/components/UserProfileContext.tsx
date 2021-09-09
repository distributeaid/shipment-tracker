import { createContext, FunctionComponent, useEffect, useState } from 'react'

const SERVER_URL = process.env.REACT_APP_SERVER_URL?.replace(/\/$/, '')

export interface UserProfile {
  id: number
  isAdmin: boolean
  name: string
  groupId?: number
}

interface UserProfileData {
  profile?: UserProfile
  /**
   * Call this method to refresh the values stored in the UserProfile
   */
  refetch: () => void
}

const UserProfileContext = createContext<UserProfileData>({
  refetch: () => {},
})

const UserProfileProvider: FunctionComponent = ({ children }) => {
  const [tokenWasFetched, setTokenWasFetched] = useState(false)
  const [profile, setProfile] = useState<UserProfile>()

  const refetch = () => setTokenWasFetched(false)

  useEffect(() => {
    // We fetch the token again in case the client-side cookie has expired but
    // the remote session hasn't
    if (!tokenWasFetched) {
      fetch(`${SERVER_URL}/me`, {
        credentials: 'include',
      })
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
  }, [tokenWasFetched])

  return (
    <UserProfileContext.Provider value={{ profile, refetch }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export { UserProfileContext, UserProfileProvider }
