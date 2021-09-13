import { FunctionComponent, useState } from 'react'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import FormNavigation from '../components/forms/FormNavigation'
import TextField from '../components/forms/TextField'
import InternalLink from '../components/InternalLink'
import { emailRegEx, passwordRegEx, useAuth } from '../hooks/useAuth'
import ROUTES from '../utils/routes'

const LoginPage: FunctionComponent = () => {
  const { login } = useAuth()
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
          <p className="mb-6">
            Welcome to Distribute Aid's shipment tracker! Please log in to
            continue.
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
            <TextField
              label="password"
              type="password"
              name="password"
              autoComplete="password"
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
            />
            <button
              className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
              type="button"
              onClick={() => login({ email, password })}
              disabled={!isFormValid}
            >
              Log in
            </button>
            <FormNavigation>
              <InternalLink to={ROUTES.REGISTER}>Register</InternalLink>
              <InternalLink to={ROUTES.SEND_VERIFICATION_TOKEN_BY_EMAIL}>
                Lost password
              </InternalLink>
            </FormNavigation>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
