[**next-limit**](../README.md)

***

[next-limit](../README.md) / expressMiddleware

# Function: expressMiddleware()

> **expressMiddleware**(`options`): (`req`, `res`, `next`) => `Promise`\<`void`\>

Defined in: [middleware/express.ts:87](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/middleware/express.ts#L87)

Creates a rate limiting middleware for Express applications.

This function creates an Express middleware that uses a RateLimiterInstance
to check if requests are allowed based on the configured rate limiting strategy.
It automatically sets rate limit headers and handles denied requests.

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

## Example

```typescript
import express from 'express';
import {
  createRateLimiter,
  createMemoryStorage,
  createFixedWindowStrategy,
  expressMiddleware
} from 'next-limit';

const app = express();

const storage = createMemoryStorage();
const strategyFactory = createFixedWindowStrategy({
  windowMs: 60000, // 1 minute
  limit: 100,      // 100 requests per minute
});

const limiter = createRateLimiter({
  strategy: strategyFactory,
  storage: storage
});

app.use(expressMiddleware({
  limiter: limiter,
  identifier: (req) => req.ip ?? ''
}));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});
```
