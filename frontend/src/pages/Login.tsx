import { FunctionComponent, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Error from '../components/alert/Error'
import Success from '../components/alert/Success'
import { DisableableButton } from '../components/forms/DisableableButton'
import FormFooter from '../components/forms/FormFooter'
import TextField from '../components/forms/TextField'
import InternalLink from '../components/InternalLink'
import { AuthError, emailRegEx, passwordRegEx, useAuth } from '../hooks/useAuth'
import PublicLayout from '../layouts/PublicLayout'
import ROUTES from '../utils/routes'

const LoginPage: FunctionComponent = () => {
  const { state } = useLocation() as {
    state?: {
      email_confirmation_success?: boolean
      password_change_success?: boolean
      email?: string
    }
  }

  const { login } = useAuth()
  const [email, setEmail] = useState(state?.email ?? '')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<AuthError>()

  const isFormValid = emailRegEx.test(email) && passwordRegEx.test(password)

  return (
    <PublicLayout>
      <div className="bg-white rounded p-6">
        <h1 className="text-2xl mb-4 text-center">Shipment Tracker</h1>
        {state?.email_confirmation_success && (
          <Success className="mb-2">
            <p>Email confirmation successful.</p>
            <p>You can now log in!</p>
          </Success>
        )}
        {state?.password_change_success && (
          <Success className="mb-2">
            <p>Password changed successfully.</p>
            <p>You can now log in!</p>
          </Success>
        )}
        {new URLSearchParams(document.location.search).get('cookieExpired') ===
          'true' && (
          <Error className="mb-2">
            You have been automatically logged out because of inactivity.
          </Error>
        )}
        <p>
          Welcome to Distribute Aid's shipment tracker! Please log in to
          continue.
        </p>
        <p className="mt-2">
          If you don't have an account, you can{' '}
          <InternalLink to={ROUTES.REGISTER}>register here</InternalLink>.
        </p>
        <form className="mt-4 space-y-6">
          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            disabled={isLoading}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            autoComplete="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            disabled={isLoading}
          />
          <p>
            Lost your password?{' '}
            <InternalLink to={ROUTES.SEND_VERIFICATION_TOKEN_BY_EMAIL}>
              Reset it here.
            </InternalLink>
          </p>
          <FormFooter>
            <DisableableButton
              disabled={!isFormValid || isLoading}
              onClick={() => {
                setIsLoading(true)
                setError(undefined)
                login({ email, password })
                  .catch((error) => {
                    setError(error)
                  })
                  .finally(() => setIsLoading(false))
              }}
            >
              Log in
            </DisableableButton>
            {error !== undefined && (
              <Error className="mt-2">
                Sorry, could not log you in: {error.message}
              </Error>
            )}
          </FormFooter>
        </form>
      </div>
    </PublicLayout>
  )
}

export default LoginPage
