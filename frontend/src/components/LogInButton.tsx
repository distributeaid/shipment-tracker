import { useAuth0 } from '@auth0/auth0-react'
import { FunctionComponent } from 'react'

interface Props {
  className?: string
}

const LogInButton: FunctionComponent<Props> = ({ className }) => {
  const { loginWithRedirect } = useAuth0()

  return (
    <button className={className} type="button" onClick={loginWithRedirect}>
      Log in
    </button>
  )
}

export default LogInButton
