[**next-limit**](../README.md)

***

[next-limit](../README.md) / fastifyMiddleware

# Function: fastifyMiddleware()

> **fastifyMiddleware**(`limiter`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [middleware/fastify.ts:42](https://github.com/saoudi-h/next-limit/blob/e55bcaec4bc22b5051fbf08bd667233196a14fd8/src/middleware/fastify.ts#L42)

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
const limiter = createRateLimiter({
  strategy: createFixedWindowStrategy({ windowMs: 60 * 1000, limit: 100 }, storage)
});

app.addHook('preHandler', fastifyMiddleware(limiter));

app.get('/', (request, reply) => {
  reply.send('Hello, world!');
});
```
