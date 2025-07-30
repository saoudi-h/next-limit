[**next-limit**](../README.md)

***

[next-limit](../README.md) / expressMiddleware

# Function: expressMiddleware()

> **expressMiddleware**(`options`): (`req`, `res`, `next`) => `Promise`\<`void`\>

Defined in: [middleware/express.ts:46](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/middleware/express.ts#L46)

Creates a rate limiting middleware for Express applications.

## Parameters

### options

`ExpressMiddlewareOptions`

The middleware configuration options.

## Returns

An Express middleware function.

> (`req`, `res`, `next`): `Promise`\<`void`\>

### Parameters

#### req

`Request`

#### res

`Response`

#### next

`NextFunction`

### Returns

`Promise`\<`void`\>
