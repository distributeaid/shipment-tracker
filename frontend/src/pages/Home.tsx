import { useAuth } from '../hooks/useAuth'
import LayoutWithNav from '../layouts/LayoutWithNav'
import AdminHomePage from './home/AdminHomePage'
import GroupLeaderHomePage from './home/GroupLeaderHomePage'

const HomePage = () => {
  const { me: profile } = useAuth()

  const userIsGroupLeader = profile?.isAdmin === false
  const userIsAdmin = profile?.isAdmin

  return (
    <LayoutWithNav>
      <main className="max-w-5xl p-4 mx-auto">
        <section className="bg-white p-4 md:p-8 lg:p-16 shadow rounded-lg">
          <h1 className="text-xl md:text-3xl text-gray-800 mb-8">
            Welcome to the Shipment Tracker! 📦
          </h1>
          {userIsGroupLeader && <GroupLeaderHomePage />}
          {userIsAdmin && <AdminHomePage />}
        </section>
      </main>
    </LayoutWithNav>
  )
}

export default HomePage
