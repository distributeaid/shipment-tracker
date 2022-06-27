/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { FormattedDate } from './FormattedDate'

describe('FormattedDate', () => {
  it('should formate a date with US format', () => {
    const d = new Date('2021-02-03T12:34:56.789Z')
    const { container } = render(<FormattedDate date={d} />)
    const time = (container as any).getElementsByTagName('time')
    expect(time.length).toBe(1)
    expect(time[0].textContent).toEqual('Feb 3, 2021, 12:34')
    expect(time[0].getAttribute('dateTime')).toEqual(d.toISOString())
  })
})
