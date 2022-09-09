// /**

import { NextRequest } from 'next/server'

import { createNextAuthMiddleware } from '../src/nextMiddleware'
import { createAuthorizationHeader } from './utils'

describe('Basic auth middleware', () => {
  beforeEach(() => {
    // Clean up env variables since they leak between tests
    delete process.env.BASIC_AUTH_CREDENTIALS
    delete process.env.BASIC_AUTH_PATHS
    delete process.env.BASIC_AUTH_EXCLUDE_PATHS
  })

  it('does not authenticate when no users are set', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({})

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('returns a 401 when no credentials are given', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({
      users: [{ name: 'test', password: 'test' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(401)
  })

  it('returns a 200 when the user is authenticated', async () => {
    const req = new NextRequest('https://example.com/test', {
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const middleware = createNextAuthMiddleware({
      users: [{ name: 'test', password: 'test' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('returns a 401 when the credentials are wrong', async () => {
    const req = new NextRequest('https://example.com/test', {
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const middleware = createNextAuthMiddleware({
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(401)
  })

  it('returns the correct realm name on a 401', async () => {
    const req = new NextRequest('https://example.com/test', {
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const middleware = createNextAuthMiddleware({
      realm: 'Test',
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.headers.get('www-authenticate')).toBe('Basic realm="Test"')
  })

  it('prefers using the environment variables when set', async () => {
    process.env.BASIC_AUTH_CREDENTIALS = 'test:testing'

    const req = new NextRequest('https://example.com/test', {
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const middleware = createNextAuthMiddleware({
      realm: 'Test',
      users: [{ name: 'test', password: 'test' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(401)
  })

  it('only checks if the path has been included', async () => {
    const req = new NextRequest('https://example.com/test', {
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const middleware = createNextAuthMiddleware({
      includePaths: ['/testing'],
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('does not check an excluded path', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({
      excludePaths: ['/test'],
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('checks everything but excluded paths', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({
      excludePaths: ['/testing'],
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(401)
  })

  it('does not check an excluded path which is a child of an included path', async () => {
    const req = new NextRequest('https://example.com/test/api')

    const middleware = createNextAuthMiddleware({
      includePaths: ['/test'],
      excludePaths: ['/test/api'],
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('prefers the paths being set with environment variables', async () => {
    process.env.BASIC_AUTH_PATHS = '/testing'
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('prefers the paths being set with environment variables', async () => {
    process.env.BASIC_AUTH_EXCLUDE_PATHS = '/'
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({
      excludePaths: ['/testing'],
      users: [{ name: 'test', password: 'testing' }],
    })

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('processes requests without setting a default object', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware()

    const result = await middleware(req)

    expect(result.status).toBe(200)
  })

  it('processes env variables without setting a basic object', async () => {
    process.env.BASIC_AUTH_CREDENTIALS = 'test:testing'
    process.env.BASIC_AUTH_PATHS = '/test'
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware()

    const result = await middleware(req)

    expect(result.status).toBe(401)
  })
})
