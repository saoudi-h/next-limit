[**next-limit**](../README.md)

***

[next-limit](../README.md) / ExpressMiddlewareOptions

# Interface: ExpressMiddlewareOptions

Defined in: [middleware/express.ts:12](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/middleware/express.ts#L12)

Configuration options for the Express middleware.

## Properties

### identifier()?

> `optional` **identifier**: (`req`) => `string`

Defined in: [middleware/express.ts:23](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/middleware/express.ts#L23)

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

> **limiter**: [`RateLimiter`](../classes/RateLimiter.md)

Defined in: [middleware/express.ts:16](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/middleware/express.ts#L16)

The `RateLimiter` instance to use for checking requests.

***

### onDeny()?

> `optional` **onDeny**: (`result`, `req`, `res`, `next`) => `void`

Defined in: [middleware/express.ts:32](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/middleware/express.ts#L32)

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
