import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './AppRoot'
import './stylesheets/index.output.css'

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="distributeaid.eu.auth0.com"
      clientId="hfNo3Nw2ZrAGv0Vwh7tjU4nJ7lAuPTNH"
      redirectUri={window.location.origin}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
