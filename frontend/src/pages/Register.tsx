import { FunctionComponent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Error from '../components/alert/Error'
import CheckboxField from '../components/forms/CheckboxField'
import FormFooter from '../components/forms/FormFooter'
import TextField from '../components/forms/TextField'
import InternalLink from '../components/InternalLink'
import { AuthError, emailRegEx, passwordRegEx, useAuth } from '../hooks/useAuth'
import PublicLayout from '../layouts/PublicLayout'
import ROUTES from '../utils/routes'

const RegisterPage: FunctionComponent = () => {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<AuthError>()
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const isFormValid =
    emailRegEx.test(email) &&
    passwordRegEx.test(password) &&
    name.trim().length > 0

  return (
    <PublicLayout>
      <div className="bg-white rounded p-6">
        <h1 className="text-2xl mb-4 text-center">Register</h1>
        <p>Please provide your details in order to register a new account.</p>
        <p className="mt-2">
          If you already have an account, you can{' '}
          <InternalLink to={ROUTES.HOME}>log in here</InternalLink>.
        </p>
        <form className="mt-4 space-y-6">
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
          <div>
            <TextField
              label="Pick a good password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
            />
            <CheckboxField
              containerClassName="mt-2"
              label="Reveal password"
              onChange={() => setShowPassword((prev) => !prev)}
            />
          </div>
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
          <Navigate
            to={{
              pathname: ROUTES.CONFIRM_EMAIL_WITH_TOKEN,
            }}
            state={{ email }}
          />
        )}
      </div>
    </PublicLayout>
  )
}

export default RegisterPage
