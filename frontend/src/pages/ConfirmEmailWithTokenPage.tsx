import { FunctionComponent, useState } from 'react'
import { Redirect } from 'react-router-dom'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import TextField from '../components/forms/TextField'
import { emailRegEx, tokenRegex, useAuth } from '../hooks/useAuth'
import { useFriendlyCaptcha } from '../hooks/useFriendlyCaptcha'

const ConfirmEmailWithTokenPage: FunctionComponent = () => {
  const { confirm, isConfirmed } = useAuth()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const { element: CAPTCHA, solution: captchaSolution } = useFriendlyCaptcha()

  const formValid =
    emailRegEx.test(email) &&
    tokenRegex.test(token) &&
    captchaSolution !== undefined

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
            <button
              className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
              type="button"
              onClick={() => {
                confirm({ email, token, captcha: captchaSolution as string })
              }}
              disabled={!formValid}
            >
              Verify
            </button>
            {CAPTCHA}
          </form>
          {isConfirmed && (
            <Redirect
              to={{
                pathname: '/',
                state: { email },
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default ConfirmEmailWithTokenPage
