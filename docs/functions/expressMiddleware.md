[**next-limit**](../README.md)

***

[next-limit](../README.md) / expressMiddleware

# Function: expressMiddleware()

> **expressMiddleware**(`options`): (`req`, `res`, `next`) => `Promise`\<`void`\>

Defined in: [middleware/express.ts:47](https://github.com/saoudi-h/next-limit/blob/e4a145e5bc3797945c61eb5f5c739ea59ac60269/src/middleware/express.ts#L47)

Creates a rate limiting middleware for Express applications.

## Parameters

### options

[`ExpressMiddlewareOptions`](../interfaces/ExpressMiddlewareOptions.md)

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
