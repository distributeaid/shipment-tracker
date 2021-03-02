import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import apolloClientInstance from './data/apolloClientInstance'
import ApolloDemoPage from './pages/ApolloDemo'
import HomePage from './pages/Home'

// Make things pretty
import './stylesheets/index.output.css'
import GroupList from './pages/groups/GroupList'

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
        <Route path="/groups">
          <GroupList />
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>
)

export default App
