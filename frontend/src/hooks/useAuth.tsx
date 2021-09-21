import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type UserProfile = {
  id: number
  isAdmin: boolean
  name: string
  groupId?: number
}

export enum AuthError {
  LOGIN_FAILED,
  REGISTER_FAILED,
  SEND_VERIFICATION_TOKEN_BY_EMAIL_FAILED,
  SET_NEW_PASSWORD_USING_TOKEN_AND_EMAIL_FAILED,
  CONFIRM_FAILED,
}

type ErrorInfo = {
  type: AuthError
  info: string
  httpStatusCode: number
}

type AuthInfo = {
  isLoading: boolean
  isAuthenticated: boolean
  isRegistered: boolean
  isConfirmed: boolean
  me?: UserProfile
  logout: () => void
  login: (_: { email: string; password: string }) => void
  error?: ErrorInfo
  register: (_: { name: string; email: string; password: string }) => void
  sendVerificationTokenByEmail: (_: { email: string }) => void
  setNewPasswordUsingTokenAndEmail: (_: {
    email: string
    token: string
    password: string
  }) => void
  confirm: (_: { email: string; token: string }) => void
  refreshMe: () => void
}

export const AuthContext = createContext<AuthInfo>({
  isLoading: false,
  isAuthenticated: false,
  isRegistered: false,
  isConfirmed: false,
  logout: () => undefined,
  login: () => undefined,
  error: undefined,
  sendVerificationTokenByEmail: () => undefined,
  setNewPasswordUsingTokenAndEmail: () => undefined,
  register: () => undefined,
  confirm: () => undefined,
  refreshMe: () => undefined,
})

export const useAuth = () => useContext(AuthContext)

const SERVER_URL = process.env.REACT_APP_SERVER_URL?.replace(/\/$/, '')

const headers = {
  'content-type': 'application/json; charset=utf-8',
}

export const tokenRegex = /^[0-9]{6}$/
export const emailRegEx = /.+@.+\..+/
export const passwordRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/

export const AuthProvider = ({
  children,
  logoutUrl,
}: PropsWithChildren<{ logoutUrl?: URL }>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState<ErrorInfo>()
  const [me, setMe] = useState<UserProfile>()

  const fetchMe = useCallback(
    () =>
      fetch(`${SERVER_URL}/me`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          setMe(data)
        })
        .catch(console.error),
    [],
  )

  useEffect(() => {
    if (!isAuthenticated) return
    if (me !== undefined) return
    fetchMe()
  }, [isAuthenticated, me, fetchMe])

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
      }).then(({ ok }) => {
        if (!ok) throw new Error(`Failed to logout!`)
        setIsAuthenticated(false)
        setMe(undefined)
        const current = new URL(document.location.href)
        document.location.href = (
          logoutUrl ?? new URL(`${current.protocol}//${current.host}`)
        ).toString()
      })
    },
    login: ({ email, password }) => {
      setIsLoading(true)
      setError(undefined)
      fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, password }),
      })
        .then(({ ok, statusText, status: httpStatusCode }) => {
          setIsAuthenticated(ok)
          if (!ok)
            setError({
              type: AuthError.LOGIN_FAILED,
              info: statusText,
              httpStatusCode,
            })
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    error,
    register: ({ name, email, password }) => {
      setIsLoading(true)
      setError(undefined)
      fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, password, name }),
      })
        .then(({ ok, statusText, status: httpStatusCode }) => {
          setIsLoading(false)
          setIsRegistered(ok)
          if (!ok)
            setError({
              type: AuthError.REGISTER_FAILED,
              info: statusText,
              httpStatusCode,
            })
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    sendVerificationTokenByEmail: ({ email }) => {
      setIsLoading(true)
      setError(undefined)
      fetch(`${SERVER_URL}/password/token`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email }),
      })
        .then(({ ok, statusText, status: httpStatusCode }) => {
          setIsLoading(false)
          if (!ok)
            setError({
              type: AuthError.SEND_VERIFICATION_TOKEN_BY_EMAIL_FAILED,
              info: statusText,
              httpStatusCode,
            })
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    setNewPasswordUsingTokenAndEmail: ({ email, password, token }) => {
      setIsLoading(true)
      setError(undefined)
      fetch(`${SERVER_URL}/password/new`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, password, token }),
      })
        .then(({ ok, statusText, status: httpStatusCode }) => {
          setIsLoading(false)
          if (!ok)
            setError({
              type: AuthError.SET_NEW_PASSWORD_USING_TOKEN_AND_EMAIL_FAILED,
              info: statusText,
              httpStatusCode,
            })
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    confirm: ({ email, token }) => {
      setIsLoading(true)
      setError(undefined)
      fetch(`${SERVER_URL}/register/confirm`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, token }),
      })
        .then(({ ok, statusText, status: httpStatusCode }) => {
          setIsLoading(false)
          setIsConfirmed(ok)
          if (!ok)
            setError({
              type: AuthError.CONFIRM_FAILED,
              info: statusText,
              httpStatusCode,
            })
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    },
    me,
    refreshMe: fetchMe,
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
