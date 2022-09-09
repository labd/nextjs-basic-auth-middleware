import type { NextRequest } from 'next/server'
import { createNextMiddleware } from 'nextjs-basic-auth-middleware'

export function middleware(request: NextRequest) {
  const authMiddleware = createNextMiddleware({
    users: [{ name: 'test', password: 'test' }],
  })
  // @ts-ignore
  return authMiddleware(request)
}
