/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { nanoid } from 'nanoid'
import * as React from 'react'

describe('nanoid()', () => {
  it('should generate a usable nanoid', () => {
    const { container } = render(
      <ul>
        <li id={nanoid()}></li>
        <li id={nanoid()}></li>
      </ul>,
    )
    const items = (container as any).getElementsByTagName('li')
    expect(items.length).toBe(2)
    const [li1, li2] = items
    expect(li1.id).not.toEqual(li2.id)
    expect(li1.id).toHaveLength(21)
  })
})
