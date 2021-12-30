import { FunctionComponent } from 'react'
import { Navigate, Route, RouteProps } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * This component will redirect to the sign-in screen if the user isn't logged
 * in, or render the component otherwise.
 */
const PrivateRoute: FunctionComponent<RouteProps> = (props) => {
  const { me } = useAuth()

  if (me !== undefined)
    return (
      <Navigate
        to={{
          pathname: '/',
        }}
        state={{ redirectAfterAuth: props.path }}
      />
    )

  return <Route {...props} />
}

export default PrivateRoute
