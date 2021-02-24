import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import ApolloDemoPage from './pages/ApolloDemo'
import HomePage from './pages/Home'

// Make things pretty
import './stylesheets/index.output.css'
import apolloClientInstance from './data/apolloClientInstance'

const App = () => (
  <ApolloProvider client={apolloClientInstance}>
    <Router>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/apollo-demo">
          <ApolloDemoPage />
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>
)

export default App
