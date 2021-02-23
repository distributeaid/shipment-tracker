import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import HomePage from './pages/Home'

// Make things pretty
import './stylesheets/index.output.css'

const App = () => (
  <Router>
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
    </Switch>
  </Router>
)

export default App
