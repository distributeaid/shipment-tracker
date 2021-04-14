import { useContext } from 'react'
import { UserProfileContext } from '../components/UserProfileContext'
import LayoutWithNav from '../layouts/LayoutWithNav'
import GroupLeaderHomePage from './home/GroupLeaderHomePage'

const HomePage = () => {
  const { profile } = useContext(UserProfileContext)

  const userIsGroupLeader = profile?.isAdmin === false

  return (
    <LayoutWithNav>
      <main className="flex flex-col items-center justify-center min-h-half-screen">
        <section className="bg-white p-4 md:p-8 lg:p-16 shadow rounded-lg">
          <h1 className="text-xl md:text-3xl text-gray-800 mb-8">
            Welcome to the Shipment Tracker! 📦
          </h1>
          {userIsGroupLeader && <GroupLeaderHomePage />}
        </section>
      </main>
    </LayoutWithNav>
  )
}

export default HomePage
