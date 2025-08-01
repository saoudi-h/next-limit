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

// 2. Create a rate limiting strategy factory
const strategyFactory = createFixedWindowStrategy({
    windowMs: '1m',
    limit: 100,
})

// 3. Create the rate limiter instance
const limiter = createRateLimiter({ strategy: strategyFactory, storage })

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
import { createClient } from 'redis'

const url = 'redis://:password@localhost:6379'

// 1. Create a Redis client
const redisClient = await createClient({ url }).connect()

// 2. Create a Redis storage adapter
const storage = createRedisStorage(redisClient)

// 3. Create a sliding window strategy factory
const strategyFactory = createSlidingWindowStrategy({
    windowMs: '1m',
    limit: 100,
})

// 4. Create the rate limiter
const limiter = createRateLimiter({ strategy: strategyFactory, storage })

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
const strategyFactory = createFixedWindowStrategy({
    windowMs: 60000,
    limit: 10,
})
const limiter = createRateLimiter({ strategy: strategyFactory, storage })

// Pass the limiter instance directly to the middleware
app.use(expressMiddleware({ limiter }))

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
const strategyFactory = createFixedWindowStrategy({
    windowMs: 60000,
    limit: 10,
})
const limiter = createRateLimiter({ strategy: strategyFactory, storage })

// Pass the limiter instance directly to the middleware
app.addHook('preHandler', fastifyMiddleware(limiter))

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

app.listen({ port: 3000 })
```

## API Reference

### `createRateLimiter(options)`

Creates a rate limiter instance.

- `options.strategy`: A strategy factory function (e.g., created by `createFixedWindowStrategy`).
- `options.storage`: The storage adapter instance (e.g., created by `createMemoryStorage`).
- `options.prefix` (optional): A prefix for storage keys. If not provided, a unique prefix is generated.
- `options.onError`: Policy for handling storage errors (`'deny'`, `'allow'`, `'throw'`). Defaults to `'deny'`.

### `createFixedWindowStrategy(config)`

Creates a factory function for a Fixed Window strategy instance.

- `config.windowMs`: The time window in milliseconds or a string format (e.g., "1m", "1h").
- `config.limit`: The maximum number of requests allowed in the window.

Returns a `StrategyFactory` function.

### `createSlidingWindowStrategy(config)`

Creates a factory function for a Sliding Window strategy instance.

- `config.windowMs`: The time window in milliseconds or a string format (e.g., "1m", "1h").
- `config.limit`: The maximum number of requests allowed in the window.

Returns a `StrategyFactory` function.

### `createMemoryStorage()`

Creates an in-memory storage adapter instance.

### `createRedisStorage(redisClient)`

Creates a Redis storage adapter instance.

- `redisClient`: An initialized and connected Redis client instance.

### `limiter.consume(identifier)`

Consumes a point for a given identifier and checks if the request is allowed.

- `identifier`: A unique string to identify the user (e.g., IP address, user ID).
- Returns a `Promise<RateLimiterResult>`:
    - `allowed`: `boolean`
    - `limit`: `number`
    - `remaining`: `number`
    - `reset`: `number` (timestamp in ms)

## Documentation

For more detailed examples, advanced configuration, and the full API, see the [documentation](./docs/README.md) .

---

## License

`next-limit` is licensed under the MIT License.

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
