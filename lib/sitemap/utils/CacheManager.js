/**
 * Cache manager for sitemap generation
 * Uses in-memory cache with optional Redis support
 */

class CacheManager {
  constructor(config = {}) {
    this.cache = new Map();
    this.ttlMap = new Map();
    this.defaultTTL = config.defaultTTL || 3600; // 1 hour default
    this.maxSize = config.maxSize || 100; // Max cache entries
    this.useRedis = config.useRedis || false;

    // Redis client would be initialized here if needed
    if (this.useRedis && config.redisClient) {
      this.redis = config.redisClient;
    }
  }

  /**
   * Get value from cache
   */
  async get(key) {
    // Check if Redis is available
    if (this.redis) {
      try {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      } catch (error) {
        console.error('Redis get error:', error);
      }
    }

    // Check in-memory cache
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      const ttl = this.ttlMap.get(key);

      // Check if expired
      if (ttl && Date.now() > ttl) {
        this.cache.delete(key);
        this.ttlMap.delete(key);
        return null;
      }

      return entry;
    }

    return null;
  }

  /**
   * Set value in cache
   */
  async set(key, value, ttl = null) {
    const expireTime = ttl || this.defaultTTL;
    const expiresAt = Date.now() + expireTime * 1000;

    // Save to Redis if available
    if (this.redis) {
      try {
        await this.redis.setex(key, expireTime, JSON.stringify(value));
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }

    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.ttlMap.delete(firstKey);
    }

    // Save to in-memory cache
    this.cache.set(key, value);
    this.ttlMap.set(key, expiresAt);

    return true;
  }

  /**
   * Delete value from cache
   */
  async delete(key) {
    // Delete from Redis if available
    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch (error) {
        console.error('Redis delete error:', error);
      }
    }

    // Delete from in-memory cache
    this.cache.delete(key);
    this.ttlMap.delete(key);

    return true;
  }

  /**
   * Clear all cache
   */
  async clear() {
    // Clear Redis if available
    if (this.redis) {
      try {
        await this.redis.flushdb();
      } catch (error) {
        console.error('Redis clear error:', error);
      }
    }

    // Clear in-memory cache
    this.cache.clear();
    this.ttlMap.clear();

    return true;
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidate(pattern) {
    const keysToDelete = [];

    // Find matching keys
    for (const key of this.cache.keys()) {
      if (this.matchesPattern(key, pattern)) {
        keysToDelete.push(key);
      }
    }

    // Delete matching keys
    for (const key of keysToDelete) {
      await this.delete(key);
    }

    // If Redis is available, invalidate there too
    if (this.redis) {
      try {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } catch (error) {
        console.error('Redis invalidate error:', error);
      }
    }

    return keysToDelete.length;
  }

  /**
   * Check if key matches pattern (simple glob matching)
   */
  matchesPattern(key, pattern) {
    // Convert glob pattern to regex
    const regex = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]');

    return new RegExp(`^${regex}$`).test(key);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let validCount = 0;

    for (const [key, ttl] of this.ttlMap.entries()) {
      if (now > ttl) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expired: expiredCount,
      valid: validCount,
      hitRate: this.calculateHitRate(),
    };
  }

  /**
   * Calculate cache hit rate
   */
  calculateHitRate() {
    if (!this.hits && !this.misses) {
      this.hits = 0;
      this.misses = 0;
    }

    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  }

  /**
   * Track cache hit
   */
  trackHit() {
    if (!this.hits) this.hits = 0;
    this.hits++;
  }

  /**
   * Track cache miss
   */
  trackMiss() {
    if (!this.misses) this.misses = 0;
    this.misses++;
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, ttl] of this.ttlMap.entries()) {
      if (now > ttl) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
      this.ttlMap.delete(key);
    }

    return keysToDelete.length;
  }

  /**
   * Warm up cache with predefined keys
   */
  async warmup(keys) {
    const results = [];

    for (const { key, fetcher, ttl } of keys) {
      try {
        const value = await fetcher();
        await this.set(key, value, ttl);
        results.push({ key, success: true });
      } catch (error) {
        console.error(`Failed to warmup cache for ${key}:`, error);
        results.push({ key, success: false, error: error.message });
      }
    }

    return results;
  }
}

module.exports = CacheManager;
