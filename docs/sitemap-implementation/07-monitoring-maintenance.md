# Monitoring and Maintenance

## Comprehensive Monitoring Strategy

### Key Performance Indicators (KPIs)

| Metric                  | Target   | Warning  | Critical  | Action                 |
| ----------------------- | -------- | -------- | --------- | ---------------------- |
| Sitemap Generation Time | < 3s     | > 5s     | > 10s     | Optimize queries       |
| Cache Hit Rate          | > 80%    | < 70%    | < 50%     | Review cache strategy  |
| API Response Time       | < 200ms  | > 500ms  | > 1000ms  | Scale infrastructure   |
| Error Rate              | < 0.1%   | > 1%     | > 5%      | Investigate errors     |
| Indexation Rate         | > 90%    | < 80%    | < 60%     | Review content quality |
| Crawl Errors            | < 10/day | > 50/day | > 100/day | Fix broken URLs        |
| Memory Usage            | < 200MB  | > 300MB  | > 500MB   | Optimize memory usage  |
| URL Discovery Time      | < 24h    | > 48h    | > 72h     | Improve submission     |

## Real-time Monitoring Dashboard

### Monitoring Stack Implementation

```javascript
// lib/monitoring/MetricsCollector.js

const prometheus = require('prom-client');
const { StatsD } = require('node-statsd');

class MetricsCollector {
  constructor() {
    // Prometheus metrics
    this.register = new prometheus.Registry();

    // Counters
    this.sitemapGenerations = new prometheus.Counter({
      name: 'sitemap_generations_total',
      help: 'Total number of sitemap generations',
      labelNames: ['type', 'locale', 'status'],
      registers: [this.register],
    });

    this.apiRequests = new prometheus.Counter({
      name: 'api_requests_total',
      help: 'Total number of API requests',
      labelNames: ['endpoint', 'method', 'status'],
      registers: [this.register],
    });

    this.crawlErrors = new prometheus.Counter({
      name: 'crawl_errors_total',
      help: 'Total number of crawl errors',
      labelNames: ['type', 'url'],
      registers: [this.register],
    });

    // Gauges
    this.urlCount = new prometheus.Gauge({
      name: 'sitemap_url_count',
      help: 'Number of URLs in sitemap',
      labelNames: ['type', 'locale'],
      registers: [this.register],
    });

    this.cacheHitRate = new prometheus.Gauge({
      name: 'cache_hit_rate',
      help: 'Cache hit rate percentage',
      registers: [this.register],
    });

    this.indexationRate = new prometheus.Gauge({
      name: 'indexation_rate',
      help: 'Search engine indexation rate',
      labelNames: ['engine'],
      registers: [this.register],
    });

    // Histograms
    this.generationDuration = new prometheus.Histogram({
      name: 'sitemap_generation_duration_seconds',
      help: 'Sitemap generation duration in seconds',
      labelNames: ['type', 'locale'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.register],
    });

    this.apiResponseTime = new prometheus.Histogram({
      name: 'api_response_time_seconds',
      help: 'API response time in seconds',
      labelNames: ['endpoint'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.register],
    });

    // StatsD client for real-time metrics
    this.statsd = new StatsD({
      host: process.env.STATSD_HOST || 'localhost',
      port: process.env.STATSD_PORT || 8125,
      prefix: 'cdlhelp.sitemap.',
    });
  }

  // Track sitemap generation
  trackGeneration(type, locale, duration, urlCount, status = 'success') {
    this.sitemapGenerations.labels(type, locale, status).inc();
    this.generationDuration.labels(type, locale).observe(duration);
    this.urlCount.labels(type, locale).set(urlCount);

    // Send to StatsD
    this.statsd.timing(`generation.${type}.${locale}`, duration * 1000);
    this.statsd.gauge(`urls.${type}.${locale}`, urlCount);
  }

  // Track API requests
  trackApiRequest(endpoint, method, status, duration) {
    this.apiRequests.labels(endpoint, method, status).inc();
    this.apiResponseTime.labels(endpoint).observe(duration);

    this.statsd.increment(`api.${endpoint}.${status}`);
    this.statsd.timing(`api.${endpoint}.response_time`, duration * 1000);
  }

  // Track cache performance
  trackCacheHit(hit) {
    if (hit) {
      this.statsd.increment('cache.hit');
    } else {
      this.statsd.increment('cache.miss');
    }
  }

  // Track errors
  trackError(type, details) {
    this.crawlErrors.labels(type, details.url || 'unknown').inc();
    this.statsd.increment(`errors.${type}`);

    // Log to error tracking service
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(new Error(`${type}: ${JSON.stringify(details)}`));
    }
  }

  // Get metrics for Prometheus
  async getMetrics() {
    return this.register.metrics();
  }

  // Get current stats
  getStats() {
    return {
      generations: this.sitemapGenerations.hashMap,
      urlCounts: this.urlCount.hashMap,
      cacheHitRate: this.cacheHitRate.hashMap,
      errors: this.crawlErrors.hashMap,
    };
  }
}

module.exports = MetricsCollector;
```

