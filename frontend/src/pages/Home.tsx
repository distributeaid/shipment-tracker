import { Link } from 'react-router-dom'
import LayoutWithNav from '../layouts/LayoutWithNav'

const HomePage = () => (
  <LayoutWithNav headerTitle="Home">
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl text-gray-800">
        Welcome to the Shipment Tracker! 📦👀
      </h1>
      <p className="mt-6 text-lg text-gray-700">
        This app is built with React, Typescript, and Tailwind.
      </p>
      <p className="mt-6 text-lg text-gray-700">
        View a demo of{' '}
        <Link className="text-blue-700 hover:underline" to="/apollo-demo">
          using Apollo and GraphQL
        </Link>
      </p>
    </main>
  </LayoutWithNav>
)

export default HomePage
