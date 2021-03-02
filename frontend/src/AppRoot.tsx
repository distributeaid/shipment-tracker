import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import apolloClientInstance from './data/apolloClientInstance'
import ApolloDemoPage from './pages/ApolloDemo'
import HomePage from './pages/Home'
import PublicHomePage from './pages/PublicHome'
import GroupList from './pages/groups/GroupList'
import PrivateRoute from './components/PrivateRoute'

const AppRoot = () => {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    // TODO make this look a LOT better...
    return <div>Loading...</div>
  }

  return (
    <ApolloProvider client={apolloClientInstance}>
      <Router>
        <Switch>
          <Route path="/" exact>
            {isAuthenticated ? <HomePage /> : <PublicHomePage />}
          </Route>
          <Route path="/apollo-demo">
            <ApolloDemoPage />
          </Route>
          <PrivateRoute exact isAuthenticated={isAuthenticated} path="/groups">
            <GroupList />
          </PrivateRoute>
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

export default AppRoot
