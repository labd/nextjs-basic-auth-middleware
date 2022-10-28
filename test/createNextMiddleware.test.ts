/**
 * @jest-environment @edge-runtime/jest-environment
 */

import { NextRequest } from 'next/server'

import { createNextAuthMiddleware } from '../src/nextMiddleware'
import { createAuthorizationHeader } from './utils'

describe('Basic auth middleware', () => {
  beforeEach(() => {
    // Clean up env variables since they leak between tests
    delete process.env.BASIC_AUTH_CREDENTIALS
  })

  it('does not authenticate when no users are set', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({})

    const result = await middleware(req)

    expect(result.headers.get('x-middleware-next')).toContain('1')
  })

  it('redirects to auth api page when no credentials are given', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware({
      users: [{ name: 'test', password: 'test' }],
    })

    const result = await middleware(req)

    expect(result.headers.get('x-middleware-rewrite')).toContain(
      'https://example.com/api/auth'
    )
  })

  it('returns the page when the user is authenticated', async () => {
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
    expect(result.headers.get('x-middleware-next')).toContain('1')
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

    expect(result.headers.get('x-middleware-rewrite')).toContain(
      'https://example.com/api/auth'
    )
  })

  it('prefers using the environment variables when set', async () => {
    process.env.BASIC_AUTH_CREDENTIALS = 'test:testing'

    const req = new NextRequest('https://example.com/test', {
      headers: {
        Authorization: createAuthorizationHeader('test', 'test'),
      },
    })

    const middleware = createNextAuthMiddleware({
      users: [{ name: 'test', password: 'test' }],
    })

    const result = await middleware(req)

    expect(result.headers.get('x-middleware-rewrite')).toContain(
      'https://example.com/api/auth'
    )
  })

  it('processes requests without setting a default object', async () => {
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware()

    const result = await middleware(req)

    expect(result.status).toBe(200)
    expect(result.headers.get('x-middleware-next')).toContain('1')
  })

  it('processes env variables without setting a basic object', async () => {
    process.env.BASIC_AUTH_CREDENTIALS = 'test:testing'
    process.env.BASIC_AUTH_PATHS = '/test'
    const req = new NextRequest('https://example.com/test')

    const middleware = createNextAuthMiddleware()

    const result = await middleware(req)

    expect(result.headers.get('x-middleware-rewrite')).toContain(
      'https://example.com/api/auth'
    )
  })
})
