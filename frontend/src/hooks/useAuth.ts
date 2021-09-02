import { useState } from 'react'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const headers = {
  'content-type': 'application/json; charset=utf-8',
}

export const tokenRegex = /^[0-9]{6}$/
export const emailRegEx = /.+@.+\..+/
export const passwordRegEx =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  return {
    isLoading,
    isAuthenticated,
    isRegistered,
    isConfirmed,
    logout: () => {
      // Delete cookies (since the auth cookie is httpOnly we cannot access
      // it using JavaScript, e.g. cookie.delete() will not work).
      // Therefore we ask the server to send us an invalid cookie.
      fetch(`${SERVER_URL}/me/cookie`, {
        method: 'DELETE',
        credentials: 'include',
      }).then(() => {
        setIsAuthenticated(false)
        // Reload the page (no need to handle logout in the app)
        document.location.reload()
      })
    },
    login: ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ email, password }),
      })
        .then(() => {
          setIsAuthenticated(true)
          setIsLoading(false)
          console.log('authenticated')
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    register: ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ email, password, name }),
      })
        .then(() => {
          setIsLoading(false)
          setIsRegistered(true)
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    confirm: ({ email, token }: { email: string; token: string }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/register/confirm`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ email, token }),
      })
        .then(() => {
          setIsLoading(false)
          setIsConfirmed(true)
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
  }
}
