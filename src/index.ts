import { IncomingMessage, ServerResponse } from 'http'
import auth from 'basic-auth'

import {
  compareCredentials,
  parseCredentials,
  AuthCredentials,
} from './credentials'
import { pathInRequest } from './path'

export type MiddlewareOptions = {
  realm?: string
  users?: AuthCredentials
  includePaths?: string[]
  excludePaths?: string[]
}

/**
 * Middleware that sends a basic auth challenge to the user when enabled
 * @param req Http server incoming message
 * @param res Server response
 */
const basicAuthMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse,
  {
    realm = 'protected',
    users = [],
    includePaths = ['/'],
    excludePaths = [],
  }: MiddlewareOptions = {}
) => {
  if (!req?.url) {
    // Current request object has no url defined so cannot set up basic authentication
    // This means page does not have a getServerSideProps or getInitialProps function
    return
  }
  // Check if credentials are set up
  const environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || ''
  if (environmentCredentials.length === 0 && users.length === 0) {
    // No credentials set up, continue rendering the page as normal
    return
  }

  // Retrieve paths from environment credentials or use arguments
  const includeAuth = process.env.BASIC_AUTH_PATHS
    ? process.env.BASIC_AUTH_PATHS.split(';')
    : includePaths
  const excludeAuth = process.env.BASIC_AUTH_EXCLUDE_PATHS
    ? process.env.BASIC_AUTH_EXCLUDE_PATHS.split(';')
    : excludePaths

  // Check whether the path of the request should even be checked
  if (pathInRequest(excludeAuth, req) || !pathInRequest(includeAuth, req)) {
    // Current path not part of the checked settings
    return
  }

  const credentialsObject: AuthCredentials =
    environmentCredentials.length > 0
      ? parseCredentials(environmentCredentials)
      : users

  const currentUser = auth(req)
  if (!currentUser || !compareCredentials(currentUser, credentialsObject)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`)
    res.end('401 Access Denied')
  }
}

export default basicAuthMiddleware
