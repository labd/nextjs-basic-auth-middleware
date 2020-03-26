import { createRequest } from 'node-mocks-http'

import { pathInRequest } from '../src/path'

describe('pathInRequest', () => {
  it('returns false when no path is given', () => {
    const req = createRequest({
      method: 'GET',
    })
    delete req.url
    expect(pathInRequest([], req)).toBe(false)
  })

  it('returns true when path is in request', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
    })
    expect(pathInRequest(['/test'], req)).toBe(true)
  })
  it('returns false when path is not in request', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
    })
    expect(pathInRequest(['/testing'], req)).toBe(false)
  })
})
