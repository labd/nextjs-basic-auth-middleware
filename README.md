# nextjs-basic-auth-middleware

> :warning: Current path support in the middleware shouldn't be used, use [matcher](https://nextjs.org/docs/advanced-features/middleware#matcher) to handle paths

Adds basic auth support to Next.js projects using the official middleware approach (with a `_middleware` file).
An alternative approach for server side rendered (SSR) pages is also available.
Options can be set on the basic auth middleware and overridden using environment variables.

## Installation

Run either of the following commands to add the package, based on your package manager of choice:

```sh
# NPM
npm install nextjs-basic-auth-middleware

# Yarn
yarn add nextjs-basic-auth-middleware
```

## Usage

### Next.js Middleware
The Next.js middleware functionality allows you to add basic auth in front of all your requests, see the [Next.js Middleware documentation](https://nextjs.org/docs/advanced-features/middleware) for more information.

You can use the `createNextAuthMiddleware` function to create a default middleware function that sends a `NextResponse.next()` when the auth passes:

```js
    import { createNextAuthMiddleware } from 'nextjs-basic-auth-middleware'

    export const middleware = createNextAuthMiddleware(options)
```

You can also use the `nextBasicAuthMiddleware` function to check basic auth in a bigger middleware function:

```js
    import { nextBasicAuthMiddleware } from 'nextjs-basic-auth-middleware'

    export const middleware = (req) => {
        nextBasicAuthMiddleware(options, req)

        // Your other middleware functions

        return NextResponse.next()
    }

```

> :warning: The middleware will still return a 401 and will quit processing the rest of the middleware. Add this middleware after any required work.


### Original approach

This approach only works for server side rendered pages where a request and response object are available.

Either add it to individual pages in the `getServerSideProps` method:
```js
    import { pageMiddleware } from 'nextjs-basic-auth-middleware'

    export async function getServerSideProps({ req, res }) => {
        pageMiddleware(req, res)
        ...
    }
```

Or add the middleware to the `getInitialProps` method of your document:

```js
    import { pageMiddleware } from 'nextjs-basic-auth-middleware'

    Document.getInitialProps = async ({ req, res }) => {
        pageMiddleware(req, res)
        ...
    }
```
> :warning: This will not work if you have pages that use static optimization, e.g. no use of `getInitialProps` or `getServerSideProps`

But this will work anywhere where there is a request and response object available (app/api routes as well).

### What about static pages (SSG, ISR)?

Use the Next.js middleware approach if possible.

Some alternatives if this approach will not work for you:
 -  For Vercel deployments you can check [vercel-basic-auth](https://github.com/flawyte/vercel-basic-auth).
 -  For sites behind AWS CloudFront you can add a Lambda@edge function that adds authentication headers
 -  For Cloudflare you could use a Cloudflare worker that adds authentication headers

### Setting environment variables
If you want to override credentials you can use the `BASIC_AUTH_CREDENTIALS` environment variable:

```sh
# Enables basic auth for user `test` with password `password`
BASIC_AUTH_CREDENTIALS=user:password

# You can set multiple accounts using `|` as a delimiter
BASIC_AUTH_CREDENTIALS=user:password|user2:password2
```

Users set using environment variables will override and thus disable users set in options.
You can also set the paths that should (not) be checked:

```sh
# Enables basic authentication for /pages
BASIC_AUTH_PATHS=/pages

# You can set multiple paths using `;` as a delimiter
BASIC_AUTH_PATHS=/pages;/admin

# Setting excluded paths work in the same way
BASIC_AUTH_EXCLUDE_PATHS=/api;/healthchecks
```

## API
### basicAuthMiddleware()
```basicAuthMiddleware(req: http.IncomingMessage, res: http.ServerResponse, options)```

The options object can contain any of the following options:

option | description | default value
------ | ----------- | -------------
`realm`| The name of the basic auth realm | `'Protected'`
`users`| A list of users that can authenticate | `[]`
`includePaths`| List of paths that should have protection | `['/']`
`excludePaths`| List of paths that are excluded from protection | `[]`

> **NOTE**
> The exclude paths are always excluded from protection,
> even if they exist in the included paths

The user object consists of the following required fields:

field | description | type
----- | ----------- | ----
`name`| The username | `string`
`password`| The password | `string`


## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for your convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.


This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).
