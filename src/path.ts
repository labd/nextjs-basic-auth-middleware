import { parse } from 'url'
import { IncomingMessage } from 'http'

export const pathInRequest = (paths: string[], req: IncomingMessage) => {
  if (req.url === undefined) {
    return false
  }

  const path = parse(req.url).pathname
  return paths.some(item => path?.startsWith(item))
}
