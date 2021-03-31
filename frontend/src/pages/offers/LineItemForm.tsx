import _pick from 'lodash/pick'
import { FunctionComponent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import Spinner from '../../components/Spinner'
import { LINE_ITEM_CONTAINER_OPTIONS } from '../../data/constants'
import {
  LineItemUpdateInput,
  useLineItemQuery,
  useUpdateLineItemMutation,
} from '../../types/api-types'

interface Props {
  lineItemId: number
}

const LineItemForm: FunctionComponent<Props> = ({ lineItemId }) => {
  const { data, refetch, loading: lineItemIsLoading } = useLineItemQuery({
    variables: { id: lineItemId },
  })

  const { register, handleSubmit, reset } = useForm<LineItemUpdateInput>()

  useEffect(
    function fetchLineItem() {
      refetch({ id: lineItemId })
    },
    [lineItemId, refetch],
  )

  useEffect(
    function resetForm() {
      if (data?.lineItem) {
        reset(data.lineItem)
      }
    },
    [data?.lineItem, reset],
  )

  const [
    updateLineItem,
    { loading: mutationIsLoading },
  ] = useUpdateLineItemMutation()

  const submitForm = (input: LineItemUpdateInput) => {
    if (!data?.lineItem) {
      return
    }

    // Pick the fields from the LineItemUpdateInput
    let updatedLineItem = _pick(data.lineItem, [
      'status',
      'proposedReceivingGroupId',
      'acceptedReceivingGroupId',
      'containerType',
      'category',
      'description',
      'itemCount',
      'containerCount',
      'containerWeightGrams',
      'containerLengthCm',
      'containerWidthCm',
      'containerHeightCm',
      'affirmLiability',
      'tosAccepted',
      'dangerousGoods',
      'photoUris',
      'sendingHubDeliveryDate',
    ])

    // Merge the existing data with the updated fields
    updatedLineItem = Object.assign({}, updatedLineItem, input)

    updateLineItem({ variables: { id: lineItemId, input: updatedLineItem } })
  }

  // TODO build a read-only version of this form and toggle between the two

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {lineItemIsLoading && (
        <p>
          <Spinner /> loading...
        </p>
      )}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-gray-700 ">Contents</legend>
        <TextField label="Description" name="description" register={register} />
        <div className="md:flex md:space-x-4">
          <SelectField
            label="Container"
            name="containerType"
            options={LINE_ITEM_CONTAINER_OPTIONS}
            register={register}
          />
          <TextField
            label="Amount of items"
            name="itemCount"
            type="number"
            register={register}
          />
        </div>
        {/* TODO add a category dropdown after we create some enums */}
        {/* <SelectField label="Category" name="category" options={[]} /> */}
      </fieldset>
      <fieldset className="space-y-4 mt-12">
        <legend className="font-semibold text-gray-700 ">
          Dimensions and weight
        </legend>
        <div className="md:flex md:space-x-4">
          <TextField
            label="Width (cm)"
            name="containerWidthCm"
            type="number"
            min={1}
            register={register}
          />
          <TextField
            label="Length (cm)"
            name="containerLengthCm"
            type="number"
            min={1}
            register={register}
          />
          <TextField
            label="Height (cm)"
            name="containerHeightCm"
            type="number"
            min={1}
            register={register}
          />
        </div>
        <div className="md:flex md:space-x-4">
          <TextField
            label="Weight (grams)"
            name="containerWeightGrams"
            type="number"
            min={1}
            register={register}
          />
          <TextField
            label="Amount of containers"
            name="containerCount"
            type="number"
            min={1}
            register={register}
          />
        </div>
      </fieldset>
      <fieldset className="mt-12">
        <legend className="font-semibold text-gray-700 mb-4">
          Dangerous items
        </legend>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="dangerousItems.FLAMMABLE" />
          <span>Flammable</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="dangerousItems.EXPLOSIVE" />
          <span>Explosive</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="dangerousItems.MEDICINE" />
          <span>Medicine</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="dangerousItems.BATTERIES" />
          <span>Batteries</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="dangerousItems.LIQUIDS" />
          <span>Liquids</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" name="dangerousItems.OTHER" />
          <span>Other</span>
        </label>
      </fieldset>
      <div className="mt-8 text-right">
        <Button variant="primary" type="submit" disabled={mutationIsLoading}>
          Save changes
        </Button>
      </div>
    </form>
  )
}

export default LineItemForm