### Grafana Dashboard Configuration

```json
// monitoring/grafana-dashboard.json

{
  "dashboard": {
    "title": "CDLHelp Sitemap Monitoring",
    "panels": [
      {
        "title": "Sitemap Generation Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(sitemap_generations_total[5m])",
            "legendFormat": "{{type}} - {{locale}}"
          }
        ]
      },
      {
        "title": "Generation Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sitemap_generation_duration_seconds)",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "URL Count by Type",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(sitemap_url_count) by (type)",
            "legendFormat": "{{type}}"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "cache_hit_rate",
            "format": "percent"
          }
        ]
      },
      {
        "title": "API Response Time",
        "type": "heatmap",
        "targets": [
          {
            "expr": "api_response_time_seconds",
            "format": "heatmap"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(crawl_errors_total[1h])",
            "legendFormat": "{{type}}"
          }
        ]
      },
      {
        "title": "Indexation Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "indexation_rate",
            "legendFormat": "{{engine}}"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "process_resident_memory_bytes",
            "legendFormat": "RSS Memory"
          }
        ]
      }
    ]
  }
}
```

## Automated Health Checks

### Health Check Implementation

```javascript
// lib/monitoring/HealthChecker.js

class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.registerDefaultChecks();
  }

  registerDefaultChecks() {
    // Database connectivity
    this.registerCheck('database', async () => {
      try {
        await db.query('SELECT 1');
        return { healthy: true };
      } catch (error) {
        return { healthy: false, error: error.message };
      }
    });

    // Redis connectivity
    this.registerCheck('redis', async () => {
      try {
        await redis.ping();
        return { healthy: true };
      } catch (error) {
        return { healthy: false, error: error.message };
      }
    });

    // Strapi API connectivity
    this.registerCheck('strapi', async () => {
      try {
        const response = await fetch(`${process.env.STRAPI_URL}/api/health`);
        return { healthy: response.ok };
      } catch (error) {
        return { healthy: false, error: error.message };
      }
    });

    // Sitemap generation capability
    this.registerCheck('sitemap-generation', async () => {
      try {
        const generator = new SitemapGenerator();
        const testUrls = await generator.generateTestUrls();
        return {
          healthy: testUrls.length > 0,
          urlCount: testUrls.length,
        };
      } catch (error) {
        return { healthy: false, error: error.message };
      }
    });

    // Memory usage
    this.registerCheck('memory', () => {
      const usage = process.memoryUsage();
      const heapUsedMB = usage.heapUsed / 1024 / 1024;

      return {
        healthy: heapUsedMB < 500,
        heapUsed: `${heapUsedMB.toFixed(2)} MB`,
        warning: heapUsedMB > 300,
      };
    });

    // Disk space
    this.registerCheck('disk-space', async () => {
      const diskSpace = await checkDiskSpace('/');
      const freeGB = diskSpace.free / 1024 / 1024 / 1024;

      return {
        healthy: freeGB > 1,
        freeSpace: `${freeGB.toFixed(2)} GB`,
        warning: freeGB < 5,
      };
    });
  }

  registerCheck(name, checkFn) {
    this.checks.set(name, checkFn);
  }

  async runAllChecks() {
    const results = {};
    const startTime = Date.now();

    for (const [name, checkFn] of this.checks) {
      try {
        results[name] = await checkFn();
      } catch (error) {
        results[name] = {
          healthy: false,
          error: error.message,
        };
      }
    }

    const overallHealth = Object.values(results).every(r => r.healthy);
    const duration = Date.now() - startTime;

    return {
      status: overallHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      checks: results,
    };
  }

  async runCheck(name) {
    const checkFn = this.checks.get(name);

    if (!checkFn) {
      throw new Error(`Health check '${name}' not found`);
    }

    return await checkFn();
  }
}

// API endpoint
app.get('/api/health', async (req, res) => {
  const checker = new HealthChecker();
  const results = await checker.runAllChecks();

  const statusCode = results.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(results);
});

app.get('/api/health/:check', async (req, res) => {
  const checker = new HealthChecker();

  try {
    const result = await checker.runCheck(req.params.check);
    const statusCode = result.healthy ? 200 : 503;
    res.status(statusCode).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
```

