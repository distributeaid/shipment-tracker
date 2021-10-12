import { FunctionComponent } from 'react'
import DistributeAidWordmark from '../components/branding/DistributeAidWordmark'

/**
 * Application layout for logged-in users with a header at the top.
 */
const PublicLayout: FunctionComponent = ({ children }) => {
  return (
    <main className="flex h-screen justify-center bg-navy-900 p-4">
      <div className="max-w-md w-full mt-20">
        <div className="p-4 text-center">
          <DistributeAidWordmark className="block mx-auto mb-6" height="100" />
        </div>
        {children}
      </div>
    </main>
  )
}

export default PublicLayout
