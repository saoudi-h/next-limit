[**next-limit**](../README.md)

***

[next-limit](../README.md) / expressMiddleware

# Function: expressMiddleware()

> **expressMiddleware**(`options`): (`req`, `res`, `next`) => `Promise`\<`void`\>

Defined in: [middleware/express.ts:47](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/middleware/express.ts#L47)

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
