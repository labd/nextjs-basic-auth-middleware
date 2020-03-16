import { parseCredentials } from '../src'

describe('parseCredentials', () => {
  it('works', () => {
    expect(parseCredentials('bla:bla')).toEqual({
      name: 'bla',
      password: 'bla',
    })
  })

  it('throws an error on missing credentials', () => {
    expect(() => parseCredentials(':')).toThrow()
  })

  it('throws an error on missing password', () => {
    expect(() => parseCredentials('bla:')).toThrow()
  })
})
