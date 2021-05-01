import { FunctionComponent, useContext } from 'react'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import ReadOnlyField from '../../components/forms/ReadOnlyField'
import { UserProfileContext } from '../../components/UserProfileContext'
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

  if (currentOfferStatus === OfferStatus.Draft) {
    return (
      <Button onClick={() => updateStatus(OfferStatus.Proposed)}>
        Ready for review
      </Button>
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
      <Button onClick={() => updateStatus(OfferStatus.BeingReviewed)}>
        Start review
      </Button>
    )
  }

  if (currentOfferStatus === OfferStatus.BeingReviewed) {
    return (
      <div className="flex flex-col space-y-2">
        <Button onClick={() => updateStatus(OfferStatus.Rejected)}>
          Reject offer
        </Button>
        <Button onClick={() => updateStatus(OfferStatus.Accepted)}>
          Approve offer
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
