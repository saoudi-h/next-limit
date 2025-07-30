[**next-limit**](../README.md)

***

[next-limit](../README.md) / fastifyMiddleware

# Function: fastifyMiddleware()

> **fastifyMiddleware**(`limiter`): (`request`, `reply`) => `Promise`\<`void`\>

Defined in: [middleware/fastify.ts:40](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/middleware/fastify.ts#L40)

Creates a rate limiting hook for Fastify applications.

This function is a factory that takes a `RateLimiter` instance and returns
a Fastify `preHandler` hook. The hook automatically uses the request's IP address
(`request.ip`) as the identifier for rate limiting.

## Parameters

### limiter

[`RateLimiter`](../classes/RateLimiter.md)

An instance of the `RateLimiter` configured with the desired strategy and limits.

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
import { RateLimiter } from 'next-limit';
import { fastifyMiddleware } from 'next-limit/middleware';
import { MemoryStorageAdapter } from 'next-limit/storage';

const app = fastify();

const limiter = new RateLimiter({
  storage: new MemoryStorageAdapter(),
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // 100 requests per minute
});

app.addHook('preHandler', fastifyMiddleware(limiter));

app.get('/', (request, reply) => {
  reply.send('Hello, world!');
});
```
