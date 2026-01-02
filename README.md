# ⚠️ Archived & Deprecated

> **This repository and the npm package `next-limit` are officially deprecated and no longer maintained.**

## ➡️ Successor Project
This project has been succeeded by the new, modular **`@ratelock`** suite, designed for better flexibility and maintenance.

**Please migrate to one of the new packages for all future development and support:**

*   **`@ratelock/redis`**: For Redis-based rate limiting.
*   **`@ratelock/local`**: For in-memory rate limiting.

## 🔗 Links
*   **[`@ratelock` Main Repository & Documentation](https://github.com/saoudi-h/ratelock)** – Start here for migration guides and details.
*   [Deprecated `next-limit` on npm](https://www.npmjs.com/package/next-limit)


*This repository is archived and read-only. All development has moved to the `@ratelock` organization.*


---


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
    RateLimiterResult
} from 'next-limit'

// 1. Create a storage adapter
const storage = createMemoryStorage()

// 2. Create a rate limiting strategy factory
const strategyFactory = createFixedWindowStrategy({
    windowMs: '1m',  // or 60000 for 60 seconds
    limit: 100,      // 100 requests maximum per window
})

// 3. Create the rate limiter instance
const limiter = createRateLimiter({
    strategy: strategyFactory,
    storage,
    prefix: 'myapp:', // Optional: prefix for storage keys
    onError: 'deny'   // Error policy: 'deny' (default), 'allow', or 'throw'
})

async function handleRequest(userId: string) {
    const result = await limiter.consume(userId)
    if (result.allowed) {
        console.log(`Request allowed. Remaining: ${result.remaining}`)
    } else {
        console.log()
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
    RateLimiterResult
} from 'next-limit'
import { createClient } from 'redis'

// 1. Create a Redis client
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const redisClient = createClient({
    url: redisUrl,
    // Other Redis configuration options...
})

// 2. Create a Redis storage adapter
const storage = createRedisStorage({
    redis: redisClient,
    keyPrefix: 'ratelimit:',  // Prefix for all keys
    timeout: 5000,           // Timeout for Redis operations (ms)
    autoConnect: true        // Automatically connect to the Redis client
})

// 3. Create a sliding window strategy factory
const strategyFactory = createSlidingWindowStrategy({
    windowMs: '1m',  // One minute window
    limit: 100,      // 100 requests maximum per window
})

// 4. Create the rate limiter
const limiter = createRateLimiter({
    strategy: strategyFactory,
    storage,
    prefix: 'api:',  // Prefix for this limiter's keys
    onError: 'deny'  // Error policy
})

// 5. Use the limiter
async function handleApiRequest(apiKey: string) {
    try {
        const result: RateLimiterResult = await limiter.consume(apiKey)

        if (!result.allowed) {
            const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
            return {
                status: 429,
                headers: {
                    'Retry-After': retryAfter.toString(),
                    'X-RateLimit-Limit': result.limit.toString(),
                    'X-RateLimit-Remaining': result.remaining.toString(),
                    'X-RateLimit-Reset': Math.ceil(result.reset / 1000).toString()
                },
                body: `Too many requests. Try again in ${retryAfter} seconds.`
            }
        }

        // Process the API request...
        return { status: 200, body: 'Request processed successfully' }
    } catch (error) {
        console.error('Rate limit error:', error)
        return { status: 500, body: 'Internal server error' }
    }
}

// Example usage with an API
// await handleApiRequest('user-api-key-123')
```

## Middlewares

### Express

```typescript
import express from 'express'
import {
    expressMiddleware,
    createRateLimiter,
    createFixedWindowStrategy,
    createRedisStorage,
    RateLimiterResult
} from 'next-limit'
import { createClient } from 'redis'

const app = express()

// Configure Redis storage
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

const storage = createRedisStorage(redisClient)

// Configure the strategy
const strategyFactory = createFixedWindowStrategy({
    windowMs: '1m',  // 1 minute
    limit: 100,      // 100 requests per minute
})

// Create the rate limiter
const limiter = createRateLimiter({
    strategy: strategyFactory,
    storage,
    prefix: 'express:',
    onError: 'deny'
})

// Express Middleware
app.use(express.json())
app.use(expressMiddleware({
    limiter,
    keyGenerator: (req) => {
        // Customize the identifier key (default: req.ip)
        return req.ip || 'unknown'
    },
    skip: (req) => {
        // Ignore certain routes
        return req.path === '/healthcheck'
    },
    handler: (req, res, next, result: RateLimiterResult) => {
        // Customize the response on limit exceeded
        res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset
        })
    }
}))

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to our API')
})

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
```

### Fastify

```typescript
import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import {
    fastifyMiddleware,
    createRateLimiter,
    createSlidingWindowStrategy,
    createRedisStorage,
    RateLimiterResult
} from 'next-limit'
import { createClient } from 'redis'

