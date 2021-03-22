import React, { FunctionComponent } from 'react'
import Modal, { CloseReason } from './Modal'

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
   * Required callback that's triggered when the user is attempting to close the
   * modal
   */
  onRequestClose: (reason: CloseReason) => void
}

const ModalWrapper: FunctionComponent<Props> = ({
  modalWidth = '28rem',
  onRequestClose,
  children,
  ...otherProps
}) => {
  return (
    <Modal
      {...otherProps}
      onRequestClose={onRequestClose}
      style={{ width: modalWidth }}
    >
      <div className="absolute top-0 right-0 pt-4 pr-4">
        <button
          type="button"
          aria-label="Close modal"
          onClick={() => onRequestClose(CloseReason.CloseButton)}
          className="p-2 focus:ring focus:outline-none ring-navy-300 rounded-sm text-gray-500 hover:text-navy-600 focus:text-navy-600 hover:bg-navy-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="bg-white m-2 rounded-lg shadow-xl">{children}</div>
    </Modal>
  )
}

export default ModalWrapper
