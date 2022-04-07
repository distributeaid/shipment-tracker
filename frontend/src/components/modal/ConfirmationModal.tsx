import { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import Button from '../Button'
import ModalBase, { CloseReason } from './ModalBase'

interface Props {
  /**
   * If true, the modal will be displayed.
   */
  isOpen?: boolean
  /**
   * The maximum width of the modal
   * @default 28rem
   */
  modalWidth?: string | number
  /**
   * A title to make the context clear to the user
   */
  title: ReactNode
  /**
   * The label for the Confirm button
   */
  confirmLabel: ReactNode
  /**
   * Callback triggered when the user presses "Cancel" or the Escape key on
   * their keyboard
   */
  onCancel: () => void
  /**
   * Callback triggered when the user confirms that they want to do the thing
   */
  onConfirm: () => void
}

const ConfirmationModal: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  isOpen,
  onCancel,
  onConfirm,
  modalWidth = '20rem',
  confirmLabel,
  title,
}) => {
  const onRequestClose = (reason: CloseReason) => {
    // Don't allow users to close the modal by clicking the backdrop
    if (reason === CloseReason.EscapeKey) {
      onCancel()
    }
  }

  return (
    <ModalBase
      style={{ width: modalWidth }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <div className="p-4 bg-white rounded-lg">
        <header className="mb-2 font-semibold text-gray-800">{title}</header>
        {children}
        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ModalBase>
  )
}

export default ConfirmationModal
