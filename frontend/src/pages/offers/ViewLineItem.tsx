import { FunctionComponent, useEffect } from 'react'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import Spinner from '../../components/Spinner'
import useModalState from '../../hooks/useModalState'
import {
  PalletDocument,
  PalletQuery,
  useDestroyLineItemMutation,
  useLineItemQuery,
} from '../../types/api-types'

interface Props {
  /**
   * The ID of the line item to display
   */
  lineItemId: number
  /**
   * Callback triggered when the user deleted this line item. The parent
   * component is responsible for performing side effects such as
   * deselecting this line item.
   */
  onLineItemDeleted: () => void
  /**
   * Callback triggered when the user wants to edit this line item. The parent
   * component should handle displaying a form to edit this line item, if the
   * user has permission to do so.
   */
  editLineItem: () => void
}

const ViewLineItem: FunctionComponent<Props> = ({
  lineItemId,
  onLineItemDeleted,
  editLineItem,
}) => {
  const { data, refetch, loading: lineItemIsLoading } = useLineItemQuery({
    variables: { id: lineItemId },
  })

  useEffect(
    function fetchLineItem() {
      refetch({ id: lineItemId })
    },
    [lineItemId, refetch],
  )

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700 text-lg flex items-center">
          Line Item {lineItemIsLoading && <Spinner className="ml-2" />}
        </h2>
        <div className="space-x-4">
          <Button variant="danger" onClick={showDeleteConfirmation}>
            Delete
          </Button>
          <Button onClick={editLineItem}>Edit</Button>
        </div>
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
      {data?.lineItem && (
        <>
          <fieldset className="space-y-4">
            <legend className="font-semibold text-gray-700 ">Contents</legend>
            <ReadOnlyField label="Description">
              {data.lineItem.description || 'No description provided'}
            </ReadOnlyField>
            <div className="md:flex md:space-x-4">
              <ReadOnlyField label="Container">
                {data.lineItem.containerType}
              </ReadOnlyField>
              <ReadOnlyField label="Number of items">
                {data.lineItem.itemCount || 0}
              </ReadOnlyField>
            </div>
            {/* TODO add a category dropdown after we create some enums */}
            {/* <SelectField label="Category" name="category" options={[]} /> */}
          </fieldset>
          <fieldset className="space-y-4 mt-12">
            <legend className="font-semibold text-gray-700 ">
              Dimensions and weight
            </legend>
            <div className="md:flex md:space-x-4">
              <ReadOnlyField label="Width">
                {data.lineItem.containerWidthCm || 0}cm
              </ReadOnlyField>
              <ReadOnlyField label="Length">
                {data.lineItem.containerLengthCm || 0}cm
              </ReadOnlyField>
              <ReadOnlyField label="Height">
                {data.lineItem.containerHeightCm || 0}cm
              </ReadOnlyField>
            </div>
            <div className="md:flex md:space-x-4">
              <ReadOnlyField label="Weight">
                {data.lineItem.containerWeightGrams || 0}g
              </ReadOnlyField>
              <ReadOnlyField label="Amount of containers">
                {data.lineItem.containerCount || 0}
              </ReadOnlyField>
            </div>
          </fieldset>
          <fieldset className="mt-12">
            <legend className="font-semibold text-gray-700 mb-4">
              Dangerous goods
            </legend>
            {data.lineItem.dangerousGoods.length === 0 && (
              <p className="text-gray-600">No dangerous goods</p>
            )}
            <ul>
              {data.lineItem.dangerousGoods.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </fieldset>
        </>
      )}
    </div>
  )
}

export default ViewLineItem
