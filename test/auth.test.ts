import { basicAuthentication } from '../src/lib/auth'

describe('basicAuthentication', () => {
  it('returns undefined when no arguments are passed', () => {
    expect(basicAuthentication()).toBeUndefined()
  })

  it('returns BadRequestException when Authorization scheme is not Basic', () => {
    expect(() => basicAuthentication('NotBasic iaioasas')).toThrow(
      /Malformed authorization header/
    )
  })

  it('returns BadRequestException when no token is provided', () => {
    expect(() => basicAuthentication('Basic ')).toThrow(
      /Malformed authorization header/
    )
  })

  it('returns BadException when the decoded token is not split by a colon', () => {
    const token = Buffer.from('testing', 'base64')
    expect(() =>
      basicAuthentication(`Basic ${token.toString('base64')}`)
    ).toThrow(/Invalid authorization value/)
  })

  it('returns BadException when the decoded token contains control characters', () => {
    const control = String.fromCharCode(0x1f)
    const token = Buffer.from(`${control}testing:testing`)
    expect(() =>
      basicAuthentication(`Basic ${token.toString('base64')}`)
    ).toThrow(/Invalid authorization value/)
  })

  it('returns decoded user and password with correct input', () => {
    const token = Buffer.from('testing:testing')
    console.log(token.toString('base64'))
    expect(
      basicAuthentication(`Basic ${token.toString('base64')}`)
    ).toMatchObject({ user: 'testing', pass: 'testing' })
  })
})
