import { FunctionComponent } from 'react'
import CheckboxField from '../../components/forms/CheckboxField'

interface Props {
  timeTcChecked: Date | null
  handleTcChange: () => void
  setShowTermsAndCond: (tc: boolean) => void
}

const TermsAndCondCheckbox: FunctionComponent<Props> = ({
  timeTcChecked,
  handleTcChange,
  setShowTermsAndCond,
}) => {
  return (
    <div className="flex flex-row">
      <CheckboxField
        label=""
        checked={timeTcChecked === null ? false : true}
        onChange={handleTcChange}
        className="cursor-pointer"
      />
      <a
        className="cursor-pointer text-blue-500"
        onClick={() => setShowTermsAndCond(true)}
      >
        I accept terms and conditions
      </a>
    </div>
  )
}

export default TermsAndCondCheckbox
