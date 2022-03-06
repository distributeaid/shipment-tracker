import React, { FunctionComponent, useEffect } from 'react'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import ExternalLinkIcon from '../../components/icons/ExternalLinkIcon'
import WarningIcon from '../../components/icons/WarningIcon'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import Spinner from '../../components/Spinner'
import useModalState from '../../hooks/useModalState'
import {
  PalletDocument,
  PalletQuery,
  useDestroyLineItemMutation,
  useLineItemQuery,
} from '../../types/api-types'
import {
  formatContainerType,
  formatLineItemCategory,
  getLineItemVolumeInSquareMeters,
  gramsToKilos,
} from '../../utils/format'
import { groupViewRoute } from '../../utils/routes'

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
  /**
   * Whether this line item can be edited (edits are only allowed for draft offers)
   */
  canEdit: boolean
}

const ViewLineItem: FunctionComponent<Props> = ({
  lineItemId,
  onLineItemDeleted,
  editLineItem,
  canEdit,
}) => {
  const {
    data,
    refetch,
    loading: lineItemIsLoading,
  } = useLineItemQuery({
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
      update: (cache) => {
        const palletId = data?.lineItem.offerPalletId

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
        {canEdit && (
          <div className="space-x-4">
            <Button onClick={showDeleteConfirmation}>Delete</Button>
            <Button onClick={editLineItem}>Edit</Button>
          </div>
        )}
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
          <fieldset className="mb-6">
            <legend className="font-semibold text-gray-700 mb-2">
              Receiving group
            </legend>
            {data.lineItem.proposedReceivingGroup ? (
              <a
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-blue-700 hover:underline"
                href={groupViewRoute(data.lineItem.proposedReceivingGroup.id)}
              >
                {data.lineItem.proposedReceivingGroup.name}
                <ExternalLinkIcon className="ml-2 w-4 h-4" />
              </a>
            ) : (
              <span>No receiving group</span>
            )}
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="font-semibold text-gray-700">Contents</legend>
            <ReadOnlyField label="Description">
              {data.lineItem.description || 'No description provided'}
            </ReadOnlyField>
            <ReadOnlyField label="Category">
              {formatLineItemCategory(data.lineItem.category)}
            </ReadOnlyField>
            <div className="md:flex md:space-x-8">
              <ReadOnlyField label="Total number of items">
                {data.lineItem.itemCount || 0}
              </ReadOnlyField>
              <ReadOnlyField label="Storage">
                {formatContainerType(
                  data.lineItem.containerType,
                  data.lineItem.containerCount || 0,
                )}
              </ReadOnlyField>
            </div>
          </fieldset>
          <fieldset className="space-y-4 mt-12">
            <legend className="font-semibold text-gray-700 ">
              Container dimensions and weight
            </legend>
            <div className="md:flex md:space-x-8">
              <ReadOnlyField label="Width">
                {data.lineItem.containerWidthCm || 0} cm
              </ReadOnlyField>
              <ReadOnlyField label="Length">
                {data.lineItem.containerLengthCm || 0} cm
              </ReadOnlyField>
              <ReadOnlyField label="Height">
                {data.lineItem.containerHeightCm || 0} cm
              </ReadOnlyField>
              <ReadOnlyField label="Volume">
                {getLineItemVolumeInSquareMeters(data.lineItem)}
              </ReadOnlyField>
            </div>

            <ReadOnlyField label="Weight">
              {Math.round(
                gramsToKilos(data.lineItem.containerWeightGrams || 0),
              )}{' '}
              kg
            </ReadOnlyField>
          </fieldset>
          <fieldset className="mt-12">
            <legend className="font-semibold text-gray-700 mb-4">
              Dangerous goods
            </legend>
            {data.lineItem.dangerousGoods.length === 0 ? (
              <p className="text-gray-600">No dangerous goods</p>
            ) : (
              <p className="text-red-700 capitalize">
                {data.lineItem.dangerousGoods
                  .map((item) => item.toLowerCase())
                  .join(', ')}
                <WarningIcon className="w-5 h-5 ml-2 inline-block" />
              </p>
            )}
          </fieldset>
        </>
      )}
    </div>
  )
}

export default ViewLineItem
