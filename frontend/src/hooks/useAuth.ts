import { useState } from 'react'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return {
    isLoading,
    isAuthenticated,
    logout: () => {
      // FIXME: clear cookies and reload
      fetch(`${SERVER_URL}/me/cookie`, { method: 'DELETE' }).then(() => {
        setIsAuthenticated(false)
        document.location.reload()
      })
    },
    login: ({ username, password }: { username: string; password: string }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/me/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
        .then(() => {
          setIsAuthenticated(true)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
  }
}
