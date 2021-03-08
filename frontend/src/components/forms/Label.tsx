import { FunctionComponent, LabelHTMLAttributes } from 'react'

const Label: FunctionComponent<LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  ...otherProps
}) => {
  return (
    <label className="block text-gray-500 text-sm mb-2" {...otherProps}>
      {children}
    </label>
  )
}

export default Label
