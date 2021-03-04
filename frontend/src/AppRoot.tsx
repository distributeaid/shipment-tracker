import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import makeApolloClient from './data/apolloClientInstance'
import ApolloDemoPage from './pages/ApolloDemo'
import HomePage from './pages/Home'
import PublicHomePage from './pages/PublicHome'
import GroupList from './pages/groups/GroupList'
import PrivateRoute from './components/PrivateRoute'

const fetchProfile = (token: string) => {
  return fetch('/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const AppRoot = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const [profileIsLoading, setProfileIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then(fetchProfile)
        .then((response) => {
          if (response.ok) {
            setProfileIsLoading(false)
          } else {
            console.error('Non-OK server response retrieving profile')
          }
        })
    }
  }, [isAuthenticated, getAccessTokenSilently])

  if (isLoading) {
    // TODO make this look a LOT better...
    return <div>Loading...</div>
  }

  if (profileIsLoading) {
    return <PublicHomePage />
  }

  return (
    <ApolloProvider client={makeApolloClient(getAccessTokenSilently)}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
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
