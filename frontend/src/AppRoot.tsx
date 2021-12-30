import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
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
  const { me } = useAuth()

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Routes>
          {isDev && (
            <Route path={ROUTES.KITCHEN_SINK} element={<KitchenSink />} />
          )}
          <Route
            path={ROUTES.HOME}
            element={me !== undefined ? <HomePage /> : <LoginPage />}
          />
          {me === undefined && (
            <Routes>
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route
                path={ROUTES.SEND_VERIFICATION_TOKEN_BY_EMAIL}
                element={<RequestTokenPage />}
              />
              <Route
                path={ROUTES.SET_NEW_PASSWORD_USING_EMAIL_AND_TOKEN}
                element={<SetNewPasswordPage />}
              />
              <Route
                path={ROUTES.CONFIRM_EMAIL_WITH_TOKEN}
                element={<ConfirmEmailWithTokenPage />}
              />
            </Routes>
          )}
          <PrivateRoute path={ROUTES.ADMIN_ROOT} element={<AdminPage />} />
          <Route path={ROUTES.APOLLO_DEMO} element={<ApolloDemoPage />} />
          <PrivateRoute path={ROUTES.GROUP_LIST} element={<GroupList />} />
          <PrivateRoute
            path={ROUTES.GROUP_CREATE}
            element={<GroupCreatePage />}
          />
          <PrivateRoute path={ROUTES.GROUP_EDIT} element={<GroupEditPage />} />
          <PrivateRoute path={ROUTES.GROUP_VIEW} element={<GroupViewPage />} />
          <PrivateRoute
            path={ROUTES.SHIPMENT_OFFER_CREATE}
            element={<CreateOfferPage />}
          />
          <PrivateRoute
            path={ROUTES.SHIPMENT_OFFER_VIEW}
            element={<ViewOfferPage />}
          />
          <PrivateRoute
            path={ROUTES.SHIPMENT_LIST}
            element={<ShipmentList />}
          />
          <PrivateRoute
            path={ROUTES.SHIPMENT_CREATE}
            element={<ShipmentCreatePage />}
          />
          <PrivateRoute
            path={ROUTES.SHIPMENT_EDIT}
            element={<ShipmentEditPage />}
          />
          <PrivateRoute
            path={ROUTES.SHIPMENT_VIEW}
            element={<ShipmentViewPage />}
          />
          <PrivateRoute path="*" element={<NotFoundPage />} />
        </Routes>
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
