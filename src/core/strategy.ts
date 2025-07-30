export interface RateLimiterResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

export interface RateLimitStrategy {
  limit(identifier: string): Promise<RateLimiterResult>;
}
