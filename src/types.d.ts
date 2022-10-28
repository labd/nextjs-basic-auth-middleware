import { AuthCredentials } from './lib/credentials'

export type MiddlewareOptions = {
  pathname?: string
  users?: AuthCredentials
}

export type ServerMiddlewareOptions = {
  realm?: string
  users?: AuthCredentials
  includePaths?: string[]
  excludePaths?: string[]
}
