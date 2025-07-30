[**next-limit**](../README.md)

***

[next-limit](../README.md) / expressMiddleware

# Function: expressMiddleware()

> **expressMiddleware**(`options`): (`req`, `res`, `next`) => `Promise`\<`void`\>

Defined in: [middleware/express.ts:46](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/middleware/express.ts#L46)

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
