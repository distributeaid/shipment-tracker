import { FunctionComponent, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Error from '../components/alert/Error'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import FormFooter from '../components/forms/FormFooter'
import TextField from '../components/forms/TextField'
import InternalLink from '../components/InternalLink'
import { AuthError, emailRegEx, passwordRegEx, useAuth } from '../hooks/useAuth'
import ROUTES from '../utils/routes'

const RegisterPage: FunctionComponent = () => {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState<AuthError>()
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const isFormValid =
    emailRegEx.test(email) &&
    passwordRegEx.test(password) &&
    password === password2 &&
    name.trim().length > 0

  return (
    <main className="flex h-screen justify-center bg-navy-900 p-4">
      <div className="max-w-md w-full mt-20">
        <div className="p-4 text-center">
          <DistributeAidWordmark className="block mx-auto mb-6" height="100" />
        </div>
        <div className="bg-white rounded p-6">
          <h1 className="text-2xl mb-4 text-center">Register</h1>
          <p>Please provide your details in order to register a new account.</p>
          <p className="mt-2">
            If you already have an account, you can{' '}
            <InternalLink to={ROUTES.HOME}>log in here</InternalLink>.
          </p>
          <form className="mt-4">
            <TextField
              label="Your name"
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
            />
            <TextField
              label="Your email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
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
                  register({
                    name,
                    email,
                    password,
                  })
                    .then(() => setIsRegistered(true))
                    .catch(setError)
                }}
                disabled={!isFormValid}
              >
                Register
              </button>
              {error !== undefined && (
                <Error className="mt-2">
                  Sorry, registration failed: {error.message}.
                </Error>
              )}
            </FormFooter>
          </form>

          {isRegistered && (
            <Redirect
              to={{
                pathname: ROUTES.CONFIRM_EMAIL_WITH_TOKEN,
                state: { email },
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
