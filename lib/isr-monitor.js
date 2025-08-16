/**
 * ISR (Incremental Static Regeneration) Monitoring Utility
 * Tracks cache performance and regeneration metrics
 */

const fs = require('fs').promises;
const path = require('path');

class ISRMonitor {
  constructor() {
    this.cacheDir = path.join(process.cwd(), '.next/cache');
    this.stats = {
      hits: 0,
      misses: 0,
      stale: 0,
      regenerations: 0,
      errors: 0,
      avgRegenerationTime: 0,
      regenerationTimes: [],
    };
    this.pageStats = new Map();
  }

  /**
   * Get cache status for a specific page
   */
  async getCacheStatus(pagePath) {
    try {
      // Normalize path
      const normalizedPath = pagePath.replace(/^\//, '').replace(/\/$/, '') || 'index';
      const cacheFile = path.join(this.cacheDir, 'fetch-cache', normalizedPath, 'cache.json');

      try {
        const stat = await fs.stat(cacheFile);
        const content = await fs.readFile(cacheFile, 'utf-8');
        const cache = JSON.parse(content);

        const age = Date.now() - stat.mtimeMs;
        const revalidate = cache.revalidate || 0;
        const isStale = revalidate > 0 && age > revalidate * 1000;

        return {
          exists: true,
          age: Math.round(age / 1000),
          ageFormatted: this.formatAge(age),
          isStale,
          revalidate,
          lastModified: stat.mtime,
          size: stat.size,
        };
      } catch (error) {
        // Try alternative cache location for ISR pages
        const altCacheFile = path.join(this.cacheDir, 'pages', normalizedPath + '.html');
        const stat = await fs.stat(altCacheFile);

        return {
          exists: true,
          age: Math.round((Date.now() - stat.mtimeMs) / 1000),
          ageFormatted: this.formatAge(Date.now() - stat.mtimeMs),
          lastModified: stat.mtime,
          size: stat.size,
          type: 'html',
        };
      }
    } catch (error) {
      return {
        exists: false,
        error: error.message,
      };
    }
  }

  /**
   * Format age in human-readable format
   */
  formatAge(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Log cache hit
   */
  logHit(pagePath, isStale = false) {
    this.stats.hits++;
    if (isStale) this.stats.stale++;

    // Update page-specific stats
    if (!this.pageStats.has(pagePath)) {
      this.pageStats.set(pagePath, { hits: 0, misses: 0, stale: 0 });
    }
    const pagestat = this.pageStats.get(pagePath);
    pagestat.hits++;
    if (isStale) pagestat.stale++;

    const timestamp = new Date().toISOString();
    console.log(
      `[ISR] ${timestamp} Cache HIT: ${pagePath} ${isStale ? '(stale, regenerating)' : ''}`
    );
  }

  /**
   * Log cache miss
   */
  logMiss(pagePath) {
    this.stats.misses++;

    // Update page-specific stats
    if (!this.pageStats.has(pagePath)) {
      this.pageStats.set(pagePath, { hits: 0, misses: 0, stale: 0 });
    }
    this.pageStats.get(pagePath).misses++;

    const timestamp = new Date().toISOString();
  }

  /**
   * Log regeneration completion
   */
  logRegeneration(pagePath, duration) {
    this.stats.regenerations++;
    this.stats.regenerationTimes.push(duration);

    // Calculate moving average
    const recentTimes = this.stats.regenerationTimes.slice(-100);
    this.stats.avgRegenerationTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;

    const timestamp = new Date().toISOString();
  }

  /**
   * Log error during regeneration
   */
  logError(pagePath, error) {
    this.stats.errors++;
    const timestamp = new Date().toISOString();
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ISR] ${timestamp} Error regenerating ${pagePath}:`, error);
    }
  }

  /**
   * Get overall statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    const staleRate = this.stats.hits > 0 ? (this.stats.stale / this.stats.hits) * 100 : 0;

    return {
      ...this.stats,
      hitRate: hitRate.toFixed(2) + '%',
      staleRate: staleRate.toFixed(2) + '%',
      avgRegenerationTime: Math.round(this.stats.avgRegenerationTime) + 'ms',
      totalRequests: total,
    };
  }

  /**
   * Get page-specific statistics
   */
  getPageStats(pagePath) {
    if (!this.pageStats.has(pagePath)) {
      return null;
    }

    const stats = this.pageStats.get(pagePath);
    const total = stats.hits + stats.misses;
    const hitRate = total > 0 ? (stats.hits / total) * 100 : 0;

    return {
      ...stats,
      hitRate: hitRate.toFixed(2) + '%',
      total,
    };
  }

  /**
   * Get top pages by hits
   */
  getTopPages(limit = 10) {
    const pages = Array.from(this.pageStats.entries())
      .map(([path, stats]) => ({
        path,
        ...stats,
        total: stats.hits + stats.misses,
      }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);

    return pages;
  }

  /**
   * Reset statistics
   */
  reset() {
    this.stats = {
      hits: 0,
      misses: 0,
      stale: 0,
      regenerations: 0,
      errors: 0,
      avgRegenerationTime: 0,
      regenerationTimes: [],
    };
    this.pageStats.clear();
  }

  /**
   * Export stats to JSON
   */
  async exportStats(filePath) {
    const stats = {
      overall: this.getStats(),
      topPages: this.getTopPages(20),
      allPages: Array.from(this.pageStats.entries()).map(([path, stats]) => ({
        path,
        ...stats,
      })),
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(stats, null, 2));
  }

  /**
   * Analyze cache directory
   */
  async analyzeCacheDir() {
    const analysis = {
      totalSize: 0,
      fileCount: 0,
      oldestFile: null,
      newestFile: null,
      pages: [],
    };

    try {
      const walkDir = async dir => {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
          const fullPath = path.join(dir, file.name);

          if (file.isDirectory()) {
            await walkDir(fullPath);
          } else {
            const stat = await fs.stat(fullPath);
            analysis.totalSize += stat.size;
            analysis.fileCount++;

            if (!analysis.oldestFile || stat.mtime < analysis.oldestFile.mtime) {
              analysis.oldestFile = { path: fullPath, mtime: stat.mtime };
            }

            if (!analysis.newestFile || stat.mtime > analysis.newestFile.mtime) {
              analysis.newestFile = { path: fullPath, mtime: stat.mtime };
            }

            if (file.name.endsWith('.html') || file.name.endsWith('.json')) {
              analysis.pages.push({
                path: fullPath.replace(this.cacheDir, ''),
                size: stat.size,
                age: this.formatAge(Date.now() - stat.mtimeMs),
                modified: stat.mtime,
              });
            }
          }
        }
      };

      await walkDir(this.cacheDir);

      // Sort pages by size
      analysis.pages.sort((a, b) => b.size - a.size);
      analysis.totalSizeFormatted = this.formatSize(analysis.totalSize);

      return analysis;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ISR] Cache analysis error:', error);
      }
      return { error: error.message };
    }
  }

  /**
   * Format size in human-readable format
   */
  formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

// Export singleton instance
module.exports = new ISRMonitor();
