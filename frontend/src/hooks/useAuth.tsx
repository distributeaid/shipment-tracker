import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { withLocalStorage } from '../utils/withLocalStorage'

export type UserProfile = {
  id: number
  isAdmin: boolean
  name: string
}

export enum AuthErrorType {
  LOGIN_FAILED,
  REGISTER_FAILED,
  SEND_VERIFICATION_TOKEN_BY_EMAIL_FAILED,
  SET_NEW_PASSWORD_USING_TOKEN_AND_EMAIL_FAILED,
  CONFIRM_FAILED,
}

export class AuthError extends Error {
  public readonly httpStatusCode: number
  constructor(message: string, httpStatusCode: number) {
    super(message)
    this.name = 'AuthError'
    this.httpStatusCode = httpStatusCode
  }
}

type AuthInfo = {
  me?: UserProfile
  logout: () => Promise<void>
  login: (_: { email: string; password: string }) => Promise<void>
  register: (_: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  sendVerificationTokenByEmail: (_: { email: string }) => Promise<void>
  setNewPasswordUsingTokenAndEmail: (_: {
    email: string
    token: string
    password: string
  }) => Promise<void>
  confirm: (_: { email: string; token: string }) => Promise<void>
  refreshMe: () => Promise<void>
  refreshCookie: () => Promise<void>
}

export const AuthContext = createContext<AuthInfo>({
  logout: () => Promise.resolve(),
  login: () => Promise.resolve(),
  sendVerificationTokenByEmail: () => Promise.resolve(),
  setNewPasswordUsingTokenAndEmail: () => Promise.resolve(),
  register: () => Promise.resolve(),
  confirm: () => Promise.resolve(),
  refreshMe: () => Promise.resolve(),
  refreshCookie: () => Promise.resolve(),
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
  const storedIsAuthenticated = withLocalStorage<boolean>(
    'auth:isAuthenticated',
    false,
  )
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    storedIsAuthenticated.get() as boolean,
  )
  const storedMe = withLocalStorage<UserProfile>('auth:me')
  const [me, setMe] = useState<UserProfile>(storedMe.get() as UserProfile)
  const [expires, setExpires] = useState<Date>()
  const [userClickTime, setUserClickTime] = useState<Date>()

  const fetchMe = useCallback(
    () =>
      fetch(`${SERVER_URL}/auth/me`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          setMe(data)
          storedMe.set(data)
        })
        .catch(console.error),
    [storedMe],
  )

  useEffect(() => {
    if (!isAuthenticated) return
    if (me !== undefined) return
    fetchMe()
  }, [isAuthenticated, me, fetchMe])

  // Auto-refresh auth cookie
  const refreshCookie = useCallback(
    () =>
      fetch(`${SERVER_URL}/auth/me/cookie`, {
        credentials: 'include',
        cache: 'no-store',
      })
        .then(({ ok, status: httpStatusCode, headers }) => {
          if (!ok)
            throw new AuthError(`Failed to refresh cookie!`, httpStatusCode)
          const exp = headers.get('Expires')
          if (exp !== null) {
            setExpires(new Date(exp))
          }
        })
        .catch(console.error),
    [],
  )
  useEffect(() => {
    if (expires === undefined) return
    if (userClickTime === undefined) return
    // Refresh cookie if expires in less than 5 minutes
    const diff = expires.getTime() - userClickTime.getTime()
    if (diff < 5 * 60 * 1000) {
      refreshCookie()
    }
  }, [expires, userClickTime, refreshCookie])

  useEffect(() => {
    const onClick = () => {
      setUserClickTime(new Date())
    }
    document.body.addEventListener('click', onClick)
    return () => {
      document.body.removeEventListener('click', onClick)
    }
  }, [])

  const auth: AuthInfo = {
    me,
    refreshMe: fetchMe,
    refreshCookie,
    logout: async () =>
      // Delete cookies (since the auth cookie is httpOnly we cannot access
      // it using JavaScript, e.g. cookie.delete() will not work).
      // Therefore we ask the server to send us an invalid cookie.
      fetch(`${SERVER_URL}/auth/me/cookie`, {
        method: 'DELETE',
        credentials: 'include',
      }).then(({ ok, status: httpStatusCode }) => {
        if (!ok) throw new AuthError(`Failed to logout!`, httpStatusCode)
        setIsAuthenticated(false)
        storedIsAuthenticated.destroy()
        storedMe.destroy()
        localStorage.removeItem('auth:me')
        const current = new URL(document.location.href)
        document.location.href = (
          logoutUrl ?? new URL(`${current.protocol}//${current.host}`)
        ).toString()
      }),
    login: async ({ email, password }) =>
      fetch(`${SERVER_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, password }),
      }).then(({ ok, status: httpStatusCode, headers }) => {
        setIsAuthenticated(ok)
        storedIsAuthenticated.set(ok)
        if (!ok) throw new AuthError(`Failed to log-in!`, httpStatusCode)
        const exp = headers.get('Expires')
        if (exp !== null) {
          setExpires(new Date(exp))
        }
      }),
    register: async ({ name, email, password }) =>
      fetch(`${SERVER_URL}/auth/register`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, password, name }),
      }).then(({ ok, status: httpStatusCode }) => {
        if (!ok) throw new AuthError(`Failed to register`, httpStatusCode)
      }),
    sendVerificationTokenByEmail: async ({ email }) =>
      fetch(`${SERVER_URL}/auth/password/token`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email }),
      }).then(({ ok, statusText, status: httpStatusCode }) => {
        if (!ok) throw new AuthError(statusText, httpStatusCode)
      }),
    setNewPasswordUsingTokenAndEmail: async ({ email, password, token }) =>
      fetch(`${SERVER_URL}/auth/password/new`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, newPassword: password, token }),
      }).then(({ ok, status: httpStatusCode }) => {
        if (!ok)
          throw new AuthError(`Setting a new password failed`, httpStatusCode)
      }),
    confirm: async ({ email, token }) =>
      fetch(`${SERVER_URL}/auth/register/confirm`, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({ email, token }),
      }).then(({ ok, status: httpStatusCode }) => {
        if (!ok)
          throw new AuthError(`Failed to confirm registration!`, httpStatusCode)
      }),
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
