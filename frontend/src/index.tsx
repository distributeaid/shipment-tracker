import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import App from './AppRoot'
import './stylesheets/index.css'

console.log('endpoint', process.env.REACT_APP_SERVER_URL)

const container = document.getElementById('root')

if (container !== null) {
  const root = ReactDOMClient.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
