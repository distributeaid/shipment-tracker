import { useAuth0 } from '@auth0/auth0-react'

const LogOutButton = () => {
  const { logout } = useAuth0()

  return (
    <button
      className="text-white px-2 py-1"
      type="button"
      onClick={() => logout()}
    >
      Log out
    </button>
  )
}

export default LogOutButton
