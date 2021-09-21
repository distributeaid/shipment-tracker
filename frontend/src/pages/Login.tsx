import { FunctionComponent, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Error from '../components/alert/Error'
import Success from '../components/alert/Success'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import FormFooter from '../components/forms/FormFooter'
import TextField from '../components/forms/TextField'
import InternalLink from '../components/InternalLink'
import { AuthError, emailRegEx, passwordRegEx, useAuth } from '../hooks/useAuth'
import ROUTES from '../utils/routes'

const LoginPage: FunctionComponent = () => {
  const { state } = useLocation<{ email_confirmation_success?: boolean }>()
  const { login, isLoading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isFormValid = emailRegEx.test(email) && passwordRegEx.test(password)

  return (
    <main className="flex h-screen justify-center bg-navy-900 p-4">
      <div className="max-w-md w-full mt-20">
        <div className="p-4 text-center">
          <DistributeAidWordmark className="block mx-auto mb-6" height="100" />
        </div>
        <div className="bg-white rounded p-6">
          <h1 className="text-2xl mb-4 text-center">Shipment Tracker</h1>
          {state?.email_confirmation_success && (
            <Success className="mb-2">
              <p>Email confirmation successfull.</p>
              <p>You can now log in!</p>
            </Success>
          )}
          <p>
            Welcome to Distribute Aid's shipment tracker! Please log in to
            continue.
          </p>
          <p className="mt-2">
            If you don't have an account, you can{' '}
            <InternalLink to={ROUTES.REGISTER}>register here</InternalLink>.
          </p>
          <form className="mt-4">
            <TextField
              label="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
              disabled={isLoading}
            />
            <TextField
              label="password"
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
              <button
                className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() => login({ email, password })}
                disabled={!isFormValid || isLoading}
              >
                Log in
              </button>
              {authError?.type === AuthError.LOGIN_FAILED && (
                <Error className="mt-2">Sorry, could not log you in.</Error>
              )}
            </FormFooter>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
