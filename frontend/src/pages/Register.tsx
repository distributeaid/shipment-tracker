import { FunctionComponent, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Error from '../components/alert/Error'
import Button from '../components/Button'
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
  const [password2, setPassword2] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<AuthError>()
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const isFormValid =
    emailRegEx.test(email) &&
    passwordRegEx.test(password) &&
    password === password2 &&
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
          <div className="flex flex-row gap-x-6">
            <div className="flex-auto space-y-6 items-center">
              <TextField
                label="Pick a good password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
              />
              <TextField
                label="Repeat your password"
                type={showPassword ? 'text' : 'password'}
                name="password2"
                autoComplete="new-password"
                minLength={8}
                value={password2}
                onChange={({ target: { value } }) => setPassword2(value)}
              />
            </div>
            <div className="flex-none">
              <Button
                aria-label="show password"
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden={true}
                    className="h-8 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden={true}
                    className="h-8 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Button>
            </div>
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
          <Redirect
            to={{
              pathname: ROUTES.CONFIRM_EMAIL_WITH_TOKEN,
              state: { email },
            }}
          />
        )}
      </div>
    </PublicLayout>
  )
}

export default RegisterPage
