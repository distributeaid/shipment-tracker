import { FunctionComponent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import LayoutWithNav from '../layouts/LayoutWithNav'

/**
 * A 404 page for logged-in users
 */
const NotFoundPage: FunctionComponent<RouteComponentProps> = (props) => (
  <LayoutWithNav>
    <main className="flex flex-col items-center justify-center min-h-half-screen p-4">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl mb-6">Page not found</h1>
        <p className="mb-4">
          The page you were looking for doesn't exist. It's possible that the
          URL changed or that the page was deleted. If you believe this is an
          error, please contact the DA team.
        </p>
        <p>
          <button
            className="text-da-navy-100 font-semibold"
            onClick={props.history.goBack}
          >
            Go back
          </button>
        </p>
      </div>
    </main>
  </LayoutWithNav>
)

export default withRouter(NotFoundPage)
