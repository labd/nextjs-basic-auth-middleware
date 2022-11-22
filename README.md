# nextjs-basic-auth-middleware

> :warning: Please upgrade to v2 if you use Next.js middleware version, v1 is broken. SSR Middleware for Next <=11 is still available on v1.

Adds basic auth support to Next.js projects using the official middleware approach (with a `middleware` file).
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

It consists of 2 parts, `createNextAuthMiddleware` for checking and redirecting and `createApiPage` to create the API page that sends a 401 message.

You can use the `createNextAuthMiddleware` function to create a default middleware function that sends a `NextResponse.next()` when the auth passes:

```js
    // middleware.ts
    import { createNextAuthMiddleware } from 'nextjs-basic-auth-middleware'

    export const middleware = createNextAuthMiddleware(options)

    export const config = {
        matcher: ['/(.*)'], // Replace this with your own matcher logic
    }
```

Next create the API page that returns the `401` response:

```js
    // pages/api/auth.ts
    import { createApiPage } from 'nextjs-basic-auth-middleware'

    export default createApiPage()
```

**Optional**

You can also use the `nextBasicAuthMiddleware` function to check basic auth in a bigger middleware function:

```js
    import { nextBasicAuthMiddleware } from 'nextjs-basic-auth-middleware'

    export const middleware = (req) => {
        const basicAuth = nextBasicAuthMiddleware({}, req);
        if (basicAuth.headers.get('x-middleware-rewrite')) {
            return basicAuth;
        }

        // Your other middleware functions here

        return NextResponse.next()
    }

```

> :warning: The middleware will still return a 401 and will quit processing the rest of the middleware. Add this middleware after any required work.


### Original SSR approach

Please check `1.0.0` if you want to use this, this is no longer available in version >=2

### Setting environment variables
If you want to override credentials you can use the `BASIC_AUTH_CREDENTIALS` environment variable:

```sh
# Enables basic auth for user `test` with password `password`
BASIC_AUTH_CREDENTIALS=user:password

# You can set multiple accounts using `|` as a delimiter
BASIC_AUTH_CREDENTIALS=user:password|user2:password2
```

## API
### nextBasicAuthMiddleware()
```nextBasicAuthMiddleware(req: NextApiRequest, res: http.ServerResponse, options)```

The options object can contain any of the following options:

option | description | default value
------ | ----------- | -------------
`pathname`| The path that the middleware redirects to | `/api/auth`
`users`| A list of users that can authenticate | `[]`

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
