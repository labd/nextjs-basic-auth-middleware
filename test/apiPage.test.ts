import { createMocks } from 'node-mocks-http'
import { createApiPage } from '../src/middleware'

describe('apiPage', () => {
  it('returns a 401 page when called', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    const apiPage = createApiPage()

    await apiPage(req, res)

    console.log(res._getData())

    expect(res.statusCode).toBe(401)
    expect(res._getData()).toEqual('Authentication failed')
  })

  it('allows you to edit realm name and message', async () => {
    const realm = 'test'
    const message = 'test message'
    const { req, res } = createMocks({
      method: 'GET',
    })

    const apiPage = createApiPage(realm, message)

    await apiPage(req, res)

    expect(res.statusCode).toBe(401)
    expect(res._getHeaders()['www-authenticate']).toEqual(
      `Basic realm="${realm}"`
    )
    expect(res._getData()).toEqual(message)
  })
})
