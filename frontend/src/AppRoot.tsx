import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { apolloClient } from './apolloClient'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AdminPage from './pages/AdminPage'
import ConfirmEmailWithTokenPage from './pages/ConfirmEmailWithTokenPage'
import ApolloDemoPage from './pages/demo/ApolloDemo'
import GroupCreatePage from './pages/groups/GroupCreatePage'
import GroupEditPage from './pages/groups/GroupEditPage'
import GroupList from './pages/groups/GroupList'
import GroupViewPage from './pages/groups/GroupViewPage'
import HomePage from './pages/Home'
import KitchenSink from './pages/KitchenSink'
import LoadingPage from './pages/LoadingPage'
import LoginPage from './pages/Login'
import RequestTokenPage from './pages/lost-password/RequestToken'
import SetNewPasswordPage from './pages/lost-password/SetNewPassword'
import NotFoundPage from './pages/NotFoundPage'
import CreateOfferPage from './pages/offers/CreateOfferPage'
import ViewOfferPage from './pages/offers/ViewOfferPage'
import RegisterPage from './pages/Register'
import ShipmentCreatePage from './pages/shipments/ShipmentCreatePage'
import ShipmentEditPage from './pages/shipments/ShipmentEditPage'
import ShipmentList from './pages/shipments/ShipmentList'
import ShipmentViewPage from './pages/shipments/ShipmentViewPage'
import ROUTES from './utils/routes'

const isDev = process.env.NODE_ENV === 'development'

const App = () => {
  const { isLoading, isAuthenticated } = useAuth()

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Switch>
          {isDev && (
            <Route path={ROUTES.KITCHEN_SINK}>
              <KitchenSink />
            </Route>
          )}
          {isLoading && (
            <Route>
              <LoadingPage />
            </Route>
          )}
          <Route path={ROUTES.HOME} exact>
            {isAuthenticated ? <HomePage /> : <LoginPage />}
          </Route>
          {!isAuthenticated && (
            <>
              <Route path={ROUTES.REGISTER} exact>
                <RegisterPage />
              </Route>
              <Route path={ROUTES.SEND_VERIFICATION_TOKEN_BY_EMAIL} exact>
                <RequestTokenPage />
              </Route>
              <Route path={ROUTES.SET_NEW_PASSWORD_USING_EMAIL_AND_TOKEN} exact>
                <SetNewPasswordPage />
              </Route>
            </>
          )}
          <Route path={ROUTES.CONFIRM_EMAIL_WITH_TOKEN} exact>
            <ConfirmEmailWithTokenPage />
          </Route>
          <PrivateRoute path={ROUTES.ADMIN_ROOT} exact>
            <AdminPage />
          </PrivateRoute>
          <Route path={ROUTES.APOLLO_DEMO}>
            <ApolloDemoPage />
          </Route>
          <PrivateRoute path={ROUTES.GROUP_LIST}>
            <GroupList />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.GROUP_CREATE}>
            <GroupCreatePage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.GROUP_EDIT}>
            <GroupEditPage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.GROUP_VIEW}>
            <GroupViewPage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.SHIPMENT_OFFER_CREATE}>
            <CreateOfferPage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.SHIPMENT_OFFER_VIEW}>
            <ViewOfferPage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.SHIPMENT_LIST}>
            <ShipmentList />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.SHIPMENT_CREATE}>
            <ShipmentCreatePage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.SHIPMENT_EDIT}>
            <ShipmentEditPage />
          </PrivateRoute>
          <PrivateRoute path={ROUTES.SHIPMENT_VIEW}>
            <ShipmentViewPage />
          </PrivateRoute>
          <PrivateRoute path="*">
            <NotFoundPage />
          </PrivateRoute>
        </Switch>
      </Router>
    </ApolloProvider>
  )
}

const AppRoot = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppRoot
