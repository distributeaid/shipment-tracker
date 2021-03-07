import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import ApolloDemoPage from './pages/ApolloDemo'
import HomePage from './pages/Home'
import PublicHomePage from './pages/PublicHome'
import GroupList from './pages/groups/GroupList'
import PrivateRoute from './components/PrivateRoute'
import ApolloAuthProvider from './components/ApolloAuthProvider'
import LoadingPage from './pages/LoadingPage'
import NotFoundPage from './pages/NotFoundPage'

const fetchProfile = (token: string) => {
  return fetch('/profile', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const AppRoot = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const [profileIsLoaded, setProfileIsLoaded] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !profileIsLoaded) {
      getAccessTokenSilently()
        .then(fetchProfile)
        .then((response) => {
          if (response.ok) {
            setProfileIsLoaded(true)
          } else {
            console.error('Non-OK server response retrieving profile')
          }
        })
    }
  }, [isAuthenticated, getAccessTokenSilently, profileIsLoaded])

  return (
    <ApolloAuthProvider>
      <Router>
        <Switch>
          {isLoading && (
            <Route>
              <LoadingPage />
            </Route>
          )}
          <Route path="/" exact>
            {isAuthenticated ? <HomePage /> : <PublicHomePage />}
          </Route>
          <Route path="/apollo-demo">
            <ApolloDemoPage />
          </Route>
          <PrivateRoute exact isAuthenticated={isAuthenticated} path="/groups">
            <GroupList />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="*">
            <NotFoundPage />
          </PrivateRoute>
        </Switch>
      </Router>
    </ApolloAuthProvider>
  )
}

export default AppRoot
