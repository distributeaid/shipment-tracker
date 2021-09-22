import { FunctionComponent, useState } from 'react'
import { Redirect } from 'react-router'
import Error from '../../components/alert/Error'
import DistributeAidWordmark from '../../components/branding/DistributeAidWordmark'
import FormFooter from '../../components/forms/FormFooter'
import TextField from '../../components/forms/TextField'
import { AuthError, emailRegEx, useAuth } from '../../hooks/useAuth'
import ROUTES from '../../utils/routes'

const RequestTokenPage: FunctionComponent = () => {
  const { sendVerificationTokenByEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<AuthError>()
  const [emailSent, setEmailSent] = useState<boolean>(false)

  const isFormValid = emailRegEx.test(email)

  return (
    <main className="flex h-screen justify-center bg-navy-900 p-4">
      <div className="max-w-md w-full mt-20">
        <div className="p-4 text-center">
          <DistributeAidWordmark className="block mx-auto mb-6" height="100" />
        </div>
        <div className="bg-white rounded p-6">
          <h1 className="text-2xl mb-4 text-center">Reset your password</h1>
          <p className="mb-2">
            In order to reset your password, we need to verify your email first.
          </p>
          <form>
            <TextField
              label="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
            <FormFooter>
              <button
                className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() =>
                  sendVerificationTokenByEmail({ email })
                    .then(() => setEmailSent(true))
                    .catch(setError)
                }
                disabled={!isFormValid}
              >
                Recover password
              </button>
              {error !== undefined && (
                <Error className="mt-2">Oops: {error.message}</Error>
              )}
            </FormFooter>
          </form>
          {emailSent && (
            <Redirect
              to={{
                pathname: ROUTES.SET_NEW_PASSWORD_USING_EMAIL_AND_TOKEN,
                state: { email },
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default RequestTokenPage
