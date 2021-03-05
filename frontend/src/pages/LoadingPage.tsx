import { FunctionComponent } from 'react'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

const LoadingPage: FunctionComponent = () => {
  return (
    <>
      <PageHeader hideControls />
      <main className="max-w-5xl mx-auto min-h p-4 mt-8 min-h-half-screen text-center flex items-center justify-center">
        <h1 className="text-gray-700 text-xl flex items-center">
          <Spinner className="mr-3" />
          Loading your account data...
        </h1>
      </main>
    </>
  )
}

export default LoadingPage
