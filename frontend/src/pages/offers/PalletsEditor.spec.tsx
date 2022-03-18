/**
 * @jest-environment jsdom
 */
import { MockedProvider } from '@apollo/react-testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import {
  AllGroupsMinimalDocument,
  GroupType,
  OfferDocument,
  OfferStatus,
  PalletDocument,
  PalletType,
  PaymentStatus,
} from '../../types/api-types'
import PalletsEditor from './PalletsEditor'

describe('PalletsEditor', () => {
  it('should show the form for a line item to edit', async () => {
    const offer = {
      id: 2,
      contact: { email: 'offer@example.com', name: 'Offer Name' },
      offerId: 2,
      shipmentId: 1,
      status: OfferStatus.Draft,
      __typename: 'Offer' as const,
      sendingGroupId: 3,
      photoUris: [],
      pallets: [
        {
          id: 2,
          lineItems: [],
          offerId: 2,
          palletType: PalletType.Euro,
          paymentStatus: PaymentStatus.Uninitiated,
          __typename: 'Pallet' as const,
        },
      ],
    }

    const pallet = {
      createdAt: '2022-03-16T07:56:23.076Z',
      id: 2,
      lineItems: [
        {
          category: 'FOOD',
          containerCount: 1,
          containerHeightCm: 175,
          containerLengthCm: 120,
          containerType: 'FULL_PALLET',
          containerWeightGrams: 12000,
          containerWidthCm: 80,
          dangerousGoods: [],
          description: 'Baked Beans',
          id: 3,
          itemCount: 9,
          offerPalletId: 2,
          status: 'PROPOSED',
          __typename: 'LineItem',
        },
        {
          category: 'SHELTER',
          containerCount: 1,
          containerHeightCm: 175,
          containerLengthCm: 120,
          containerType: 'FULL_PALLET',
          containerWeightGrams: 5000,
          containerWidthCm: 80,
          dangerousGoods: [],
          description: 'Sleeping bags',
          id: 5,
          itemCount: 12,
          offerPalletId: 2,
          status: 'PROPOSED',
          __typename: 'LineItem',
        },
      ],
      length: 2,
      offerId: 2,
      palletType: 'EURO',
      paymentStatusChangeTime: '2022-03-16T07:56:23.076Z',
      updatedAt: '2022-03-16T07:56:23.076Z',
      __typename: 'Pallet',
    }

    const listGroups = [
      {
        __typename: 'Group',
        id: 2,
        name: 'Group',
        description: 'a group',
        groupType: GroupType.Regular,
      },
    ]

    const mocks = [
      {
        request: {
          query: OfferDocument,
          variables: { id: offer.id },
        },
        result: { data: { offer } },
      },
      {
        request: {
          query: PalletDocument,
          variables: { id: pallet.id },
        },
        result: { data: { pallet } },
      },
      {
        request: {
          query: AllGroupsMinimalDocument,
          variables: { groupType: GroupType.Regular },
        },
        result: { data: { listGroups } },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <PalletsEditor offer={offer} pallets={offer.pallets} />
      </MockedProvider>,
    )

    userEvent.click(screen.getByText('Pallet 1'))
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    userEvent.click(screen.getByRole('button', { name: 'Baked Beans' }))

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    userEvent.click(screen.getByRole('button', { name: 'Edit' }))

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    const dropDownMenuLabel = screen.getByLabelText(/Receiving group/)
    expect(dropDownMenuLabel).not.toBeNull()

    userEvent.click(screen.getByRole('button', { name: 'Sleeping bags' }))

    expect(screen.queryByLabelText(/Receiving group/)).toBeNull()
  })
})
