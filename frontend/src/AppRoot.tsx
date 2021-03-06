import { useAuth0 } from '@auth0/auth0-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ApolloAuthProvider from './components/ApolloAuthProvider'
import PrivateRoute from './components/PrivateRoute'
import { UserProfileProvider } from './components/UserProfileContext'
import AdminPage from './pages/AdminPage'
import ApolloDemoPage from './pages/demo/ApolloDemo'
import GroupCreatePage from './pages/groups/GroupCreatePage'
import GroupEditPage from './pages/groups/GroupEditPage'
import GroupList from './pages/groups/GroupList'
import GroupViewPage from './pages/groups/GroupViewPage'
import HomePage from './pages/Home'
import KitchenSink from './pages/KitchenSink'
import LoadingPage from './pages/LoadingPage'
import NotFoundPage from './pages/NotFoundPage'
import CreateOfferPage from './pages/offers/CreateOfferPage'
import ViewOfferPage from './pages/offers/ViewOfferPage'
import PublicHomePage from './pages/PublicHome'
import ShipmentCreatePage from './pages/shipments/ShipmentCreatePage'
import ShipmentEditPage from './pages/shipments/ShipmentEditPage'
import ShipmentList from './pages/shipments/ShipmentList'
import ShipmentViewPage from './pages/shipments/ShipmentViewPage'
import ROUTES from './utils/routes'

const isDev = process.env.NODE_ENV === 'development'

const AppRoot = () => {
  const { isLoading, isAuthenticated } = useAuth0()

  return (
    <ApolloAuthProvider>
      <UserProfileProvider>
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
              {isAuthenticated ? <HomePage /> : <PublicHomePage />}
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
      </UserProfileProvider>
    </ApolloAuthProvider>
  )
}

export default AppRoot
