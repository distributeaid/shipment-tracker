import _pick from 'lodash/pick'
import { FunctionComponent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import SelectField from '../../components/forms/SelectField'
import TextField from '../../components/forms/TextField'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import Spinner from '../../components/Spinner'
import { LINE_ITEM_CONTAINER_OPTIONS } from '../../data/constants'
import useModalState from '../../hooks/useModalState'
import {
  LineItemUpdateInput,
  PalletDocument,
  PalletQuery,
  useDestroyLineItemMutation,
  useLineItemQuery,
  useUpdateLineItemMutation,
} from '../../types/api-types'

interface Props {
  lineItemId: number
  onLineItemDeleted: () => void
}

const LineItemForm: FunctionComponent<Props> = ({
  lineItemId,
  onLineItemDeleted,
}) => {
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

    // Pick the LineItemUpdateInput fields from the line item data
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

  const [
    deleteConfirmationIsVisible,
    showDeleteConfirmation,
    hideDeleteConfirmation,
  ] = useModalState()

  const [destroyLineItem] = useDestroyLineItemMutation()

  const confirmDeleteLineItem = () => {
    destroyLineItem({
      variables: { id: lineItemId },
      update: (cache, { data }) => {
        const palletId = data?.destroyLineItem.id

        try {
          const palletData = cache.readQuery<PalletQuery>({
            query: PalletDocument,
            variables: { id: palletId },
          })

          cache.writeQuery<PalletQuery>({
            query: PalletDocument,
            variables: { id: palletId },
            data: {
              pallet: Object.assign({}, palletData!.pallet, {
                lineItems: [
                  ...palletData!.pallet.lineItems.filter(
                    (item) => item.id !== lineItemId,
                  ),
                ],
              }),
            },
          })
        } catch (error) {
          console.error(error)
        }
      },
    }).then(() => {
      onLineItemDeleted()
      hideDeleteConfirmation()
    })
  }

  // TODO build a read-only version of this form and toggle between the two

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 text-lg flex items-center">
          Line Item {lineItemIsLoading && <Spinner className="ml-2" />}
        </h2>
        <Button variant="danger" onClick={showDeleteConfirmation}>
          Delete
        </Button>
      </div>
      <ConfirmationModal
        isOpen={deleteConfirmationIsVisible}
        confirmLabel="Delete this line item"
        onCancel={hideDeleteConfirmation}
        onConfirm={confirmDeleteLineItem}
        title={`Confirm deleting line item  #${lineItemId}`}
      >
        Are you certain you want to delete this line item? This action is
        irreversible.
      </ConfirmationModal>
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
