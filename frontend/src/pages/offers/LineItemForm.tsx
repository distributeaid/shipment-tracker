import _pick from 'lodash/pick'
import { FunctionComponent, useEffect, useState } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import Spinner from '../../components/Spinner'
import {
  DANGEROUS_GOODS_LIST,
  LINE_ITEM_CATEGORY_OPTIONS,
  LINE_ITEM_CONTAINER_OPTIONS,
  PALLET_CONFIGS,
} from '../../data/constants'
import {
  DangerousGoods,
  LineItemCategory,
  LineItemContainerType,
  LineItemUpdateInput,
  PalletType,
  useLineItemQuery,
  useUpdateLineItemMutation,
} from '../../types/api-types'
import { getContainerCountLabel } from '../../utils/format'

type UnitExchangeControllerProps = {
  control: Control<FieldValues>
  transform: {
    input: (value: any) => any
    output: (e: any) => any
  }
  name: string
  defaultValue?: any
}

const kilosToGrams = (kilos: number) => kilos * 1000

const gramsToKilos = (grams: number) => grams / 1000

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
  /**
   * The type of pallet for this line item. We use this to calculate the default
   * values for some form fields.
   */
  palletType: PalletType
}

const LineItemForm: FunctionComponent<Props> = ({
  lineItemId,
  onEditingComplete,
  palletType,
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<LineItemUpdateInput>()

  const watchContainerType = watch('containerType')
  const [
    watchContainerWidth,
    watchContainerLength,
    watchContainerHeight,
  ] = watch(['containerWidthCm', 'containerLengthCm', 'containerHeightCm'])

  useEffect(() => {
    const palletDimensions = PALLET_CONFIGS.find(
      (config) => config.type === palletType,
    )

    if (watchContainerType === LineItemContainerType.BulkBag) {
      // Do NOT pre-fill the height since it varies wildly
      if (!watchContainerWidth) {
        setValue('containerWidthCm', palletDimensions?.widthCm)
      }
      if (!watchContainerLength) {
        setValue('containerLengthCm', palletDimensions?.lengthCm)
      }
    } else if (watchContainerType === LineItemContainerType.FullPallet) {
      setValue('containerCount', 1) // There can only be one pallet per... pallet

      // Pre-fill dimensions if they're not already set
      if (!watchContainerWidth) {
        setValue('containerWidthCm', palletDimensions?.widthCm)
      }
      if (!watchContainerLength) {
        setValue('containerLengthCm', palletDimensions?.lengthCm)
      }
      if (!watchContainerHeight) {
        setValue('containerHeightCm', palletDimensions?.heightCm)
      }
    }
  }, [watchContainerType, palletType])

  useEffect(
    function fetchLineItem() {
      refetch({ id: lineItemId })
    },
    [lineItemId, refetch],
  )

  useEffect(
    function resetForm() {
      if (data?.lineItem) {
        reset({
          ...data.lineItem,
          containerWeightGrams: gramsToKilos(
            data.lineItem.containerWeightGrams || 0,
          ),
        })
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

    // Override the weight because we ask for it in kilos but want to store it
    // in grams
    if (input.containerWeightGrams) {
      input.containerWeightGrams = kilosToGrams(input.containerWeightGrams)
    }

    // We need to send all the fields from LineItemUpdateInput, even the ones
    // that didn't change. We then _pick the fields to make sure we don't send
    // things like `id` or `__typename`.
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

  const containerCountLabel = getContainerCountLabel(
    watchContainerType || LineItemContainerType.Unset,
  )

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
            label="Container type"
            name="containerType"
            options={LINE_ITEM_CONTAINER_OPTIONS}
            register={register}
            required
            registerOptions={{
              validate: {
                notUnset: (value: LineItemContainerType) =>
                  value !== LineItemContainerType.Unset ||
                  'Please select a container type',
              },
            }}
            errors={errors}
          />
          <TextField
            label={containerCountLabel}
            name="containerCount"
            type="number"
            min={1}
            required
            register={register}
            errors={errors}
            disabled={watchContainerType === LineItemContainerType.FullPallet}
          />
          <TextField
            label="Number of items"
            name="itemCount"
            type="number"
            required
            min={1}
            register={register}
            errors={errors}
          />
        </div>
        <SelectField
          label="Category"
          name="category"
          options={LINE_ITEM_CATEGORY_OPTIONS}
          register={register}
          registerOptions={{
            validate: {
              notUnset: (value: LineItemCategory) =>
                value !== LineItemCategory.Unset || 'Please select a category',
            },
          }}
          required
          errors={errors}
        />
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
        <div className="md:w-1/3">
          {/* Note that we ask for KILOS but save the value in GRAMS */}
          <TextField
            label="Weight (kg)"
            name="containerWeightGrams"
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
