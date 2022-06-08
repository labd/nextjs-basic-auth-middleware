import { createRequest, createResponse } from 'node-mocks-http'

import { pageMiddleware } from '../src'
import { createAuthorizationHeader } from './utils'

describe('Basic auth middleware', () => {
  it('does not authenticate when no users are set', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
    })
    const res = createResponse()

    pageMiddleware(req, res, {})

    expect(res.statusCode).toBe(200)
  })

  it('returns a 401 when no credentials are given', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'test' }],
    })

    expect(res.statusCode).toBe(401)
  })

  it('returns a 200 when the user is authenticated', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'test' }],
    })

    expect(res.statusCode).toBe(200)
  })

  it('returns a 401 when the credentials are wrong', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
    })

    expect(res.statusCode).toBe(401)
  })

  it('returns the correct realm name on a 401', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      realm: 'Test',
      users: [{ name: 'test', password: 'testing' }],
    })

    expect(res._getHeaders()['www-authenticate']).toBe('Basic realm="Test"')
  })

  it('prefers using the environment variables when set', () => {
    process.env.BASIC_AUTH_CREDENTIALS = 'test:testing'

    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      realm: 'Test',
      users: [{ name: 'test', password: 'test' }],
    })

    expect(res.statusCode).toBe(401)
  })

  it('only checks if the path has been included', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
      includePaths: ['/testing'],
    })

    expect(res.statusCode).toBe(200)
  })

  it('does not check an excluded path', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
      excludePaths: ['/test'],
    })

    expect(res.statusCode).toBe(200)
  })

  it('does not check an excluded path', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
      excludePaths: ['/test'],
    })

    expect(res.statusCode).toBe(200)
  })

  it('does not check an excluded path which is a child of an included path', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test/api',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
      includePaths: ['/test'],
      excludePaths: ['/test/api'],
    })

    expect(res.statusCode).toBe(200)
  })

  it('prefers the paths being set with environment variables', () => {
    process.env.BASIC_AUTH_PATHS = '/testing'
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
    })

    expect(res.statusCode).toBe(200)
  })

  it('prefers the paths being set with environment variables', () => {
    process.env.BASIC_AUTH_EXCLUDE_PATHS = '/'
    const req = createRequest({
      method: 'GET',
      url: '/test',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })
    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
      excludePaths: ['/test'],
    })

    expect(res.statusCode).toBe(200)
  })

  it('works without setting a default object', () => {
    const req = createRequest({
      method: 'GET',
      url: '/test',
    })
    const res = createResponse()

    pageMiddleware(req, res)

    expect(res.statusCode).toBe(200)
  })

  it('does not process requests without url available', () => {
    const req = createRequest({
      method: 'GET',
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const res = createResponse()

    pageMiddleware(req, res, {
      users: [{ name: 'test', password: 'testing' }],
    })

    expect(res.statusCode).toBe(200)
  })
})
