import { compareCredentials, parseCredentials } from '../src/lib/credentials'

describe('parseCredentials', () => {
  it('returns a single user', () => {
    expect(parseCredentials('bla:bla')).toEqual([
      {
        name: 'bla',
        password: 'bla',
      },
    ])
  })

  it('returns multiple users', () => {
    expect(parseCredentials('bla:bla|test:test')).toEqual([
      {
        name: 'bla',
        password: 'bla',
      },
      {
        name: 'test',
        password: 'test',
      },
    ])
  })

  it('throws an error on missing credentials', () => {
    expect(() => parseCredentials(':')).toThrow()
  })

  it('throws an error on missing password', () => {
    expect(() => parseCredentials('bla:')).toThrow()
  })
})

describe('compareCredentials', () => {
  it('returns true when a user matches credentials', () => {
    expect(
      compareCredentials({ user: 'test', pass: 'test' }, [
        { name: 'test', password: 'test' },
      ])
    ).toBe(true)
  })

  it('returns false when a user does not match credentials', () => {
    expect(
      compareCredentials({ user: 'testing', pass: 'test' }, [
        { name: 'test', password: 'test' },
      ])
    ).toBe(false)

    expect(
      compareCredentials({ user: 'test', pass: 'secret' }, [
        { name: 'test', password: 'test' },
      ])
    ).toBe(false)

    expect(
      compareCredentials({ user: 'test', pass: '' }, [
        { name: 'test', password: 'test' },
      ])
    ).toBe(false)

    expect(
      compareCredentials({ user: '', pass: 'test' }, [
        { name: 'test', password: 'test' },
      ])
    ).toBe(false)

    expect(
      compareCredentials({ user: '', pass: '' }, [
        { name: 'test', password: 'test' },
      ])
    ).toBe(false)
  })
})
