import { FunctionComponent } from 'react'
import CloseIcon from './alert/CloseIcon'

interface Props {
  close: () => void
}

const TermsAndConditions: FunctionComponent<Props> = ({ close }) => {
  return (
    <div className="bg-gray-300 inset-1/4 fixed text-justify rounded-md">
      <div className="absolute top-0 right-0">
        <CloseIcon
          color="text-black"
          onClick={() => {
            close()
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-center text-2xl">Terms & Conditions</h3>
        Placeholder text for terms and conitions
      </div>
    </div>
  )
}

export default TermsAndConditions
