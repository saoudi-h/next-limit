-- Sliding window rate limiter script
-- KEYS[1]: The key for the sorted set (e.g., ratelimit:sliding-window:user123)
-- KEYS[1] - The unique key for the sorted set (e.g., 'rate-limit:sliding-window:user123').
-- ARGV[1] - The current timestamp in milliseconds ('now').
-- ARGV[2] - The duration of the time window in milliseconds ('windowMs').
-- ARGV[3] - The maximum number of requests allowed within the window ('limit').
-- ARGV[4] - A random value to ensure the uniqueness of the member in the sorted set.
--
-- Returns a table with three values:
-- 1. allowed: 1 if the request is permitted, 0 otherwise.
-- 2. remaining: The number of requests left in the current window.
-- 3. reset: The timestamp (in milliseconds) when the rate limit will reset.

local key = KEYS[1]
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local random = ARGV[4]

-- The start of the sliding window.
local windowStart = now - windowMs

-- Remove all timestamps from the sorted set that are older than the window's start time.
redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)

-- Get the number of requests in the current window.
local currentRequests = redis.call('ZCARD', key)

-- Check if the current number of requests has reached the limit.
if currentRequests >= limit then
    -- Limit reached, deny the request.
    -- The reset time is the expiration time of the oldest request in the window.
    local oldestRequest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')[2]
    local resetTime = (oldestRequest or now) + windowMs
    return { 0, 0, resetTime }
end

-- If the limit is not reached, add the current request's timestamp to the sorted set.
-- The member is a combination of the timestamp and a random value to ensure uniqueness.
redis.call('ZADD', key, now, now .. ':' .. random)

-- Set an expiration for the key to the window size. This is a fallback.
redis.call('PEXPIRE', key, windowMs)

-- Calculate the remaining requests.
local remaining = limit - (currentRequests + 1)

-- The reset time is the expiration time of the oldest request in the window.
local oldestRequest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')[2]
local resetTime = (oldestRequest or now) + windowMs

return { 1, remaining, resetTime }

