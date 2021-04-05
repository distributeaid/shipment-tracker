import { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import LayoutWithNav from '../../layouts/LayoutWithNav'

enum Species {
  Cat,
  Dog,
  Bird,
}

type Animal = {
  name: string
  age: number
  species: Species
  weight?: number
}

/**
 * Demo of how to use `react-hook-form` with our custom components
 */
const FormValidationDemo: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Animal>({ criteriaMode: 'all' })

  const onSubmit = handleSubmit((data) => {
    alert(`Submitting the following data:\n${JSON.stringify(data, null, 2)}`)
  })

  return (
    <LayoutWithNav>
      <main className="max-w-2xl bg-white mx-auto h-content p-4">
        <h1 className="text-3xl text-gray-800 mb-4">Form validation demo</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <TextField
            label="Name"
            type="text"
            name="name"
            register={register}
            registerOptions={{ required: true }}
            errors={errors}
          />

          <TextField
            label="Age"
            type="number"
            name="age"
            register={register}
            registerOptions={{
              required: true,
              min: 0,
            }}
            errors={errors}
          />

          <SelectField
            label="Species"
            name="species"
            required
            register={register}
            errors={errors}
            options={[
              { value: Species.Cat, label: 'Cat' },
              { value: Species.Dog, label: 'Dog' },
              { value: Species.Bird, label: 'Bird' },
            ]}
          />

          <TextField
            label="Weight (kg)"
            type="number"
            name="weight"
            register={register}
            registerOptions={{
              min: 1,
              max: 50,
            }}
            errors={errors}
          />

          <div className="mt-8">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </main>
    </LayoutWithNav>
  )
}

export default FormValidationDemo
