import { FunctionComponent, InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

const CheckboxField: FunctionComponent<Props> = ({ label, ...otherProps }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" {...otherProps} />
      <span>{label}</span>
    </label>
  )
}

export default CheckboxField
