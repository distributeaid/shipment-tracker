import { FunctionComponent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Error from '../components/alert/Error'
import Success from '../components/alert/Success'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import { DisableableButton } from '../components/forms/DisableableButton'
import FormFooter from '../components/forms/FormFooter'
import TextField from '../components/forms/TextField'
import { AuthError, emailRegEx, tokenRegex, useAuth } from '../hooks/useAuth'
import ROUTES from '../utils/routes'

const ConfirmEmailWithTokenPage: FunctionComponent = () => {
  const { state } = useLocation()
  const { email: passedEmail } = (state ?? {}) as { email?: string }
  const { confirm } = useAuth()
  const [email, setEmail] = useState(passedEmail ?? '')
  const [token, setToken] = useState('')
  const [error, setError] = useState<AuthError>()
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  const formValid = emailRegEx.test(email) && tokenRegex.test(token)

  return (
    <main className="flex h-screen justify-center bg-navy-900 p-4">
      <div className="max-w-md w-full mt-20">
        <div className="p-4 text-center">
          <DistributeAidWordmark className="block mx-auto mb-6" height="100" />
        </div>
        <div className="bg-white rounded p-6">
          <h1 className="text-2xl mb-4 text-center">Shipment Tracker</h1>
          {passedEmail !== undefined && (
            <Success>
              <p>Registration successful.</p>
              <p>
                Please check your inbox for <code>{passedEmail}</code>!
              </p>
            </Success>
          )}
          <p className="mt-4">
            In order to complete your registration, please provide the token you
            have received by email.
          </p>
          <p className="mt-4">
            In case you do not receive the token, double-check that your email
            address is spelled correctly. If not, register again with your
            correct email address.
          </p>
          <p className="mt-4">Also check your SPAM folder.</p>
          <p className="mt-4 mb-6">
            If you still dont't have the token, ask a Shipment Tracker
            administrator to activate your account, or if you don't know one,
            reach out to{' '}
            <a href="mailto:tools@distributeaid.org">
              <code>tools@distributeaid.org</code>
            </a>{' '}
            so we can activate your account for you.
          </p>
          <form>
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
              value={token}
              autoComplete="off"
              pattern="^[0-9]{6}"
              onChange={({ target: { value } }) => setToken(value)}
            />
            <FormFooter>
              <DisableableButton
                onClick={() => {
                  confirm({ email, token })
                    .then(() => {
                      setIsConfirmed(true)
                    })
                    .catch(setError)
                }}
                disabled={!formValid}
              >
                Verify
              </DisableableButton>
              {error !== undefined && (
                <Error className="mt-2">
                  Sorry, verification failed: {error.message}
                </Error>
              )}
            </FormFooter>
          </form>
          {isConfirmed && (
            <Navigate
              to={{
                pathname: ROUTES.HOME,
              }}
              state={{ email_confirmation_success: true, email }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default ConfirmEmailWithTokenPage
