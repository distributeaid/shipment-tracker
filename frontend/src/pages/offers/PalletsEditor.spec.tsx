/**
 * @jest-environment jsdom
 */
import { MockedProvider } from '@apollo/react-testing'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createLineItem, createOffer } from '../../../tests/builders'
import createPallet from '../../../tests/builders/createPallet'
import {
  AllGroupsMinimalDocument,
  GroupType,
  OfferDocument,
  PalletDocument,
} from '../../types/api-types'
import PalletsEditor from './PalletsEditor'

describe('PalletsEditor', () => {
  const offer = createOffer({ id: 2, offerId: 2 })
  const pallet = createPallet({
    id: 2,
    lineItems: [
      createLineItem({ id: 1, description: 'First line item' }),
      createLineItem({ id: 5, description: 'Second line item' }),
    ],
  })
  const listGroups = [
    {
      id: 2,
      description: 'a group',
      groupType: GroupType.Regular,
      name: 'Group',
    },
  ]

  const apolloQueryMocks = [
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

  it('shows form only for the line item which is being edited', async () => {
    render(
      <MockedProvider mocks={apolloQueryMocks}>
        <PalletsEditor offer={offer} pallets={offer.pallets} />
      </MockedProvider>,
    )

    await act(() => userEvent.click(screen.getByText('Pallet 1')))
    const firstLineItem = await screen.findByRole('button', {
      name: 'First line item',
    })
    await act(() => userEvent.click(firstLineItem))

    await act(() =>
      userEvent.click(screen.getByRole('button', { name: 'Edit' })),
    )

    expect(
      await screen.findByRole('form', {
        name: 'Add Line Item',
      }),
    ).not.toBeNull()

    const secondLineItem = await screen.findByRole('button', {
      name: 'Second line item',
    })

    await waitFor(async () => {
      await act(() => userEvent.click(secondLineItem))
    })

    expect(
      screen.queryByRole('form', {
        name: 'Add Line Item',
      }),
    ).toBeNull()
  })
})