## Alert System

### Alert Configuration

```javascript
// lib/monitoring/AlertManager.js

class AlertManager {
  constructor() {
    this.channels = new Map();
    this.thresholds = this.loadThresholds();
    this.alertHistory = [];
    this.setupChannels();
  }

  loadThresholds() {
    return {
      generationTime: {
        warning: 5000, // 5 seconds
        critical: 10000, // 10 seconds
      },
      errorRate: {
        warning: 0.01, // 1%
        critical: 0.05, // 5%
      },
      indexationRate: {
        warning: 0.8, // 80%
        critical: 0.6, // 60%
      },
      memoryUsage: {
        warning: 300 * 1024 * 1024, // 300MB
        critical: 500 * 1024 * 1024, // 500MB
      },
      cacheHitRate: {
        warning: 0.7, // 70%
        critical: 0.5, // 50%
      },
    };
  }

  setupChannels() {
    // Slack integration
    this.channels.set('slack', {
      send: async alert => {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 *${alert.severity.toUpperCase()}*: ${alert.title}`,
            attachments: [
              {
                color: alert.severity === 'critical' ? 'danger' : 'warning',
                fields: [
                  { title: 'Metric', value: alert.metric, short: true },
                  { title: 'Value', value: alert.value, short: true },
                  { title: 'Threshold', value: alert.threshold, short: true },
                  { title: 'Time', value: alert.timestamp, short: true },
                ],
                text: alert.description,
              },
            ],
          }),
        });
      },
    });

    // Email integration
    this.channels.set('email', {
      send: async alert => {
        await sendEmail({
          to: process.env.ALERT_EMAIL,
          subject: `[${alert.severity.toUpperCase()}] Sitemap Alert: ${alert.title}`,
          html: this.formatEmailAlert(alert),
        });
      },
    });

    // PagerDuty integration
    this.channels.set('pagerduty', {
      send: async alert => {
        if (alert.severity !== 'critical') return;

        await fetch('https://events.pagerduty.com/v2/enqueue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token token=${process.env.PAGERDUTY_TOKEN}`,
          },
          body: JSON.stringify({
            routing_key: process.env.PAGERDUTY_ROUTING_KEY,
            event_action: 'trigger',
            payload: {
              summary: alert.title,
              severity: 'error',
              source: 'sitemap-monitor',
              custom_details: {
                metric: alert.metric,
                value: alert.value,
                threshold: alert.threshold,
                description: alert.description,
              },
            },
          }),
        });
      },
    });

    // SMS integration (Twilio)
    this.channels.set('sms', {
      send: async alert => {
        if (alert.severity !== 'critical') return;

        const client = require('twilio')(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
          body: `CRITICAL: ${alert.title} - ${alert.metric}: ${alert.value}`,
          from: process.env.TWILIO_PHONE,
          to: process.env.ALERT_PHONE,
        });
      },
    });
  }

  async checkThresholds(metrics) {
    const alerts = [];

    // Check generation time
    if (metrics.generationTime > this.thresholds.generationTime.critical) {
      alerts.push(
        this.createAlert('critical', 'Slow Sitemap Generation', {
          metric: 'generationTime',
          value: `${metrics.generationTime}ms`,
          threshold: `${this.thresholds.generationTime.critical}ms`,
          description: 'Sitemap generation is taking too long',
        })
      );
    } else if (metrics.generationTime > this.thresholds.generationTime.warning) {
      alerts.push(
        this.createAlert('warning', 'Slow Sitemap Generation', {
          metric: 'generationTime',
          value: `${metrics.generationTime}ms`,
          threshold: `${this.thresholds.generationTime.warning}ms`,
          description: 'Sitemap generation is slower than expected',
        })
      );
    }

    // Check error rate
    if (metrics.errorRate > this.thresholds.errorRate.critical) {
      alerts.push(
        this.createAlert('critical', 'High Error Rate', {
          metric: 'errorRate',
          value: `${(metrics.errorRate * 100).toFixed(2)}%`,
          threshold: `${(this.thresholds.errorRate.critical * 100).toFixed(2)}%`,
          description: 'Error rate has exceeded critical threshold',
        })
      );
    }

    // Check indexation rate
    if (metrics.indexationRate < this.thresholds.indexationRate.critical) {
      alerts.push(
        this.createAlert('critical', 'Low Indexation Rate', {
          metric: 'indexationRate',
          value: `${(metrics.indexationRate * 100).toFixed(2)}%`,
          threshold: `${(this.thresholds.indexationRate.critical * 100).toFixed(2)}%`,
          description: 'Search engines are not indexing enough pages',
        })
      );
    }

    // Process alerts
    for (const alert of alerts) {
      await this.sendAlert(alert);
    }

    return alerts;
  }

  createAlert(severity, title, details) {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      severity,
      title,
      timestamp: new Date().toISOString(),
      ...details,
    };
  }

  async sendAlert(alert) {
    // Check if alert was recently sent (deduplication)
    const recentAlert = this.alertHistory.find(
      a => a.title === alert.title && Date.now() - new Date(a.timestamp).getTime() < 3600000 // 1 hour
    );

    if (recentAlert) {
      console.log(`Alert deduplicated: ${alert.title}`);
      return;
    }

    // Send to all configured channels
    const promises = [];

    for (const [name, channel] of this.channels) {
      promises.push(
        channel.send(alert).catch(err => {
          console.error(`Failed to send alert to ${name}:`, err);
        })
      );
    }

    await Promise.all(promises);

    // Add to history
    this.alertHistory.push(alert);

    // Keep only last 100 alerts
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(-100);
    }
  }

  formatEmailAlert(alert) {
    return `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: ${alert.severity === 'critical' ? '#d32f2f' : '#f57c00'};">
            ${alert.severity.toUpperCase()}: ${alert.title}
          </h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Metric</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.metric}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Value</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.value}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Threshold</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.threshold}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${alert.timestamp}</td>
            </tr>
          </table>
          <p>${alert.description}</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            This is an automated alert from CDLHelp Sitemap Monitoring System.
          </p>
        </body>
      </html>
    `;
  }
}
```

## Maintenance Procedures

### Automated Maintenance Tasks

```javascript
// lib/maintenance/MaintenanceScheduler.js

