# nextjs-basic-auth-middleware



Adds basic auth support to Next.js projects using the official middleware approach (with a `middleware` file).
Options can be set on the basic auth middleware and overridden using environment variables.

## Compatibility table

| Next.js version | Plugin version |
| --------------- | -------------- |
| Next.js 13      | 3.x            |
| Next.js 12      | 2.x            |
| Next.js 10,11   | 1.x            |


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

**Optional**

You can also use the `nextBasicAuthMiddleware` function to check basic auth in a bigger middleware function:

```js
    import { nextBasicAuthMiddleware } from 'nextjs-basic-auth-middleware'

    export const middleware = (req) => {
        nextBasicAuthMiddleware(options, req)

        // Your other middleware functions here

        return NextResponse.next()
    }

```

> :warning: The middleware will still return a 401 and will quit processing the rest of the middleware. Add this middleware after any required work.


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
`message`| Message to display to the user when authentication fails | `Authentication failed`
`realm` | Realm to show in the WWW-Authenticate header | `protected`

The user object consists of the following required fields:

field | description | type
----- | ----------- | ----
`name`| The username | `string`
`password`| The password | `string`



