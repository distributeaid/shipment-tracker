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
import AdminPage from './pages/AdminPage'
import GroupCreatePage from './pages/groups/GroupCreatePage'
import GroupPage from './pages/groups/GroupPage'

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
          <PrivateRoute path="/admin" isAuthenticated={isAuthenticated} exact>
            <AdminPage />
          </PrivateRoute>
          <Route path="/apollo-demo">
            <ApolloDemoPage />
          </Route>
          <PrivateRoute exact isAuthenticated={isAuthenticated} path="/groups">
            <GroupList />
          </PrivateRoute>
          <PrivateRoute
            exact
            isAuthenticated={isAuthenticated}
            path="/group/new"
          >
            <GroupCreatePage />
          </PrivateRoute>
          <PrivateRoute
            exact
            isAuthenticated={isAuthenticated}
            path="/group/:groupId"
          >
            <GroupPage />
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
