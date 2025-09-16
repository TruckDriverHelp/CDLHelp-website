# Technical Specifications

## XML Sitemap Format Specifications

### Standard Sitemap Protocol

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://www.cdlhelp.com/page</loc>
    <lastmod>2024-01-15T12:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <!-- Hreflang annotations -->
    <xhtml:link rel="alternate" hreflang="en" href="https://www.cdlhelp.com/page"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://www.cdlhelp.com/ru/page"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.cdlhelp.com/page"/>
  </url>
</urlset>
```

### Sitemap Index Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.cdlhelp.com/sitemap-static-en.xml</loc>
    <lastmod>2024-01-15T12:00:00+00:00</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cdlhelp.com/sitemap-blog.xml</loc>
    <lastmod>2024-01-15T12:00:00+00:00</lastmod>
  </sitemap>
</sitemapindex>
```

## Technical Requirements

### File Size Limitations

| Constraint             | Limit    | Safety Margin | Implementation    |
| ---------------------- | -------- | ------------- | ----------------- |
| URLs per sitemap       | 50,000   | 45,000        | Auto-split at 45k |
| File size uncompressed | 50MB     | 45MB          | Stream generation |
| File size compressed   | 10MB     | 9MB           | GZIP compression  |
| Sitemap index entries  | No limit | 1,000         | Logical grouping  |

### URL Requirements

```javascript
// lib/sitemap/UrlValidator.js

class UrlValidator {
  constructor() {
    this.rules = {
      maxLength: 2048,
      allowedProtocols: ['https'],
      requiredElements: ['protocol', 'host', 'path'],
      forbiddenCharacters: ['<', '>', '"', '{', '}', '|', '\\', '^', '`'],
    };
  }

  validate(url) {
    const errors = [];

    // Length check
    if (url.length > this.rules.maxLength) {
      errors.push(`URL exceeds maximum length of ${this.rules.maxLength} characters`);
    }

    // Protocol check
    const urlObj = new URL(url);
    if (!this.rules.allowedProtocols.includes(urlObj.protocol.slice(0, -1))) {
      errors.push(`Protocol must be one of: ${this.rules.allowedProtocols.join(', ')}`);
    }

    // Forbidden characters check
    this.rules.forbiddenCharacters.forEach(char => {
      if (url.includes(char)) {
        errors.push(`URL contains forbidden character: ${char}`);
      }
    });

    // Entity escaping
    const escaped = this.escapeUrl(url);
    if (escaped !== url) {
      errors.push('URL contains unescaped entities');
    }

    return {
      valid: errors.length === 0,
      errors,
      escaped,
    };
  }

  escapeUrl(url) {
    return url
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&apos;')
      .replace(/"/g, '&quot;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;');
  }
}
```

### Date Format Specifications

```javascript
// lib/sitemap/DateFormatter.js

class DateFormatter {
  constructor() {
    this.formats = {
      w3c: 'YYYY-MM-DDTHH:mm:ss+00:00',
      iso8601: 'YYYY-MM-DDTHH:mm:ssZ',
      simple: 'YYYY-MM-DD',
    };
  }

  format(date, format = 'w3c') {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
      throw new Error('Invalid date provided');
    }

    switch (format) {
      case 'w3c':
        return this.toW3C(d);
      case 'iso8601':
        return d.toISOString();
      case 'simple':
        return this.toSimple(d);
      default:
        return this.toW3C(d);
    }
  }

  toW3C(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
  }

  toSimple(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  parseLastmod(lastmod) {
    // Accept various formats and normalize
    const formats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, // ISO 8601
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/, // W3C with timezone
    ];

    for (const format of formats) {
      if (format.test(lastmod)) {
        return new Date(lastmod);
      }
    }

    throw new Error(`Invalid lastmod format: ${lastmod}`);
  }
}
```

## Performance Specifications

### Generation Performance Targets

| Operation                  | Target  | Maximum | Optimization        |
| -------------------------- | ------- | ------- | ------------------- |
| Static sitemap             | < 1s    | 3s      | Pre-generation      |
| Dynamic sitemap (1k URLs)  | < 2s    | 5s      | Caching             |
| Dynamic sitemap (10k URLs) | < 5s    | 10s     | Streaming           |
| Full regeneration          | < 30s   | 60s     | Parallel processing |
| Cache retrieval            | < 100ms | 500ms   | Redis/Memory        |

### Memory Management

```javascript
// lib/sitemap/MemoryManager.js

class MemoryManager {
  constructor() {
    this.thresholds = {
      warning: 100 * 1024 * 1024, // 100MB
      critical: 200 * 1024 * 1024, // 200MB
      max: 500 * 1024 * 1024, // 500MB
    };
    this.checkInterval = 1000; // Check every second
    this.monitoring = false;
  }

