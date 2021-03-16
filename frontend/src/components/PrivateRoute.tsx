import { useAuth0 } from '@auth0/auth0-react'
import { FunctionComponent } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

/**
 * This component will redirect to the sign-in screen if the user isn't logged
 * in, or render the component otherwise.
 */
const PrivateRoute: FunctionComponent<RouteProps> = (props) => {
  const { isAuthenticated } = useAuth0()
  const { children, ...rest } = props

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { redirectAfterAuth: location },
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
