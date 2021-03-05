import React from 'react'
import ReactDOM from 'react-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './AppRoot'
import './stylesheets/index.output.css'

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="distributeaid.eu.auth0.com"
      clientId="3wxYeItzvD1fN5tloBikUHED8sQ1BImj"
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
