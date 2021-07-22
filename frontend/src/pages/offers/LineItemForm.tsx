import _pick from 'lodash/pick'
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import InlineError from '../../components/forms/InlineError'
import PlaceholderField from '../../components/forms/PlaceholderField'
import SelectField, { SelectOption } from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import Spinner from '../../components/Spinner'
import {
  DANGEROUS_GOODS_LIST,
  LINE_ITEM_CATEGORY_OPTIONS,
  PALLET_CONFIGS,
} from '../../data/constants'
import {
  DangerousGoods,
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemUpdateInput,
  PalletType,
  useAllGroupsMinimalQuery,
  useLineItemQuery,
  useUpdateLineItemMutation,
} from '../../types/api-types'
import { setEmptyFieldsToUndefined } from '../../utils/data'
import {
  gramsToKilos,
  groupToSelectOption,
  kilosToGrams,
} from '../../utils/format'

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
  const {
    data,
    refetch,
    loading: lineItemIsLoading,
  } = useLineItemQuery({
    variables: { id: lineItemId },
  })

  const [receivingGroups, setReceivingGroups] = useState<SelectOption[]>([])
  const { data: groups, loading: groupsAreLoading } = useAllGroupsMinimalQuery({
    variables: { groupType: GroupType.ReceivingGroup },
  })

  useEffect(
    function organizeGroups() {
      if (groups && groups.listGroups) {
        setReceivingGroups(groups.listGroups.map(groupToSelectOption))
      }
    },
    [groups],
  )

  /**
   * Store the list of dangerous goods. This logic works outside of
   * react-hook-form.
   */
  const [dangerousGoodsList, setDangerousGoodsList] = useState<
    DangerousGoods[]
  >([])
  /**
   * Force the user to confirm their selection when a pallet has no dangerous
   * goods.
   */
  const [confirmNoDangerousGoods, setConfirmNoDangerousGoods] = useState(false)
  /**
   * Show a validation error when the user didn't confirm that their pallet
   * contains no dangerous goods.
   */
  const [showDangerousGoodsError, setShowDangerousGoodsError] = useState(false)

  /**
   * Toggle the confirmation that the pallet contains no dangerous goods
   */
  const toggleNoDangerousGoods = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked
    if (checked) {
      setConfirmNoDangerousGoods(true)
      setDangerousGoodsList([])
    } else {
      setConfirmNoDangerousGoods(false)
    }
    setShowDangerousGoodsError(false)
  }

  /**
   * Add or remove a category to the list of dangerous goods.
   */
  const toggleDangerousGood = (value: DangerousGoods) => {
    if (dangerousGoodsList.includes(value)) {
      setDangerousGoodsList(dangerousGoodsList.filter((g) => g !== value))
    } else {
      setDangerousGoodsList([...dangerousGoodsList, value])
      setConfirmNoDangerousGoods(false)
      setShowDangerousGoodsError(false)
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LineItemUpdateInput>()

  const watchContainerType = watch('containerType')
  const [watchContainerWidth, watchContainerLength, watchContainerHeight] =
    watch(['containerWidthCm', 'containerLengthCm', 'containerHeightCm'])

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
  }, [
    watchContainerType,
    palletType,
    watchContainerWidth,
    watchContainerHeight,
    watchContainerLength,
    setValue,
  ])

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

  const [updateLineItem, { loading: mutationIsLoading }] =
    useUpdateLineItemMutation()

  const submitForm = handleSubmit((input) => {
    if (!data?.lineItem) {
      return
    }

    // If the user hasn't checked any dangerous goods and hasn't checked the
    // "No dangerous goods" checkbox, we force them to
    if (!confirmNoDangerousGoods && dangerousGoodsList.length === 0) {
      setShowDangerousGoodsError(true)
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
    let updatedLineItem = _pick(Object.assign({}, data.lineItem, input), [
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

    // The backend doesn't want null values for optional fields
    updatedLineItem = setEmptyFieldsToUndefined(updatedLineItem)

    // There can only be 1 bulk bag or "pallet" by pallet
    if (
      [
        LineItemContainerType.BulkBag,
        LineItemContainerType.FullPallet,
      ].includes(updatedLineItem.containerType)
    ) {
      updatedLineItem.containerCount = 1
    }

    updateLineItem({
      variables: { id: lineItemId, input: updatedLineItem },
    }).then(() => {
      onEditingComplete()
    })
  })

  if (!groupsAreLoading && receivingGroups.length === 0) {
    return (
      <div>
        <h2 className="text-lg mb-2">Unable to add items</h2>
        <p className="text-gray-600">
          There are no receiving groups in the system. This should never happen,
          please contact an administrator.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submitForm} className="pb-12">
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
      {receivingGroups.length > 0 ? (
        <SelectField
          name="proposedReceivingGroupId"
          label="Receiving group"
          castAsNumber
          required
          options={receivingGroups}
          register={register}
          errors={errors}
          className="mb-6 max-w-md"
        />
      ) : (
        <PlaceholderField className="mb-6 max-w-md" />
      )}
      <fieldset className="space-y-4 mb-6">
        <legend className="font-semibold text-gray-700">Contents</legend>
        <TextField
          label="Description"
          name="description"
          required
          minLength={5}
          register={register}
          errors={errors}
          helpText="Pallets with comprehensive descriptions are more likely to get picked up."
        />
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
        <TextField
          label="Total number of items"
          name="itemCount"
          type="number"
          required
          className="max-w-xs"
          helpText="For example: 100 pairs of socks, or 300 tampons"
          min={1}
          register={register}
          errors={errors}
        />
      </fieldset>
      <fieldset>
        <legend className="font-semibold text-gray-700 mb-2">
          Pallet layout
        </legend>
        <p className="text-gray-700 mb-2">
          How are the items laid out on the pallet?
        </p>
        {errors['containerType'] && (
          <InlineError>Please make a selection</InlineError>
        )}
        <div className="space-y-1 mb-4">
          <label className="block">
            <input
              type="radio"
              value={LineItemContainerType.FullPallet}
              {...register('containerType', { required: true })}
            />
            <span className="ml-2">they fill the entire pallet</span>
          </label>
          <label className="block">
            <input
              type="radio"
              value={LineItemContainerType.BulkBag}
              {...register('containerType', { required: true })}
            />
            <span className="ml-2">in one bulk bag</span>
          </label>
          <label className="block">
            <input
              type="radio"
              value={LineItemContainerType.Box}
              {...register('containerType', { required: true })}
            />
            <span className="ml-2">in boxes</span>
          </label>
        </div>
        <TextField
          label="Amount of boxes"
          name="containerCount"
          type="number"
          min={1}
          max={36}
          required
          helpText="1 pallet can contain between 1–36 boxes"
          register={register}
          errors={errors}
          className="max-w-xs"
          disabled={watchContainerType !== LineItemContainerType.Box}
          hidden={watchContainerType !== LineItemContainerType.Box}
        />
      </fieldset>
      <fieldset className="space-y-4 mt-12">
        <legend className="font-semibold text-gray-700 ">
          Container dimensions and weight
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
        {showDangerousGoodsError && (
          <InlineError id="dangerous-goods-error">
            Please either confirm that there are no dangerous goods in this
            pallet or select the types of dangerous goods it includes.
          </InlineError>
        )}
        <label className="inline-flex items-center space-x-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={confirmNoDangerousGoods}
            onChange={toggleNoDangerousGoods}
          />
          <span>No dangerous goods</span>
        </label>
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
