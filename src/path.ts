import { IncomingMessage } from 'http'
import type { NextRequest } from 'next/server'

export const pathInRequest = (paths: string[], req: IncomingMessage | NextRequest) => {
  if (req.url === undefined) {
    return false
  }

  const path = new URL(req.url).pathname
  return paths.some(item => path?.startsWith(item))
}
