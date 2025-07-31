# Next Limit [![Version](https://img.shields.io/npm/v/next-limit.svg)](https://www.npmjs.com/package/next-limit)

`next-limit` is a modern, flexible, and high-performance rate limiting library for Node.js applications. It supports multiple rate limiting strategies and storage backends, making it suitable for both small and large-scale applications.

## Features

- **Factory-Based API**: Simple and intuitive API for creating rate limiters.
- **Multiple Strategies**: Comes with Fixed Window and Sliding Window strategies.
- **Multiple Storages**: Supports in-memory and Redis storage.
- **Framework Agnostic**: Can be used with any Node.js framework.
- **Middleware Included**: Ready-to-use middlewares for Express and Fastify.

## Installation

```bash
npm install next-limit
```

For Redis storage, you also need to install `redis`:

```bash
npm install redis
```

## Basic Usage

Here's a simple example using the Fixed Window strategy with in-memory storage.

```typescript
import {
    createRateLimiter,
    createFixedWindowStrategy,
    createMemoryStorage,
} from 'next-limit'

// 1. Create a storage adapter
const storage = createMemoryStorage()

// 2. Create a rate limiting strategy
const strategy = createFixedWindowStrategy({ windowMs: 60000, limit: 100 })

// 3. Create the rate limiter instance
const limiter = createRateLimiter({ strategy, storage })

async function handleRequest(userId: string) {
    const result = await limiter.consume(userId)

    if (result.allowed) {
        console.log(`Request allowed. Remaining: ${result.remaining}`)
    } else {
        console.log(
            `Request denied. Try again in ${result.reset ? Math.ceil((result.reset - Date.now()) / 1000) : 0} seconds.`
        )
    }
}

handleRequest('user-123')
```

## Usage with Redis

For production environments, using Redis is recommended. `next-limit` uses efficient Lua scripts for atomic operations.

```typescript
import {
    createRateLimiter,
    createSlidingWindowStrategy,
    createRedisStorage,
} from 'next-limit'
import Redis from 'redis'

// 1. Create a Redis client
const redisClient = new Redis()

// 2. Create a Redis storage adapter
const storage = createRedisStorage(redisClient)

// 3. Create a sliding window strategy
const strategy = createSlidingWindowStrategy({ windowMs: 60000, limit: 100 })

// 4. Create the rate limiter
const limiter = createRateLimiter({ strategy, storage })

// Now use the limiter as in the basic example
// await limiter.consume(identifier);
```

## Middleware

### Express

```typescript
import express from 'express'
import {
    expressMiddleware,
    createRateLimiter,
    createFixedWindowStrategy,
    createMemoryStorage,
} from 'next-limit'

const app = express()

const storage = createMemoryStorage()
const strategy = createFixedWindowStrategy({ windowMs: 60000, limit: 10 })
const limiter = createRateLimiter({ strategy, storage })

app.use(expressMiddleware(limiter))

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.listen(3000)
```

### Fastify

```typescript
import fastify from 'fastify'
import {
    fastifyMiddleware,
    createRateLimiter,
    createFixedWindowStrategy,
    createMemoryStorage,
} from 'next-limit'

const app = fastify()

const storage = createMemoryStorage()
const strategy = createFixedWindowStrategy({ windowMs: 60000, limit: 10 })
const limiter = createRateLimiter({ strategy, storage })

app.addHook('onRequest', fastifyMiddleware(limiter))

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

app.listen({ port: 3000 })
```

## API Reference

### `createRateLimiter(options)`

- `options.strategy`: The rate limiting strategy to use.
- `options.storage`: The storage adapter to use.
- `options.onError`: Policy for handling storage errors (`'deny'`, `'allow'`, `'throw'`). Defaults to `'deny'`.

### `createFixedWindowStrategy(options)`

- `options.windowMs`: The time window in milliseconds.
- `options.limit`: The maximum number of requests allowed in the window.
- `options.prefix` (optional): A prefix for storage keys.

### `createSlidingWindowStrategy(options)`

- `options.windowMs`: The time window in milliseconds.
- `options.limit`: The maximum number of requests allowed in the window.
- `options.prefix` (optional): A prefix for storage keys.

### `limiter.consume(identifier)`

- `identifier`: A unique string to identify the user (e.g., IP address, user ID).
- Returns a `Promise<RateLimiterResult>`:
    - `allowed`: `boolean`
    - `remaining`: `number | undefined`
    - `reset`: `number | undefined` (timestamp in ms)

## Documentation

For more detailed examples, advanced configuration, and the full API, see the [documentation](./docs/README.md) .

---

## License

`next-limit` is licensed under the MIT License.

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