const cron = require('node-cron');

class MaintenanceScheduler {
  constructor() {
    this.tasks = new Map();
    this.setupTasks();
  }

  setupTasks() {
    // Daily tasks
    this.scheduleTask('daily-cleanup', '0 2 * * *', async () => {
      await this.cleanupOldSitemaps();
      await this.cleanupLogs();
      await this.optimizeDatabase();
    });

    // Weekly tasks
    this.scheduleTask('weekly-validation', '0 3 * * 0', async () => {
      await this.validateAllSitemaps();
      await this.checkBrokenLinks();
      await this.generateReport();
    });

    // Hourly tasks
    this.scheduleTask('hourly-sync', '0 * * * *', async () => {
      await this.syncWithSearchConsole();
      await this.updateIndexationStats();
      await this.checkHealthStatus();
    });

    // Every 6 hours
    this.scheduleTask('regenerate-dynamic', '0 */6 * * *', async () => {
      await this.regenerateDynamicSitemaps();
      await this.warmupCache();
    });
  }

  scheduleTask(name, schedule, taskFn) {
    const task = cron.schedule(schedule, async () => {
      console.log(`Starting maintenance task: ${name}`);
      const startTime = Date.now();

      try {
        await taskFn();
        const duration = Date.now() - startTime;
        console.log(`Completed ${name} in ${duration}ms`);

        // Track success
        metrics.trackMaintenanceTask(name, 'success', duration);
      } catch (error) {
        console.error(`Failed ${name}:`, error);

        // Track failure
        metrics.trackMaintenanceTask(name, 'failure', Date.now() - startTime);

        // Send alert
        await alertManager.sendAlert({
          severity: 'warning',
          title: `Maintenance Task Failed: ${name}`,
          description: error.message,
        });
      }
    });

    this.tasks.set(name, task);
    return task;
  }

  async cleanupOldSitemaps() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days old

    // Delete old generated files
    const oldFiles = await db.query('SELECT * FROM sitemap_metadata WHERE created_at < $1', [
      cutoffDate,
    ]);

