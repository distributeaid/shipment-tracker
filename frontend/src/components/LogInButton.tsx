import { FunctionComponent } from 'react'

interface Props {
  className?: string
}

const LogInButton: FunctionComponent<Props> = ({ className }) => {
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        // FIXME: Implement logout
        console.debug('Not implemented')
      }}
    >
      Log in
    </button>
  )
}

export default LogInButton
