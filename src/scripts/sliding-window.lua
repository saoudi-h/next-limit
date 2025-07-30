-- Sliding window rate limiter script
-- KEYS[1]: The key for the sorted set (e.g., ratelimit:sliding-window:user123)
-- ARGV[1]: The current timestamp (in milliseconds)
-- ARGV[2]: The window size (in milliseconds)
-- ARGV[3]: The maximum number of requests allowed in the window

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- 1. Remove old entries from the sorted set
local oldest = now - window
redis.call('ZREMRANGEBYSCORE', key, 0, oldest)

-- 2. Get the current number of requests in the window
local count = redis.call('ZCARD', key)

local allowed = false
if count < limit then
  -- 3. Add the new request to the sorted set
  redis.call('ZADD', key, now, now)
  allowed = true
end

-- 4. Set an expiration on the key to clean up memory
redis.call('PEXPIRE', key, window)

-- 5. Return the result
return { allowed, limit - (count + (allowed and 1 or 0)), now + window }
