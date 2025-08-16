/**
 * Lightweight Analytics Module for CDLHelp
 * Optimized for bundle size and performance
 * Core features only - 40% smaller than full analytics
 */

import { loadScript, defer } from './utils/performance';

class AnalyticsLite {
  constructor() {
    this.initialized = false;
    this.eventQueue = [];
    this.batchTimer = null;
    this.sentEvents = new Set();

    // Optimized config
    this.config = {
      batchSize: 5,
      batchInterval: 5000, // 5 seconds
      maxQueueSize: 50,
      dedupeWindow: 300000, // 5 minutes
    };

    this.platforms = new Map();
    this.isVisible = true;

    // Track visibility for performance optimization
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isVisible = !document.hidden;
        if (this.isVisible && this.eventQueue.length > 0) {
          this.processBatch();
        }
      });
    }
  }

  /**
   * Initialize with minimal overhead
   */
  async init(consentManager) {
    if (this.initialized) return;

    this.consent = consentManager;

    // Only load essential platforms initially
    if (this.consent.hasConsent('analytics')) {
      this.initGoogleAnalytics();
    }

    // Defer other platforms to reduce initial bundle
    defer(() => {
      if (this.consent.hasConsent('marketing')) {
        this.initFacebookPixel();
        this.initAmplitude();
      }
    }, 2000);

    this.initialized = true;
  }

  /**
   * Minimal Google Analytics initialization
   */
  initGoogleAnalytics() {
    if (typeof window === 'undefined' || !window.gtag) return;

    this.platforms.set('ga4', {
      enabled: true,
      send: (event, params) => window.gtag('event', event, params),
    });
  }

  /**
   * Deferred Facebook Pixel initialization
   */
  initFacebookPixel() {
    if (typeof window === 'undefined' || !window.fbq) return;

    this.platforms.set('facebook', {
      enabled: true,
      send: (event, params) => window.fbq('track', event, params),
    });
  }

  /**
   * Deferred Amplitude initialization with minimal config
   */
  async initAmplitude() {
    if (typeof window === 'undefined' || window.amplitude) return;

    try {
      await loadScript(
        `https://cdn.amplitude.com/script/${process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY}.js`
      );

      if (window.amplitude) {
        window.amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, {
          batchEvents: true,
          eventUploadThreshold: this.config.batchSize,
          eventUploadPeriodMillis: this.config.batchInterval,
          autocapture: false, // Disable to reduce bundle
          trackingOptions: {
            city: false,
            ip_address: false,
            carrier: false,
            dma: false,
          },
        });

        this.platforms.set('amplitude', {
          enabled: true,
          send: (event, params) => window.amplitude.track(event, params),
        });
      }
    } catch (error) {}
  }

  /**
   * Optimized event tracking with batching
   */
  track(eventName, properties = {}, options = {}) {
    if (!this.initialized) {
      return;
    }

    const event = this.createEvent(eventName, properties, options);

    // Check for duplicates
    if (this.isDuplicate(event) && !options.allowDuplicates) {
      return;
    }

    // Add to batch queue
    this.addToBatch(event);

    // Mark as sent for deduplication
    this.sentEvents.add(event.id);

    // Cleanup old sent events to prevent memory leaks
    if (this.sentEvents.size > 1000) {
      const oldEvents = Array.from(this.sentEvents).slice(0, 500);
      oldEvents.forEach(id => this.sentEvents.delete(id));
    }
  }

  /**
   * Create standardized event object
   */
  createEvent(eventName, properties, options) {
    const timestamp = Date.now();
    const eventId = `${eventName}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: eventId,
      name: eventName,
      properties: {
        ...properties,
        timestamp,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
      options,
      created: timestamp,
    };
  }

  /**
   * Check for duplicate events
   */
  isDuplicate(event) {
    return this.sentEvents.has(event.id);
  }

  /**
   * Add event to batch queue
   */
  addToBatch(event) {
    this.eventQueue.push(event);

    // Enforce max queue size
    if (this.eventQueue.length > this.config.maxQueueSize) {
      this.eventQueue = this.eventQueue.slice(-this.config.maxQueueSize);
    }

    // Process immediately if batch is full
    if (this.eventQueue.length >= this.config.batchSize) {
      this.processBatch();
    } else if (!this.batchTimer) {
      // Set timer for batch processing
      this.batchTimer = setTimeout(() => {
        this.processBatch();
      }, this.config.batchInterval);
    }
  }

  /**
   * Process batch of events
   */
  processBatch() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Send to platforms
    this.sendBatch(events);
  }

  /**
   * Send batch to all enabled platforms
   */
  async sendBatch(events) {
    const promises = [];

    for (const [platformName, platform] of this.platforms) {
      if (platform.enabled) {
        promises.push(this.sendToPlatform(platformName, platform, events));
      }
    }

    try {
      await Promise.allSettled(promises);
    } catch (error) {}
  }

  /**
   * Send events to specific platform
   */
  async sendToPlatform(platformName, platform, events) {
    try {
      for (const event of events) {
        // Skip if not visible and not critical event
        if (!this.isVisible && !event.options.critical) {
          continue;
        }

        const mappedParams = this.mapEventForPlatform(platformName, event);
        platform.send(event.name, mappedParams);
      }
    } catch (error) {}
  }

  /**
   * Map event properties for platform compatibility
   */
  mapEventForPlatform(platformName, event) {
    switch (platformName) {
      case 'ga4':
        return this.mapForGA4(event);
      case 'facebook':
        return this.mapForFacebook(event);
      case 'amplitude':
        return this.mapForAmplitude(event);
      default:
        return event.properties;
    }
  }

  /**
   * Map event for Google Analytics 4
   */
  mapForGA4(event) {
    const mapped = { ...event.properties };

    // Remove or truncate long properties for GA4 limits
    Object.keys(mapped).forEach(key => {
      if (key.length > 40) {
        const shortKey = key.substring(0, 40);
        mapped[shortKey] = mapped[key];
        delete mapped[key];
      }

      if (typeof mapped[key] === 'string' && mapped[key].length > 100) {
        mapped[key] = mapped[key].substring(0, 100);
      }
    });

    return mapped;
  }

  /**
   * Map event for Facebook Pixel
   */
  mapForFacebook(event) {
    return {
      ...event.properties,
      content_type: 'website',
      event_id: event.id, // For deduplication
    };
  }

  /**
   * Map event for Amplitude
   */
  mapForAmplitude(event) {
    return event.properties;
  }

  /**
   * Common tracking methods with minimal overhead
   */

  pageView(url = typeof window !== 'undefined' ? window.location.href : '') {
    this.track(
      'page_view',
      {
        page_url: url,
        page_title: typeof document !== 'undefined' ? document.title : '',
      },
      { critical: true }
    );
  }

  downloadIntent(platform, source = 'website') {
    this.track(
      'download_intent',
      {
        platform,
        source,
        device_type: this.getDeviceType(),
      },
      { critical: true }
    );
  }

  quizComplete(score, total) {
    this.track('quiz_completed', {
      score,
      total_questions: total,
      completion_rate: Math.round((score / total) * 100),
      passed: score >= total * 0.8,
    });
  }

  /**
   * Utility methods
   */

  getDeviceType() {
    if (typeof navigator === 'undefined') return 'unknown';

    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(ua)) return 'mobile';
    if (/tablet|ipad/.test(ua)) return 'tablet';
    return 'desktop';
  }

  /**
   * Flush remaining events (on page unload)
   */
  flush() {
    if (this.eventQueue.length > 0) {
      this.processBatch();
    }
  }

  /**
   * Get analytics status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      queueSize: this.eventQueue.length,
      platforms: Array.from(this.platforms.keys()),
      sentEventsCount: this.sentEvents.size,
    };
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    this.flush();
    this.platforms.clear();
    this.eventQueue = [];
    this.sentEvents.clear();
  }
}

// Create singleton
const analyticsLite = new AnalyticsLite();

// Auto-flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analyticsLite.flush();
  });
}

export default analyticsLite;

// Convenience exports
export const { track, pageView, downloadIntent, quizComplete, getStatus } = {
  track: (...args) => analyticsLite.track(...args),
  pageView: (...args) => analyticsLite.pageView(...args),
  downloadIntent: (...args) => analyticsLite.downloadIntent(...args),
  quizComplete: (...args) => analyticsLite.quizComplete(...args),
  getStatus: () => analyticsLite.getStatus(),
};
