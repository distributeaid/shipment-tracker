import _pick from 'lodash/pick'
import { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import Spinner from '../../components/Spinner'
import {
  DANGEROUS_GOODS_LIST,
  LINE_ITEM_CONTAINER_OPTIONS,
} from '../../data/constants'
import {
  DangerousGoods,
  LineItemUpdateInput,
  useLineItemQuery,
  useUpdateLineItemMutation,
} from '../../types/api-types'

interface Props {
  /**
   * The ID of the line item to display
   */
  lineItemId: number
  /**
   * Callback triggered when the user has finished editing the line item. The
   * parent component should handle this side effect.
   */
  onEditingComplete: () => void
}

const LineItemForm: FunctionComponent<Props> = ({
  lineItemId,
  onEditingComplete,
}) => {
  const { data, refetch, loading: lineItemIsLoading } = useLineItemQuery({
    variables: { id: lineItemId },
  })

  const [dangerousGoodsList, setDangerousGoodsList] = useState<
    DangerousGoods[]
  >([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LineItemUpdateInput>()

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
        setDangerousGoodsList(data.lineItem.dangerousGoods)
      }
    },
    [data?.lineItem, reset],
  )

  const [
    updateLineItem,
    { loading: mutationIsLoading },
  ] = useUpdateLineItemMutation()

  const submitForm = handleSubmit((input) => {
    if (!data?.lineItem) {
      return
    }

    // Override the list of dangerous goods because it's not controlled by
    // react-hook-form
    input.dangerousGoods = dangerousGoodsList

    // We need to all the fields from LineItemUpdateInput, even the ones that
    // didn't change. We then _pick the fields to make sure we don't send things
    // like `id` or `__typename`
    const updatedLineItem = _pick(Object.assign({}, data.lineItem, input), [
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

    updateLineItem({
      variables: { id: lineItemId, input: updatedLineItem },
    }).then(() => {
      onEditingComplete()
    })
  })

  const toggleDangerousGood = (value: DangerousGoods) => {
    if (dangerousGoodsList.includes(value)) {
      setDangerousGoodsList(dangerousGoodsList.filter((g) => g !== value))
    } else {
      setDangerousGoodsList([...dangerousGoodsList, value])
    }
  }

  return (
    <form onSubmit={submitForm}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 text-lg flex items-center">
          Line Item {lineItemIsLoading && <Spinner className="ml-2" />}
        </h2>
        <div className="space-x-4">
          <Button onClick={onEditingComplete}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={mutationIsLoading}>
            Save changes
          </Button>
        </div>
      </div>
      <fieldset className="space-y-4">
        <legend className="font-semibold text-gray-700 ">Contents</legend>
        <TextField
          label="Description"
          name="description"
          required
          minLength={5}
          register={register}
          errors={errors}
          helpText="Pallets with comprehensive descriptions are more likely to get picked up."
        />
        <div className="md:flex md:space-x-4">
          <SelectField
            label="Container"
            name="containerType"
            options={LINE_ITEM_CONTAINER_OPTIONS}
            register={register}
            required
          />
          <TextField
            label="Amount of items"
            name="itemCount"
            type="number"
            required
            min={1}
            register={register}
            errors={errors}
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
            required
            register={register}
            errors={errors}
          />
          <TextField
            label="Length (cm)"
            name="containerLengthCm"
            type="number"
            min={1}
            required
            register={register}
            errors={errors}
          />
          <TextField
            label="Height (cm)"
            name="containerHeightCm"
            type="number"
            min={1}
            required
            register={register}
            errors={errors}
          />
        </div>
        <div className="md:flex md:space-x-4">
          <TextField
            label="Weight (grams)"
            name="containerWeightGrams"
            type="number"
            min={1}
            required
            register={register}
            errors={errors}
          />
          <TextField
            label="Amount of containers"
            name="containerCount"
            type="number"
            min={1}
            required
            register={register}
            errors={errors}
          />
        </div>
      </fieldset>

      <fieldset className="mt-12">
        <legend className="font-semibold text-gray-700 mb-4">
          Dangerous goods
        </legend>
        <div className="md:grid grid-cols-3 rounded-sm gap-4">
          {DANGEROUS_GOODS_LIST.map((good) => (
            <label
              className="flex items-center space-x-2 cursor-pointer"
              key={good.value}
            >
              <input
                type="checkbox"
                checked={dangerousGoodsList.includes(good.value)}
                onChange={() => toggleDangerousGood(good.value)}
              />
              <span>{good.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  )
}

export default LineItemForm
