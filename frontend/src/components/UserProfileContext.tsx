import { useAuth0 } from '@auth0/auth0-react'
import { createContext, FunctionComponent, useEffect, useState } from 'react'

export interface UserProfile {
  id: number
  isAdmin: boolean
}

const fetchProfile = (token: string) => {
  return fetch('/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const UserProfileContext = createContext<UserProfile | undefined>(undefined)

const UserProfileProvider: FunctionComponent = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [profileIsLoaded, setProfileIsLoaded] = useState(false)
  const [profile, setProfile] = useState<UserProfile>()

  useEffect(() => {
    if (isAuthenticated && !profileIsLoaded) {
      getAccessTokenSilently()
        .then(fetchProfile)
        .then((response) => {
          if (response.ok) {
            setProfileIsLoaded(true)
          } else {
            console.error('Non-OK server response retrieving profile')
          }

          return response.json()
        })
        .then((data) => {
          setProfile(data)
        })
    }
  }, [isAuthenticated, getAccessTokenSilently, profileIsLoaded])

  return (
    <UserProfileContext.Provider value={profile}>
      {children}
    </UserProfileContext.Provider>
  )
}

export { UserProfileContext, UserProfileProvider }
