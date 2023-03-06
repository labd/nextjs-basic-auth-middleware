import { AuthCredentials } from './lib/credentials'

export type MiddlewareOptions = {
  pathname?: string
  users?: AuthCredentials
  message?: string
  realm?: string
}
