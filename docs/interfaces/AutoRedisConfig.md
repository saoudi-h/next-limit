[**next-limit**](../README.md)

***

[next-limit](../README.md) / AutoRedisConfig

# Interface: AutoRedisConfig

Defined in: [src/factories.ts:81](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L81)

Configuration for automatically creating a Redis client.

## Extends

- `RedisClientOptions`

## Properties

### autoConnect?

> `optional` **autoConnect**: `boolean`

Defined in: [src/factories.ts:91](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L91)

Whether to automatically connect the client.

#### Default

```ts
true
```

***

### clientInfoTag?

> `optional` **clientInfoTag**: `string`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:133

Tag to append to library name that is sent to the Redis server

#### Inherited from

`RedisClientOptions.clientInfoTag`

***

### clientSideCache?

> `optional` **clientSideCache**: `ClientSideCacheProvider` \| `ClientSideCacheConfig`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:125

Client Side Caching configuration.

Enables Redis Servers and Clients to work together to cache results from commands
sent to a server. The server will notify the client when cached results are no longer valid.

Note: Client Side Caching is only supported with RESP3.

#### Examples

```
const client = createClient({
  RESP: 3,
  clientSideCache: {
    ttl: 0,
    maxEntries: 0,
    evictPolicy: "LRU"
  }
});
```

```
const cache = new BasicClientSideCache({
  ttl: 0,
  maxEntries: 0,
  evictPolicy: "LRU"
});
const client = createClient({
  RESP: 3,
  clientSideCache: cache
});
```

#### Inherited from

`RedisClientOptions.clientSideCache`

***

### commandOptions?

> `optional` **commandOptions**: `CommandOptions`\<`TypeMapping`\>

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:91

Default command options to be applied to all commands executed through this client.

These options can be overridden on a per-command basis when calling specific commands.

#### Example

```
const client = createClient({
  commandOptions: {
    asap: true,
    typeMapping: {
      // Custom type mapping configuration
    }
  }
});
```

#### Inherited from

`RedisClientOptions.commandOptions`

***

### commandsQueueMaxLength?

> `optional` **commandsQueueMaxLength**: `number`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:54

Maximum length of the client's internal command queue

#### Inherited from

`RedisClientOptions.commandsQueueMaxLength`

***

### credentialsProvider?

> `optional` **credentialsProvider**: `CredentialsProvider`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:42

Provides credentials for authentication. Can be set directly or will be created internally
if username/password are provided instead. If both are supplied, this credentialsProvider
takes precedence over username/password.

#### Inherited from

`RedisClientOptions.credentialsProvider`

***

### database?

> `optional` **database**: `number`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:50

Redis database number (see [`SELECT`](https://redis.io/commands/select) command)

#### Inherited from

`RedisClientOptions.database`

***

### disableClientInfo?

> `optional` **disableClientInfo**: `boolean`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:129

If set to true, disables sending client identifier (user-agent like message) to the redis server

#### Inherited from

`RedisClientOptions.disableClientInfo`

***

### disableOfflineQueue?

> `optional` **disableOfflineQueue**: `boolean`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:59

When `true`, commands are rejected when the client is reconnecting.
When `false`, commands are queued for execution after reconnection.

#### Inherited from

`RedisClientOptions.disableOfflineQueue`

***

### functions?

> `optional` **functions**: `RedisFunctions`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/RESP/types.d.ts:101

#### Inherited from

`RedisClientOptions.functions`

***

### keyPrefix?

> `optional` **keyPrefix**: `string`

Defined in: [src/factories.ts:85](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L85)

Optional key prefix for Redis storage.

***

### modules?

> `optional` **modules**: `RedisModules`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/RESP/types.d.ts:100

#### Inherited from

`RedisClientOptions.modules`

***

### name?

> `optional` **name**: `string`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:46

Client name ([see `CLIENT SETNAME`](https://redis.io/commands/client-setname))

#### Inherited from

`RedisClientOptions.name`

***

### password?

> `optional` **password**: `string`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:36

ACL password or the old "--requirepass" password

#### Inherited from

`RedisClientOptions.password`

***

### pingInterval?

> `optional` **pingInterval**: `number`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:68

Send `PING` command at interval (in ms).
Useful with Redis deployments that do not honor TCP Keep-Alive.

#### Inherited from

`RedisClientOptions.pingInterval`

***

### readonly?

> `optional` **readonly**: `boolean`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:63

Connect in [`READONLY`](https://redis.io/commands/readonly) mode

#### Inherited from

`RedisClientOptions.readonly`

***

### RESP?

> `optional` **RESP**: `RespVersions`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/RESP/types.d.ts:99

Specifies the Redis Serialization Protocol version to use.
RESP2 is the default (value 2), while RESP3 (value 3) provides
additional data types and features introduced in Redis 6.0.

#### Inherited from

`RedisClientOptions.RESP`

***

### scripts?

> `optional` **scripts**: `RedisScripts`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/RESP/types.d.ts:102

#### Inherited from

`RedisClientOptions.scripts`

***

### socket?

> `optional` **socket**: `RedisSocketOptions`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:28

Socket connection properties

#### Inherited from

`RedisClientOptions.socket`

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [src/factories.ts:97](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L97)

Timeout for Redis operations in milliseconds.

#### Default

```ts
5000
```

***

### unstableResp3?

> `optional` **unstableResp3**: `boolean`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/RESP/types.d.ts:116

When set to true, enables commands that have unstable RESP3 implementations.
When using RESP3 protocol, commands marked as having unstable RESP3 support
will throw an error unless this flag is explicitly set to true.
This primarily affects modules like Redis Search where response formats
in RESP3 mode may change in future versions.

#### Inherited from

`RedisClientOptions.unstableResp3`

***

### url?

> `optional` **url**: `string`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:24

`redis[s]://[[username][:password]@][host][:port][/db-number]`
See [`redis`](https://www.iana.org/assignments/uri-schemes/prov/redis) and [`rediss`](https://www.iana.org/assignments/uri-schemes/prov/rediss) IANA registration for more details

#### Inherited from

`RedisClientOptions.url`

***

### username?

> `optional` **username**: `string`

Defined in: node\_modules/.pnpm/@redis+client@5.7.0/node\_modules/@redis/client/dist/lib/client/index.d.ts:32

ACL username ([see ACL guide](https://redis.io/topics/acl))

#### Inherited from

`RedisClientOptions.username`
