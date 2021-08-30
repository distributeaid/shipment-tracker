import { useState } from 'react'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return {
    isLoading,
    isAuthenticated,
    logout: () => {
      // Delete cookies (since the auth cookie is httpOnly we cannot access
      // it using JavaScript, e.g. cookie.delete() will not work).
      // Therefore we ask the server to send us an invalid cookie.
      fetch(`${SERVER_URL}/me/cookie`, { method: 'DELETE' }).then(() => {
        setIsAuthenticated(false)
        // Reload the page (no need to handle logout in the app)
        document.location.reload()
      })
    },
    login: ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/me/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
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
