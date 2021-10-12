import React from 'react'
import ReactDOM from 'react-dom'
import App from './AppRoot'
import './stylesheets/index.css'

console.log('endpoint', process.env.REACT_APP_SERVER_URL)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
