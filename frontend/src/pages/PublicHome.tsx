import { FunctionComponent } from 'react'
import DistributeAidLogo from '../components/DistributeAidLogo'
import LogInButton from '../components/LogInButton'

const PublicHomePage: FunctionComponent = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-da-navy-100 p-4">
      <div className="max-w-md w-full pb-20">
        <div className="p-4 text-center">
          <DistributeAidLogo className="block mx-auto" />
        </div>
        <div className="bg-white rounded p-6">
          <h1 className="text-2xl mb-4 text-center">Shipment Tracker</h1>
          <p className="mb-6">
            Welcome to Distribute Aid's shipment tracker! Please log in to
            continue.
          </p>
          <LogInButton className="bg-da-navy-100 text-white text-lg px-4 py-2 rounded-sm w-full hover:bg-opacity-90" />
        </div>
      </div>
    </main>
  )
}

export default PublicHomePage
