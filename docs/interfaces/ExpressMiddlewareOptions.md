[**next-limit**](../README.md)

***

[next-limit](../README.md) / ExpressMiddlewareOptions

# Interface: ExpressMiddlewareOptions

Defined in: [middleware/express.ts:12](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/middleware/express.ts#L12)

Configuration options for the Express middleware.

## Properties

### identifier()?

> `optional` **identifier**: (`req`) => `string`

Defined in: [middleware/express.ts:24](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/middleware/express.ts#L24)

A function to generate a unique identifier for a request.
Defaults to using `req.ip`.

#### Parameters

##### req

`Request`

The Express request object.

#### Returns

`string`

A string identifier.

***

### limiter

> **limiter**: [`RateLimiterInstance`](RateLimiterInstance.md)

Defined in: [middleware/express.ts:17](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/middleware/express.ts#L17)

The `RateLimiterInstance` to use for checking requests.
This should be created using the `createRateLimiter` factory.

***

### onDeny()?

> `optional` **onDeny**: (`result`, `req`, `res`, `next`) => `void`

Defined in: [middleware/express.ts:33](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/middleware/express.ts#L33)

A function to execute when a request is denied.
If not provided, a default 429 response is sent.

#### Parameters

##### result

[`RateLimiterResult`](RateLimiterResult.md)

The result from the rate limiter.

##### req

`Request`

The Express request object.

##### res

`Response`

The Express response object.

##### next

`NextFunction`

The Express next function.

#### Returns

`void`