    for (const file of oldFiles.rows) {
      await fs.unlink(file.file_path).catch(() => {});
      await db.query('DELETE FROM sitemap_metadata WHERE id = $1', [file.id]);
    }

    console.log(`Cleaned up ${oldFiles.rows.length} old sitemap files`);
  }

  async cleanupLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 days old

    const result = await db.query('DELETE FROM sitemap_generation_logs WHERE created_at < $1', [
      cutoffDate,
    ]);

    console.log(`Cleaned up ${result.rowCount} old log entries`);
  }

  async optimizeDatabase() {
    // Vacuum and analyze PostgreSQL tables
    await db.query('VACUUM ANALYZE sitemap_metadata');
    await db.query('VACUUM ANALYZE sitemap_urls');
    await db.query('VACUUM ANALYZE sitemap_hreflang');
    await db.query('VACUUM ANALYZE sitemap_generation_logs');

    // Rebuild indexes if needed
    const indexStats = await db.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
    `);

    for (const index of indexStats.rows) {
      if (index.idx_scan === 0 && index.idx_tup_read === 0) {
        console.log(`Dropping unused index: ${index.indexname}`);
        await db.query(`DROP INDEX IF EXISTS ${index.indexname}`);
      }
    }
  }

  async validateAllSitemaps() {
    const validator = new SitemapValidator();
    const sitemaps = await db.query('SELECT * FROM sitemap_metadata');

    const results = {
      total: sitemaps.rows.length,
      valid: 0,
      invalid: 0,
      errors: [],
    };

    for (const sitemap of sitemaps.rows) {
      const validation = await validator.validateSitemap(sitemap.url);

      if (validation.valid) {
        results.valid++;
      } else {
        results.invalid++;
        results.errors.push({
          sitemap: sitemap.url,
          errors: validation.errors,
        });
      }
    }

    // Store validation results
    await db.query('INSERT INTO validation_reports (date, results) VALUES ($1, $2)', [
      new Date(),
      JSON.stringify(results),
    ]);

    return results;
  }

  async checkBrokenLinks() {
    const urls = await db.query('SELECT DISTINCT loc FROM sitemap_urls');
    const brokenLinks = [];

    // Check URLs in batches
    const batchSize = 10;
    for (let i = 0; i < urls.rows.length; i += batchSize) {
      const batch = urls.rows.slice(i, i + batchSize);

      const checks = batch.map(async url => {
        try {
          const response = await fetch(url.loc, { method: 'HEAD' });

          if (!response.ok) {
            brokenLinks.push({
              url: url.loc,
              status: response.status,
            });
          }
        } catch (error) {
          brokenLinks.push({
            url: url.loc,
            error: error.message,
          });
        }
      });

      await Promise.all(checks);
    }

    if (brokenLinks.length > 0) {
      await alertManager.sendAlert({
        severity: 'warning',
        title: 'Broken Links Found',
        description: `Found ${brokenLinks.length} broken links in sitemaps`,
        links: brokenLinks.slice(0, 10), // First 10
      });
    }

    return brokenLinks;
  }

  async regenerateDynamicSitemaps() {
    const generator = new SitemapGenerator();

    // Regenerate blog sitemap
    await generator.generateBlogSitemap();

    // Regenerate school sitemap
    await generator.generateSchoolSitemap();

    // Regenerate company sitemap
    await generator.generateCompanySitemap();

    console.log('Dynamic sitemaps regenerated');
  }

  async warmupCache() {
    const cache = new CacheManager();
    const criticalUrls = [
      '/api/sitemap',
      '/api/sitemap/static?locale=en',
      '/api/sitemap/blog',
      '/api/sitemap/schools',
    ];

    for (const url of criticalUrls) {
      try {
        const response = await fetch(`${process.env.BASE_URL}${url}`);
        const content = await response.text();

        await cache.set(`sitemap:${url}`, content, 3600);
        console.log(`Cached: ${url}`);
      } catch (error) {
        console.error(`Failed to warmup cache for ${url}:`, error);
      }
    }
  }

  async syncWithSearchConsole() {
    const searchConsole = new SearchConsoleAPI();

    // Get latest sitemap stats
    const stats = await searchConsole.getSitemapStats();

    // Update local metrics
    for (const sitemap of stats.sitemaps) {
      await db.query(
        `UPDATE sitemap_metadata 
         SET indexed_count = $1, submitted_count = $2, last_crawled = $3
         WHERE url = $4`,
        [sitemap.indexed, sitemap.submitted, sitemap.lastCrawled, sitemap.url]
      );

      // Calculate and store indexation rate
      const indexationRate = sitemap.submitted > 0 ? sitemap.indexed / sitemap.submitted : 0;

      metrics.indexationRate.set(indexationRate, { engine: 'google' });
    }
  }

  async generateReport() {
    const report = {
      date: new Date().toISOString(),
      sitemaps: await this.getSitemapStats(),
      performance: await this.getPerformanceStats(),
      errors: await this.getErrorStats(),
      indexation: await this.getIndexationStats(),
    };

    // Save report
    await db.query('INSERT INTO weekly_reports (date, report) VALUES ($1, $2)', [
      new Date(),
      JSON.stringify(report),
    ]);

    // Send report via email
    await sendEmail({
      to: process.env.REPORT_EMAIL,
      subject: 'Weekly Sitemap Report',
      html: this.formatReport(report),
    });

    return report;
  }

  formatReport(report) {
    // Format report as HTML email
    return `
      <html>
        <head>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .metric { font-weight: bold; }
            .good { color: green; }
            .warning { color: orange; }
            .bad { color: red; }
          </style>
        </head>
        <body>
          <h1>Weekly Sitemap Report</h1>
          <p>Report Date: ${report.date}</p>
          
          <h2>Sitemap Statistics</h2>
          <table>
            <tr>
              <th>Sitemap</th>
              <th>URLs</th>
              <th>Last Generated</th>
              <th>Size</th>
            </tr>
            ${report.sitemaps
              .map(
                s => `
              <tr>
                <td>${s.type}</td>
                <td>${s.urlCount}</td>
                <td>${s.lastGenerated}</td>
                <td>${s.size}</td>
              </tr>
            `
              )
              .join('')}
          </table>
          
          <h2>Performance Metrics</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>Average Generation Time</td>
              <td>${report.performance.avgGenerationTime}ms</td>
              <td class="${report.performance.avgGenerationTime < 3000 ? 'good' : 'warning'}">
                ${report.performance.avgGenerationTime < 3000 ? '✓' : '⚠'}
              </td>
            </tr>
            <tr>
              <td>Cache Hit Rate</td>
              <td>${report.performance.cacheHitRate}%</td>
              <td class="${report.performance.cacheHitRate > 80 ? 'good' : 'warning'}">
                ${report.performance.cacheHitRate > 80 ? '✓' : '⚠'}
              </td>
            </tr>
          </table>
          
          <h2>Indexation Stats</h2>
          <table>
            <tr>
              <th>Search Engine</th>
              <th>Submitted</th>
              <th>Indexed</th>
              <th>Rate</th>
            </tr>
            ${report.indexation
              .map(
                i => `
              <tr>
                <td>${i.engine}</td>
                <td>${i.submitted}</td>
                <td>${i.indexed}</td>
                <td class="${i.rate > 80 ? 'good' : 'warning'}">${i.rate}%</td>
              </tr>
            `
              )
              .join('')}
          </table>
          
          <h2>Error Summary</h2>
          <p>Total Errors This Week: <span class="metric">${report.errors.total}</span></p>
          ${
            report.errors.total > 0
              ? `
            <table>
              <tr>
                <th>Error Type</th>
                <th>Count</th>
              </tr>
              ${report.errors.byType
                .map(
                  e => `
                <tr>
                  <td>${e.type}</td>
                  <td>${e.count}</td>
                </tr>
              `
                )
                .join('')}
            </table>
          `
              : '<p class="good">No errors detected!</p>'
          }
        </body>
      </html>
    `;
  }

  // Manual maintenance endpoints
  async runManualTask(taskName) {
    const task = this.tasks.get(taskName);

    if (!task) {
      throw new Error(`Task ${taskName} not found`);
    }

    // Run the task immediately
    task.now();
  }

  stopAllTasks() {
    for (const [name, task] of this.tasks) {
      task.stop();
      console.log(`Stopped task: ${name}`);
    }
  }

  startAllTasks() {
    for (const [name, task] of this.tasks) {
      task.start();
      console.log(`Started task: ${name}`);
    }
  }
}

module.exports = MaintenanceScheduler;
```

## Disaster Recovery

### Backup and Restore Procedures

```bash
#!/bin/bash
# scripts/backup-sitemaps.sh

#!/bin/bash

set -e

# Configuration
BACKUP_DIR="/backups/sitemaps"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="sitemap_backup_${TIMESTAMP}"

# Create backup directory
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"

# Backup database
echo "Backing up database..."
pg_dump $DATABASE_URL > "${BACKUP_DIR}/${BACKUP_NAME}/database.sql"

# Backup generated sitemaps
echo "Backing up sitemap files..."
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}/sitemaps.tar.gz" /var/www/sitemaps/

# Backup configuration
echo "Backing up configuration..."
cp -r /app/config "${BACKUP_DIR}/${BACKUP_NAME}/"

# Create manifest
cat > "${BACKUP_DIR}/${BACKUP_NAME}/manifest.json" << EOF
{
  "timestamp": "${TIMESTAMP}",
  "version": "$(git rev-parse HEAD)",
  "files": [
    "database.sql",
    "sitemaps.tar.gz",
    "config/"
  ]
}
EOF

# Upload to S3 (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
  echo "Uploading to S3..."
  aws s3 sync "${BACKUP_DIR}/${BACKUP_NAME}" "s3://${AWS_S3_BUCKET}/backups/${BACKUP_NAME}/"
fi

# Clean old backups (keep last 30 days)
find "${BACKUP_DIR}" -type d -mtime +30 -exec rm -rf {} \;

echo "Backup completed: ${BACKUP_NAME}"
```

## Documentation and Runbooks

### Incident Response Runbook

```markdown
# Sitemap System Incident Response Runbook

## Critical Alerts

### 1. Sitemap Generation Failure

**Symptoms:**

- Sitemap generation returns errors
- Generation time exceeds 30 seconds
- Empty sitemaps generated

**Investigation Steps:**

1. Check application logs: `kubectl logs -f deployment/sitemap-service`
2. Check Strapi API status: `curl $STRAPI_URL/api/health`
3. Check database connectivity: `psql $DATABASE_URL -c "SELECT 1"`
4. Check memory usage: `kubectl top pods -l app=sitemap`

**Resolution:**

1. Restart sitemap service: `kubectl rollout restart deployment/sitemap-service`
2. Clear cache: `redis-cli FLUSHDB`
3. Regenerate sitemaps manually: `curl -X POST /api/sitemap/regenerate`
4. If Strapi is down, use cached data: Enable fallback mode

### 2. High Error Rate

**Symptoms:**

- Error rate > 5%
- Multiple failed URL checks
- Crawl errors increasing

**Investigation Steps:**

1. Check error logs: `grep ERROR /var/log/sitemap.log`
2. Identify error patterns: `kubectl logs deployment/sitemap-service | grep -E "ERROR|WARN"`
3. Check external service status (Strapi, Redis, Database)

**Resolution:**

1. Identify and fix root cause
2. Clear error queue: `redis-cli DEL error:queue`
3. Retry failed operations
4. Update error handling if needed

### 3. Low Indexation Rate

**Symptoms:**

- Indexation rate < 60%
- Search Console errors
- Pages not appearing in search results

**Investigation Steps:**

1. Check Search Console for errors
2. Validate sitemap XML: `curl /api/sitemap | xmllint --noout -`
3. Check robots.txt configuration
4. Verify URL accessibility

**Resolution:**

1. Fix any XML validation errors
2. Submit sitemap to Search Console manually
3. Check and fix broken links
4. Review and update content quality

## Standard Operating Procedures

### Daily Checks

- [ ] Review monitoring dashboard
- [ ] Check alert queue
- [ ] Verify sitemap generation succeeded
- [ ] Review error logs

### Weekly Maintenance

- [ ] Validate all sitemaps
- [ ] Check broken links
- [ ] Review performance metrics
- [ ] Update documentation

### Monthly Review

- [ ] Analyze indexation trends
- [ ] Review and optimize generation performance
- [ ] Update alert thresholds if needed
- [ ] Security patches and updates
```

## Conclusion

This comprehensive monitoring and maintenance system ensures:

1. **Real-time visibility** into sitemap performance
2. **Proactive alerting** for issues
3. **Automated maintenance** tasks
4. **Quick incident response** procedures
5. **Continuous optimization** based on metrics
6. **Reliable disaster recovery** capabilities

The system is designed to be self-healing where possible and provides clear escalation paths when manual intervention is required.