  startMonitoring() {
    this.monitoring = true;
    this.monitorInterval = setInterval(() => {
      const usage = process.memoryUsage();
      this.checkMemoryUsage(usage);
    }, this.checkInterval);
  }

  stopMonitoring() {
    this.monitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }

  checkMemoryUsage(usage) {
    const heapUsed = usage.heapUsed;

    if (heapUsed > this.thresholds.max) {
      this.handleMaxMemory();
    } else if (heapUsed > this.thresholds.critical) {
      this.handleCriticalMemory();
    } else if (heapUsed > this.thresholds.warning) {
      this.handleWarningMemory();
    }
  }

  handleMaxMemory() {
    console.error('Maximum memory threshold exceeded');
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    // Implement emergency measures
    throw new Error('Memory limit exceeded - aborting operation');
  }

  handleCriticalMemory() {
    console.warn('Critical memory threshold reached');
    // Clear caches
    this.clearCaches();
    // Reduce batch sizes
    this.reduceBatchSizes();
  }

  handleWarningMemory() {
    console.log('Warning memory threshold reached');
    // Log metrics
    this.logMemoryMetrics();
  }

  clearCaches() {
    // Clear in-memory caches
    if (global.cacheManager) {
      global.cacheManager.clearMemory();
    }
  }

  reduceBatchSizes() {
    // Reduce batch processing sizes
    if (global.batchConfig) {
      global.batchConfig.size = Math.floor(global.batchConfig.size / 2);
    }
  }

