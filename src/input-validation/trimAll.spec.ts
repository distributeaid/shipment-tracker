import { trimAll } from './trimAll'

describe('trimAll', () => {
  it('should trim all whitespace in an object', () =>
    expect(
      trimAll({
        foo: ' bar ',
        trimEnd: 'bar ',
        trimStart: ' bar',
        keepSpace: ' foo bar ',
      }),
    ).toMatchObject({
      foo: 'bar',
      trimEnd: 'bar',
      trimStart: 'bar',
      keepSpace: 'foo bar',
    }))
})
