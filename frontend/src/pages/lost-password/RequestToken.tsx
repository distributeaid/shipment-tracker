import { FunctionComponent, useState } from 'react'
import DistributeAidWordmark from '../../components/branding/DistributeAidWordmark'
import FormNavigation from '../../components/forms/FormNavigation'
import TextField from '../../components/forms/TextField'
import InternalLink from '../../components/InternalLink'
import { emailRegEx, useAuth } from '../../hooks/useAuth'
import ROUTES from '../../utils/routes'

const RequestTokenPage: FunctionComponent = () => {
  const { sendVerificationTokenByEmail } = useAuth()
  const [email, setEmail] = useState('')

  const isFormValid = emailRegEx.test(email)

  return (
    <main className="flex h-screen justify-center bg-navy-900 p-4">
      <div className="max-w-md w-full mt-20">
        <div className="p-4 text-center">
          <DistributeAidWordmark className="block mx-auto mb-6" height="100" />
        </div>
        <div className="bg-white rounded p-6">
          <h1 className="text-2xl mb-4 text-center">Lost password</h1>
          <form>
            <TextField
              label="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
            />
            <button
              className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
              type="button"
              onClick={() => sendVerificationTokenByEmail({ email })}
              disabled={!isFormValid}
            >
              Recover password
            </button>
            <FormNavigation>
              <InternalLink to={ROUTES.HOME}>Login</InternalLink>
              <InternalLink to={ROUTES.SET_NEW_PASSWORD_USING_EMAIL_AND_TOKEN}>
                Set new password
              </InternalLink>
            </FormNavigation>
          </form>
        </div>
      </div>
    </main>
  )
}

export default RequestTokenPage
