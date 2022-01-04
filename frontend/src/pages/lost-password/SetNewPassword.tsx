import { FunctionComponent, useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import Error from '../../components/alert/Error'
import Success from '../../components/alert/Success'
import FormFooter from '../../components/forms/FormFooter'
import TextField from '../../components/forms/TextField'
import {
  AuthError,
  emailRegEx,
  passwordRegEx,
  tokenRegex,
  useAuth,
} from '../../hooks/useAuth'
import PublicLayout from '../../layouts/PublicLayout'
import ROUTES from '../../utils/routes'

const SetNewPasswordPage: FunctionComponent = () => {
  const { state } = useLocation() as { state?: { email?: string } }
  const { setNewPasswordUsingTokenAndEmail } = useAuth()
  const [email, setEmail] = useState(state?.email ?? '')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState<AuthError>()
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false)

  const isFormValid =
    emailRegEx.test(email) &&
    passwordRegEx.test(password) &&
    password === password2 &&
    tokenRegex.test(token)

  return (
    <PublicLayout>
      <div className="bg-white rounded p-6">
        <h1 className="text-2xl mb-4 text-center">Register</h1>
        {state?.email !== undefined && (
          <Success>
            <p>Verfication code sent successfully.</p>
            <p>
              Please check your inbox for <code>{state?.email}</code>!
            </p>
          </Success>
        )}
        <p className="mt-4 mb-6">
          In order to set a new password, please provide the token from the
          email you should have received and a new password.
        </p>
        <form className="space-y-6 mb-6">
          <TextField
            label="Your email"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
          <TextField
            label="Your verification token"
            type="text"
            name="token"
            autoComplete="off"
            value={token}
            pattern="^[0-9]{6}"
            onChange={({ target: { value } }) => setToken(value)}
          />
          <TextField
            label="Pick a good password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
          <TextField
            label="Repeat your password"
            type="password"
            name="password2"
            autoComplete="new-password"
            minLength={8}
            value={password2}
            onChange={({ target: { value } }) => setPassword2(value)}
          />
          <FormFooter>
            <button
              className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
              type="button"
              onClick={() => {
                setError(undefined)
                setNewPasswordUsingTokenAndEmail({
                  email,
                  password,
                  token,
                })
                  .then(() => setPasswordChanged(true))
                  .catch(setError)
              }}
              disabled={!isFormValid}
            >
              Set new password
            </button>
            {error !== undefined && (
              <Error className="mt-2">
                Sorry, setting a new password failed: {error.message}
              </Error>
            )}
          </FormFooter>
        </form>
        {passwordChanged && (
          <Navigate
            to={{
              pathname: ROUTES.HOME,
            }}
            state={{ password_change_success: true, email }}
          />
        )}
      </div>
    </PublicLayout>
  )
}

export default SetNewPasswordPage
