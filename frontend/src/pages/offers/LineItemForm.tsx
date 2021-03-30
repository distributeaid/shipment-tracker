import { FunctionComponent } from 'react'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'

const DANGEROUS_GOODS = ['Flammable', 'Explosive'] as const

const LineItemForm: FunctionComponent = () => {
  return (
    <div>
      <TextField label="Description" name="description" />
      <SelectField label="Category" options={[]} />
      <fieldset>
        <legend>Dangerous goods</legend>
        {DANGEROUS_GOODS.map((good) => (
          <label
            key={good}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input type="checkbox" name={good} />
            <span>{good}</span>
          </label>
        ))}
      </fieldset>
      <TextField label="Amount" name="itemCount" type="number" />
    </div>
  )
}

export default LineItemForm
