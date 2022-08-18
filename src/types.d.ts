import { AuthCredentials } from 'lib/credentials'

export type MiddlewareOptions = {
  realm?: string
  users?: AuthCredentials
  includePaths?: string[]
  excludePaths?: string[]
}
