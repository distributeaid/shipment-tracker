import { FunctionComponent, useContext } from 'react'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import ConfirmationModal from '../../components/modal/ConfirmationModal'
import { UserProfileContext } from '../../components/UserProfileContext'
import useModalState from '../../hooks/useModalState'
import { OfferStatus } from '../../types/api-types'

interface Props {
  currentOfferStatus: OfferStatus
  updateStatus: (status: OfferStatus) => void
}

/**
 * This component allows users to step through the Offer workflow:
 * 1. Draft
 * 2. Proposed
 * 3. In review
 * 4. Accepted or Rejected
 */
const OfferStatusSwitcher: FunctionComponent<Props> = ({
  currentOfferStatus,
  updateStatus,
}) => {
  const userProfile = useContext(UserProfileContext)
  const userIsAdmin = userProfile.profile?.isAdmin

  const [isSubmissionModalOpen, showSubmissionModal, hideSubmissionModal] =
    useModalState()

  const moveOfferToProposed = () => {
    updateStatus(OfferStatus.Proposed)
    hideSubmissionModal()
  }

  if (currentOfferStatus === OfferStatus.Draft) {
    return (
      <>
        <Button variant="primary" onClick={showSubmissionModal}>
          Submit offer
        </Button>
        <ConfirmationModal
          isOpen={isSubmissionModalOpen}
          confirmLabel="Submit offer"
          onCancel={hideSubmissionModal}
          onConfirm={moveOfferToProposed}
          title="Confirm offer submission"
          modalWidth="30rem"
        >
          <>
            <p className="mb-2 text-gray-700">
              When you submit an offer, someone at Distribute Aid will review it
              and contact your organization for coordination.
            </p>
            <p className="text-gray-700">
              You won't be able to make changes to your offer after submission.
            </p>
          </>
        </ConfirmationModal>
      </>
    )
  }

  if (!userIsAdmin) {
    const content = {
      [OfferStatus.Proposed]: 'This offer is awaiting review',
      [OfferStatus.BeingReviewed]: 'An admin is reviewing this offer',
      [OfferStatus.Accepted]: 'This offer was approved',
      [OfferStatus.Rejected]: 'This offer was rejected',
    }

    return (
      <ReadOnlyField label="Status">
        {content[currentOfferStatus]}
      </ReadOnlyField>
    )
  }

  if (currentOfferStatus === OfferStatus.Proposed) {
    return (
      <div className="flex flex-col space-y-2">
        <Button onClick={() => updateStatus(OfferStatus.BeingReviewed)}>
          Start review
        </Button>
        <Button onClick={() => updateStatus(OfferStatus.Draft)}>
          Move back to Draft
        </Button>
      </div>
    )
  }

  if (currentOfferStatus === OfferStatus.BeingReviewed) {
    return (
      <div className="flex flex-col space-y-2">
        <Button onClick={() => updateStatus(OfferStatus.Accepted)}>
          Approve offer
        </Button>
        <Button onClick={() => updateStatus(OfferStatus.Rejected)}>
          Reject offer
        </Button>
      </div>
    )
  }

  if (currentOfferStatus === OfferStatus.Accepted) {
    return (
      <ReadOnlyField label="Status">
        <Badge color="green">Accepted</Badge>
      </ReadOnlyField>
    )
  }

  return (
    <ReadOnlyField label="Status">
      <Badge color="red">Rejected</Badge>
    </ReadOnlyField>
  )
}

export default OfferStatusSwitcher
