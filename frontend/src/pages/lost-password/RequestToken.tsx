import { FunctionComponent, useState } from 'react'
import { Navigate } from 'react-router'
import Error from '../../components/alert/Error'
import FormFooter from '../../components/forms/FormFooter'
import TextField from '../../components/forms/TextField'
import InternalLink from '../../components/InternalLink'
import { AuthError, emailRegEx, useAuth } from '../../hooks/useAuth'
import PublicLayout from '../../layouts/PublicLayout'
import ROUTES from '../../utils/routes'

const RequestTokenPage: FunctionComponent = () => {
  const { sendVerificationTokenByEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<AuthError>()
  const [emailSent, setEmailSent] = useState<boolean>(false)

  const isFormValid = emailRegEx.test(email)

  return (
    <PublicLayout>
      <div className="bg-white rounded p-6">
        <h1 className="text-2xl mb-4 text-center">Reset your password</h1>
        <p className="mb-2">
          In order to reset your password, we need to verify your email first.
        </p>
        <form className="space-y-6">
          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
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
            <InternalLink className="block text-center" to={ROUTES.HOME}>
              Back to Login
            </InternalLink>
          </FormFooter>
        </form>
        {emailSent && (
          <Navigate
            to={{
              pathname: ROUTES.SET_NEW_PASSWORD_USING_EMAIL_AND_TOKEN,
            }}
            state={{ email }}
          />
        )}
      </div>
    </PublicLayout>
  )
}

export default RequestTokenPage
