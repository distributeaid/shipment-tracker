import { FunctionComponent, useState } from 'react'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'
import TextField from '../components/forms/TextField'
import { useAuth } from '../hooks/useAuth'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const PublicHomePage: FunctionComponent = () => {
  const { login } = useAuth()
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const loginFormValid =
    username.length > 0 &&
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
      password,
    )

  const registerFormValid = loginFormValid && password === password2

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
                label="username"
                type="text"
                name="username"
                value={username}
                onChange={({ target: { value } }) => setUsername(value)}
              />
              <TextField
                label="password"
                type="password"
                name="password"
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
              />
              <button
                className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() => login({ username, password })}
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
          {showRegisterForm && (
            <form>
              <TextField
                label="username"
                type="text"
                name="username"
                value={username}
                onChange={({ target: { value } }) => setUsername(value)}
              />
              <TextField
                label="password"
                type="password"
                name="password"
                minLength={8}
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
              />
              <TextField
                label="password (repeat)"
                type="password"
                name="password2"
                minLength={8}
                value={password2}
                onChange={({ target: { value } }) => setPassword2(value)}
              />
              <button
                className="bg-navy-800 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90"
                type="button"
                onClick={() => {
                  fetch(`${SERVER_URL}/register`, {
                    method: 'POST',
                    body: JSON.stringify({ username, password }),
                  })
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
        </div>
      </div>
    </main>
  )
}

export default PublicHomePage
