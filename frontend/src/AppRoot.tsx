import { ApolloProvider } from '@apollo/client'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { apolloClient } from './apolloClient'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AdminUsers from './pages/admin/Users'
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

  const isLoggedIn = me !== undefined
  const isNotLoggedIn = !isLoggedIn

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Routes>
          {isNotLoggedIn && (
            <>
              <Route path={ROUTES.HOME} element={<LoginPage />} />
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
            </>
          )}
          {isLoggedIn && (
            <>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.ADMIN_ROOT} element={<AdminPage />} />
              <Route path={ROUTES.GROUP_LIST} element={<GroupList />} />
              <Route path={ROUTES.USERS} element={<AdminUsers />} />
              <Route path={ROUTES.GROUP_CREATE} element={<GroupCreatePage />} />
              <Route path={ROUTES.GROUP_EDIT} element={<GroupEditPage />} />
              <Route path={ROUTES.GROUP_VIEW} element={<GroupViewPage />} />
              <Route
                path={ROUTES.SHIPMENT_OFFER_CREATE}
                element={<CreateOfferPage />}
              />
              <Route
                path={ROUTES.SHIPMENT_OFFER_VIEW}
                element={<ViewOfferPage />}
              />
              <Route path={ROUTES.SHIPMENT_LIST} element={<ShipmentList />} />
              <Route
                path={ROUTES.SHIPMENT_CREATE}
                element={<ShipmentCreatePage />}
              />
              <Route
                path={ROUTES.SHIPMENT_EDIT}
                element={<ShipmentEditPage />}
              />
              <Route
                path={ROUTES.SHIPMENT.$}
                element={<ShipmentViewPage />}
              ></Route>
            </>
          )}
          {isDev && (
            <>
              <Route path={ROUTES.KITCHEN_SINK} element={<KitchenSink />} />
              <Route path={ROUTES.APOLLO_DEMO} element={<ApolloDemoPage />} />
            </>
          )}
          {/* Catch all in case route is not found */}
          {/* if logged in, show not found page, because the route probably does not exist */}
          {isLoggedIn && <Route path="*" element={<NotFoundPage />} />}
          {/* if not logged in, redirect to start page, which will show the login */}
          {isNotLoggedIn && (
            <Route
              path="*"
              element={
                <Navigate
                  to={{
                    pathname: '/',
                  }}
                />
              }
            />
          )}
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
