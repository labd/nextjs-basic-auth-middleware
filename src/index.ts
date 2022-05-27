import { IncomingMessage, ServerResponse } from 'http'
import auth from 'basic-auth'
import { NextRequest, NextResponse } from 'next/server'

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
export const pageMiddleware = async (
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

/**
 * Basic authentication middleware based on Next Middleware (`_middleware` file)
 * @param req Next middleware request
 * @param options Options object based on MiddlewareOptions
 * @returns Either a 401 error or goes to the next page
 */
export const createNextMiddleware = ({
  realm = 'protected',
  users = [],
  includePaths = ['/'],
  excludePaths = [],
}: MiddlewareOptions = {}) => async (req: NextRequest) => {
  // Check if credentials are set up
  const environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || ''
  if (environmentCredentials.length === 0 && users.length === 0) {
    // No credentials set up, continue rendering the page as normal
    return NextResponse.next()
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
    return NextResponse.next()
  }

  const credentialsObject: AuthCredentials =
    environmentCredentials.length > 0
      ? parseCredentials(environmentCredentials)
      : users

  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const currentUser = auth.parse(authHeader)

    if (currentUser && compareCredentials(currentUser, credentialsObject)) {
      return NextResponse.next()
    }
  }

  return new Response('401 Access Denied', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}`,
    },
  })
}
