import { createContext, useContext, useState } from 'react'
import { PropsWithChildren } from 'react-router/node_modules/@types/react'

type AuthInfo = {
  isLoading: boolean
  isAuthenticated: boolean
  isRegistered: boolean
  isConfirmed: boolean
  logout: () => void
  login: (_: { email: string; password: string; captcha: string }) => void
  register: (_: {
    name: string
    email: string
    password: string
    captcha: string
  }) => void
  confirm: (_: { email: string; token: string; captcha: string }) => void
}

export const AuthContext = createContext<AuthInfo>({
  isLoading: false,
  isAuthenticated: false,
  isRegistered: false,
  isConfirmed: false,
  logout: () => undefined,
  login: () => undefined,
  register: () => undefined,
  confirm: () => undefined,
})

export const useAuth = () => useContext(AuthContext)

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const headers = {
  'content-type': 'application/json; charset=utf-8',
}

export const tokenRegex = /^[0-9]{6}$/
export const emailRegEx = /.+@.+\..+/
export const passwordRegEx =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const auth: AuthInfo = {
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
    login: ({ email, password, captcha }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          ...headers,
          'x-friendly-captcha': captcha,
        },
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
    register: ({ name, email, password, captcha }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          ...headers,
          'x-friendly-captcha': captcha,
        },
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
    confirm: ({ email, token, captcha }) => {
      setIsLoading(true)
      fetch(`${SERVER_URL}/register/confirm`, {
        method: 'POST',
        headers: {
          ...headers,
          'x-friendly-captcha': captcha,
        },
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

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
