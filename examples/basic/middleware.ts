import { createNextAuthMiddleware } from 'nextjs-basic-auth-middleware'

export const middleware = createNextAuthMiddleware({
  users: [{ name: 'test', password: 'test' }],
})

export const config = {
  matcher: ['/(.*)', '/_next/static/chunks/(.*)'],
}
