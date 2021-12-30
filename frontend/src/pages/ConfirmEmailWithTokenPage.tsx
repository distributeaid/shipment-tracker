import { FunctionComponent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Error from '../components/alert/Error'
import Success from '../components/alert/Success'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
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
          <p className="mt-4 mb-6">
            In order to complete your registration, please provide the token you
            have received by email.
          </p>
          <form>
            <TextField
              label="Your email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
            <TextField
              label="Your verification token"
              type="text"
              name="token"
              value={token}
              pattern="^[0-9]{6}"
              onChange={({ target: { value } }) => setToken(value)}
            />
            <FormFooter>
              <button
                className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
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
              </button>
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