const app = fastify({ logger: true })

// Configure Redis storage
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

const storage = createRedisStorage(redisClient)

// Configure the strategy
const strategyFactory = createSlidingWindowStrategy({
    windowMs: '1m',  // 1 minute
    limit: 100,      // 100 requests per minute
})

// Create the rate limiter
const limiter = createRateLimiter({
    strategy: strategyFactory,
    storage,
    prefix: 'fastify:',
    onError: 'deny'
})

// Fastify Middleware
app.addHook('preHandler', fastifyMiddleware(limiter, {
    keyGenerator: (request: FastifyRequest) => {
        // Customize the identifier key (default: req.ip)
        return request.ip || 'unknown'
    },
    skip: (request: FastifyRequest) => {
        // Ignore certain routes
        return request.routerPath === '/healthcheck'
    },
    handler: (request: FastifyRequest, reply: FastifyReply, result: RateLimiterResult) => {
        // Customize the response on limit exceeded
        reply.status(429).send({
            error: 'Too many requests',
            retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset
        })
    }
}))

// Routes
app.get('/', async () => {
    return { message: 'Welcome to our Fastify API' }
})

app.get('/healthcheck', async () => {
    return { status: 'ok' }
})

// Start the server
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()
```

## API Reference

### `createRateLimiter(options)`

Creates an instance of a rate limiter.

```typescript
interface RateLimiterOptions {
    // Strategy factory (required)
    strategy: StrategyFactory<RateLimitStrategy>;

    // Storage adapter (required)
    storage: Storage;

    // Prefix for storage keys (optional)
    prefix?: string;

    // Error handling policy (optional, default: 'deny')
    onError?: 'deny' | 'allow' | 'throw';
}

const limiter = createRateLimiter({
    strategy: createFixedWindowStrategy({ windowMs: '1m', limit: 100 }),
    storage: createMemoryStorage(),
    prefix: 'api:',
    onError: 'deny'
});
```

### `createFixedWindowStrategy(config)`

Creates a factory for a fixed window strategy.

```typescript
interface WindowOptions {
    // Duration of the window in milliseconds or readable format (e.g., '1m', '1h')
    windowMs: number | string;

    // Maximum number of requests allowed in the window
    limit: number;
}

const strategyFactory = createFixedWindowStrategy({
    windowMs: '1m',  // or 60000
    limit: 100
});
```

### `createSlidingWindowStrategy(config)`

Creates a factory for a sliding window strategy.

```typescript
const strategyFactory = createSlidingWindowStrategy({
    windowMs: '1m',  // or 60000
    limit: 100
});
```

### `createMemoryStorage()`

Creates a memory storage adapter.

```typescript
const storage = createMemoryStorage();
```

### `createRedisStorage(options)`

Creates a Redis storage adapter.

```typescript
// With an existing Redis client
const redisClient = createClient({ url: 'redis://localhost:6379' });
const storage1 = createRedisStorage(redisClient);

// With configuration options
const storage2 = createRedisStorage({
    redis: redisClient,  // or a function that returns a client
    keyPrefix: 'ratelimit:',
    timeout: 5000,
    autoConnect: true
});
```

### `limiter.consume(identifier)`

Consumes a point for a given identifier and checks if the request is allowed.

```typescript
interface RateLimiterResult {
    // If the request is allowed
    allowed: boolean;

    // Limit of requests defined
    limit: number;

    // Number of remaining requests
    remaining: number;

    // Timestamp of reset (in milliseconds)
    reset: number;
}

const result = await limiter.consume('user-123');
if (!result.allowed) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    console.log(`Too many requests. Try again in ${retryAfter} seconds.);
}
```

## Error Handling

### Error Handling Policies

When creating a limiter, you can specify how to handle storage errors via the `onError` option:

- `'deny'` (default): Refuse the request in case of an error
- `'allow'`: Allow the request in case of an error
- `'throw'`: Throws the error for custom handling

```typescript
// Example with custom error handling
try {
    const result = await limiter.consume('user-123');
    // Process the result...
} catch (error) {
    if (error instanceof RateLimitError) {
        // Handle rate limit error
        console.error('Rate limit error:', error);
    } else {
        // Other errors
        console.error('Unexpected error:', error);
    }
}
```

## License

MIT

## Documentation

For more detailed examples, advanced configuration, and the full API, see the [documentation](./docs/README.md).

## License

`next-limit` is licensed under the MIT License.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
