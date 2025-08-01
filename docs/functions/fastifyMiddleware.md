[**next-limit**](../README.md)

***

[next-limit](../README.md) / fastifyMiddleware

# Function: fastifyMiddleware()

> **fastifyMiddleware**(`limiter`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [src/middleware/fastify.ts:48](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/middleware/fastify.ts#L48)

Creates a rate limiting hook for Fastify applications.

This function is a factory that takes a `RateLimiterInstance` and returns
a Fastify `preHandler` hook. The hook automatically uses the request's IP address
(`request.ip`) as the identifier for rate limiting.

## Parameters

### limiter

[`RateLimiterInstance`](../interfaces/RateLimiterInstance.md)

An instance of the `RateLimiterInstance` created with `createRateLimiter`.

## Returns

A Fastify `preHandler` hook function.

> (`request`, `reply`): `Promise`\<`void`\>

### Parameters

#### request

`FastifyRequest`

#### reply

`FastifyReply`

### Returns

`Promise`\<`void`\>

## Example

```typescript
import fastify from 'fastify';
import {
  createRateLimiter,
  createMemoryStorage,
  createFixedWindowStrategy,
  fastifyMiddleware
} from 'next-limit';

const app = fastify();

const storage = createMemoryStorage();
const strategyFactory = createFixedWindowStrategy({
  windowMs: 60000, // 1 minute
  limit: 100,      // 100 requests per minute
});

const limiter = createRateLimiter({
  strategy: strategyFactory,
  storage: storage
});

app.addHook('preHandler', fastifyMiddleware(limiter));

app.get('/', (request, reply) => {
  reply.send('Hello, world!');
});
```
