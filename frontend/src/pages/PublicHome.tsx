import { FunctionComponent, useState } from 'react'
import { Redirect } from 'react-router-dom'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import TextField from '../components/forms/TextField'
import { emailRegEx, passwordRegEx, useAuth } from '../hooks/useAuth'

const PublicHomePage: FunctionComponent = () => {
  const { login, register, isRegistered } = useAuth()
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const loginFormValid = emailRegEx.test(email) && passwordRegEx.test(password)

  const registerFormValid =
    loginFormValid && password === password2 && name.trim().length > 0

  const showLoginForm = !showRegisterForm
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
          {showLoginForm && (
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
                disabled={!loginFormValid}
              >
                Log in
              </button>
              <button
                className="bg-gray-400 text-black text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() => setShowRegisterForm(true)}
              >
                Register
              </button>
            </form>
          )}
          {showRegisterForm && !isRegistered && (
            <form>
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
              <button
                className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() => {
                  register({ name, email, password })
                }}
                disabled={!registerFormValid}
              >
                Register
              </button>
              <button
                className="bg-gray-400 text-black text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() => setShowRegisterForm(false)}
              >
                Log in
              </button>
            </form>
          )}
          {isRegistered && (
            <Redirect
              to={{
                pathname: '/register/confirm',
                state: { email },
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default PublicHomePage
