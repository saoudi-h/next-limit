# Next Limit [![Version](https://img.shields.io/npm/v/next-limit.svg)](https://www.npmjs.com/package/next-limit) [**Docs**](./docs/README.md)

**`next-limit`** is a lightweight and flexible TypeScript library for rate limiting. It's designed to work with or without a framework (Express, Fastify) and supports both in-memory and Redis storage.

*   **Light & Fast**: No heavy dependencies.
*   **Flexible**: Choose between `fixed-window` and `sliding-window` strategies.
*   **Multiple Storage**: In-memory for development, Redis for production.
*   **Framework Ready**: Includes middlewares for Express and Fastify.
*   **100% TypeScript**: Full typing for safe development.
*   **Well Tested**: High test coverage, including with Redis.

* * *

Why `next-limit`?
-----------------

*   **Easy to Use**: Get started quickly with minimal setup.
*   **Powerful**: Handles distributed environments with Redis.
*   **Safe**: Configurable error handling for storage backends.
*   **Extensible**: `StorageAdapter` interface to plug in other backends.

* * *

## Installation

```bash
pnpm install next-limit
```

## Usage

### With Redis

```javascript
import { RateLimiter, createRedisStorage } from 'next-limit';
import { createClient } from 'redis';

const redisClient = createClient();
redisClient.connect();

const limiter = new RateLimiter({
  storage: createRedisStorage(redisClient),
  strategy: 'sliding-window',
  windowMs: 60 * 1000, // 60 seconds
  limit: 10, // 10 requests max
});
```

### With In-Memory Storage

```javascript
import { RateLimiter, createMemoryStorage } from 'next-limit';

const limiter = new RateLimiter({
  storage: createMemoryStorage(),
  strategy: 'sliding-window',
  windowMs: 60 * 1000, // 60 seconds
  limit: 10, // 10 requests max
});
```

### Express Middleware

```javascript
import { expressMiddleware } from 'next-limit';

app.use('/api/', expressMiddleware({ limiter }));
```

### Using a Custom Strategy

For more advanced use cases, you can provide your own strategy by implementing the `RateLimitStrategy` interface.

```javascript
import { RateLimiter, RateLimitStrategy, RateLimiterResult } from 'next-limit';

const myCustomStrategy: RateLimitStrategy = {
  async limit(identifier) {
    // ... your custom logic here
    return { allowed: true, remaining: 10, reset: Date.now() + 1000 };
  },
};

const limiter = new RateLimiter({
  storage: createMemoryStorage(),
  strategy: myCustomStrategy,
  windowMs: 60 * 1000,
  limit: 10,
});
```

### Fastify Middleware

```javascript
import { fastifyMiddleware } from 'next-limit';

app.addHook('onRequest', fastifyMiddleware({ limiter }));
```


## Configuration

| Option     | Type                               | Description                                      |
| :--------- | :--------------------------------- | :----------------------------------------------- |
| `storage`  | `StorageAdapter`                   | An instance of a storage adapter.                |
| `strategy` | `'sliding-window'` \| `'fixed-window'` \| `RateLimitStrategy` | The name of a built-in strategy or a custom strategy instance. |
| `windowMs` | `number`                           | The time window in milliseconds.                 |
| `limit`    | `number`                           | The maximum number of requests in the window.    |
| `prefix`   | `string`                           | The prefix for Redis keys. Defaults to `ratelimit`. |
| `onError`  | `'allow'` \| `'deny'` \| `'throw'`      | How to handle Redis errors. Defaults to `deny`.  |

## Strategies

- **`sliding-window` (default):** A precise strategy that uses a sliding window of time. This is recommended for most use cases.
- **`fixed-window`:** A simpler strategy that uses a fixed window of time. This is less precise but more performant.

## Error Handling

If Redis is unavailable, you can configure how `next-limit` behaves:

- **`allow`:** Allow all requests.
- **`deny` (default):** Deny all requests.
- **`throw`:** Throw an error.

Documentation
-------------

For more detailed examples, advanced configuration, and the full API, see the [documentation](./docs/README.md) .

* * *

License
-------

`next-limit` is licensed under the MIT License.

* * *

Contributing
------------

Contributions are welcome! Feel free to open an issue or submit a pull request.