  logMemoryMetrics() {
    const usage = process.memoryUsage();
    console.log('Memory Usage:', {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`,
    });
  }
}
```

## Database Schema

### PostgreSQL Schema for Sitemap Data

```sql
-- Sitemap metadata table
CREATE TABLE sitemap_metadata (
  id SERIAL PRIMARY KEY,
  sitemap_type VARCHAR(50) NOT NULL,
  locale VARCHAR(10),
  url VARCHAR(255) NOT NULL UNIQUE,
  last_generated TIMESTAMP WITH TIME ZONE,
  generation_time_ms INTEGER,
  url_count INTEGER,
  file_size_bytes INTEGER,
  is_compressed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- URL entries table
CREATE TABLE sitemap_urls (
  id SERIAL PRIMARY KEY,
  sitemap_id INTEGER REFERENCES sitemap_metadata(id) ON DELETE CASCADE,
  loc VARCHAR(2048) NOT NULL,
  lastmod TIMESTAMP WITH TIME ZONE,
  changefreq VARCHAR(20),
  priority DECIMAL(2,1),
  locale VARCHAR(10),
  content_type VARCHAR(50),
  content_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sitemap_urls_sitemap_id (sitemap_id),
  INDEX idx_sitemap_urls_locale (locale),
  INDEX idx_sitemap_urls_content_type (content_type)
);

-- Hreflang relationships table
CREATE TABLE sitemap_hreflang (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES sitemap_urls(id) ON DELETE CASCADE,
  hreflang VARCHAR(10) NOT NULL,
  href VARCHAR(2048) NOT NULL,
  INDEX idx_sitemap_hreflang_url_id (url_id)
);

-- Generation logs table
CREATE TABLE sitemap_generation_logs (
  id SERIAL PRIMARY KEY,
  sitemap_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  urls_processed INTEGER,
  errors TEXT[],
  warnings TEXT[],
  metadata JSONB
);

-- Cache table
CREATE TABLE sitemap_cache (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sitemap_cache_expires (expires_at)
);
```

## API Specifications

### RESTful Endpoints

```yaml
openapi: 3.0.0
info:
  title: CDLHelp Sitemap API
  version: 1.0.0

paths:
  /api/sitemap:
    get:
      summary: Get sitemap index
      responses:
        200:
          description: Sitemap index XML
          content:
            application/xml:
              schema:
                type: string
                format: xml

  /api/sitemap/{type}:
    get:
      summary: Get specific sitemap
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
            enum: [static, blog, schools, companies, media]
        - name: locale
          in: query
          schema:
            type: string
            enum: [en, ru, uk, ar, ko, zh, tr, pt]
      responses:
        200:
          description: Sitemap XML
          content:
            application/xml:
              schema:
                type: string
                format: xml

  /api/sitemap/regenerate:
    post:
      summary: Trigger sitemap regeneration
      security:
        - ApiKey: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                force:
                  type: boolean
      responses:
        202:
          description: Regeneration started
          content:
            application/json:
              schema:
                type: object
                properties:
                  jobId:
                    type: string
                  status:
                    type: string

  /api/sitemap/status:
    get:
      summary: Get sitemap generation status
      responses:
        200:
          description: Status information
          content:
            application/json:
              schema:
                type: object
                properties:
                  sitemaps:
                    type: array
                    items:
                      type: object
                      properties:
                        type:
                          type: string
                        lastGenerated:
                          type: string
                          format: date-time
                        urlCount:
                          type: integer
                        status:
                          type: string
```

## Security Specifications

### Authentication & Authorization

```javascript
// lib/security/ApiAuth.js

class ApiAuth {
  constructor() {
    this.apiKeys = new Map();
    this.rateLimits = new Map();
  }

  authenticate(req) {
    const apiKey = this.extractApiKey(req);

    if (!apiKey) {
      return { authenticated: false, error: 'Missing API key' };
    }

    if (!this.isValidApiKey(apiKey)) {
      return { authenticated: false, error: 'Invalid API key' };
    }

    if (this.isRateLimited(apiKey)) {
      return { authenticated: false, error: 'Rate limit exceeded' };
    }

    this.trackUsage(apiKey);
    return { authenticated: true, apiKey };
  }

  extractApiKey(req) {
    // Check multiple sources
    return req.headers['x-api-key'] || req.query.apiKey || req.body?.apiKey;
  }

  isValidApiKey(key) {
    // Validate against stored keys
    return this.apiKeys.has(key) && this.apiKeys.get(key).active;
  }

  isRateLimited(key) {
    const limit = this.rateLimits.get(key);
    if (!limit) return false;

    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    const recentRequests = limit.requests.filter(time => time > windowStart);

    limit.requests = recentRequests;

    return recentRequests.length >= limit.maxRequests;
  }

  trackUsage(key) {
    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, {
        requests: [],
        maxRequests: 100, // 100 requests per minute
      });
    }

    this.rateLimits.get(key).requests.push(Date.now());
  }
}
```

### Input Validation

```javascript
// lib/security/InputValidator.js

class InputValidator {
  constructor() {
    this.rules = {
      locale: /^[a-z]{2}(-[A-Z]{2})?$/,
      type: /^[a-z-]+$/,
      limit: /^\d{1,5}$/,
      offset: /^\d{1,7}$/,
    };
  }

  validate(input, schema) {
    const errors = [];

    Object.entries(schema).forEach(([field, rule]) => {
      const value = input[field];

      // Required field check
      if (rule.required && !value) {
        errors.push(`${field} is required`);
        return;
      }

      // Type check
      if (value && rule.type && typeof value !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
      }

      // Pattern check
      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} has invalid format`);
      }

      // Range check
      if (value && rule.min !== undefined && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      }

      if (value && rule.max !== undefined && value > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
      }

      // Custom validation
      if (value && rule.validate) {
        const customError = rule.validate(value);
        if (customError) {
          errors.push(customError);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  sanitize(input) {
    // Remove potentially dangerous characters
    if (typeof input === 'string') {
      return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    }

    return input;
  }
}
```

## Compression Specifications

```javascript
// lib/compression/Compressor.js

const zlib = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');

class Compressor {
  constructor() {
    this.compressionOptions = {
      level: zlib.constants.Z_BEST_COMPRESSION,
      memLevel: 8,
      strategy: zlib.constants.Z_DEFAULT_STRATEGY,
    };
  }

  async compressFile(inputPath, outputPath) {
    const pipe = promisify(pipeline);

    await pipe(
      fs.createReadStream(inputPath),
      zlib.createGzip(this.compressionOptions),
      fs.createWriteStream(outputPath)
    );

    const stats = await fs.promises.stat(outputPath);
    return {
      originalSize: (await fs.promises.stat(inputPath)).size,
      compressedSize: stats.size,
      compressionRatio: 1 - stats.size / (await fs.promises.stat(inputPath)).size,
    };
  }

  async compressString(input) {
    return new Promise((resolve, reject) => {
      zlib.gzip(input, this.compressionOptions, (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });
  }

  async decompressString(buffer) {
    return new Promise((resolve, reject) => {
      zlib.gunzip(buffer, (err, result) => {
        if (err) reject(err);
        else resolve(result.toString());
      });
    });
  }

  streamCompress(inputStream, outputStream) {
    const gzip = zlib.createGzip(this.compressionOptions);

    return new Promise((resolve, reject) => {
      inputStream.pipe(gzip).pipe(outputStream).on('finish', resolve).on('error', reject);
    });
  }
}
```

## Deployment Specifications

### Docker Configuration

```dockerfile
# Dockerfile for sitemap service
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache \
  curl \
  redis \
  postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN adduser -D -s /bin/sh sitemapuser
USER sitemapuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sitemap-service
  labels:
    app: sitemap
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sitemap
  template:
    metadata:
      labels:
        app: sitemap
    spec:
      containers:
        - name: sitemap
          image: cdlhelp/sitemap:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: 'production'
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: sitemap-secrets
                  key: redis-url
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: sitemap-secrets
                  key: database-url
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: sitemap-service
spec:
  selector:
    app: sitemap
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

## Next Steps

Continue to [06-testing-validation.md](./06-testing-validation.md) for testing and validation strategies.
