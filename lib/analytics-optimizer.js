/**
 * Analytics Critical Path Optimizer
 * Defers non-essential analytics until after user interaction
 * Optimizes loading priority for better Core Web Vitals
 */

import { defer, whenIdle, supportsFeature } from './utils/performance';

class AnalyticsOptimizer {
  constructor() {
    this.criticalAnalytics = null;
    this.deferredAnalytics = [];
    this.hasUserInteracted = false;
    this.loadingStage = 'initial'; // initial -> critical -> deferred -> complete
    this.deferredCallbacks = [];
    this.performanceMetrics = {
      criticalLoadTime: null,
      deferredLoadTime: null,
      totalLoadTime: null,
    };

    this.setupInteractionDetection();
  }

  /**
   * Initialize with critical analytics only
   */
  async initCritical() {
    const startTime = performance.now();
    this.loadingStage = 'critical';

    try {
      // Load only essential analytics (Google Analytics for page views)
      const { default: analyticsLite } = await import('./analytics-lite');
      this.criticalAnalytics = analyticsLite;

      // Initialize with minimal consent checking
      const { default: consentManager } = await import('./consent-manager');
      await this.criticalAnalytics.init(consentManager);

      this.performanceMetrics.criticalLoadTime = performance.now() - startTime;
      this.loadingStage = 'critical-ready';

      console.log(
        `🚀 Critical analytics loaded in ${this.performanceMetrics.criticalLoadTime.toFixed(2)}ms`
      );

      // Track initial page view immediately
      this.criticalAnalytics.pageView();
    } catch (error) {
      console.error('Failed to load critical analytics:', error);
    }
  }

  /**
   * Setup user interaction detection
   */
  setupInteractionDetection() {
    if (typeof document === 'undefined') return;

    const interactionEvents = ['click', 'scroll', 'keydown', 'touchstart', 'mousemove'];
    let interactionTimeout;

    const handleInteraction = () => {
      if (this.hasUserInteracted) return;

      this.hasUserInteracted = true;
      console.log('👆 User interaction detected - loading deferred analytics');

      // Small delay to not interfere with user interaction
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        this.loadDeferredAnalytics();
      }, 100);

      // Remove listeners to save memory
      interactionEvents.forEach(event =>
        document.removeEventListener(event, handleInteraction, { passive: true })
      );
    };

    // Add interaction listeners
    interactionEvents.forEach(event =>
      document.addEventListener(event, handleInteraction, { passive: true, once: true })
    );

    // Fallback: load deferred analytics after 5 seconds regardless
    setTimeout(() => {
      if (!this.hasUserInteracted) {
        console.log('⏰ Timeout reached - loading deferred analytics');
        this.loadDeferredAnalytics();
      }
    }, 5000);
  }

  /**
   * Load deferred analytics after user interaction
   */
  async loadDeferredAnalytics() {
    if (this.loadingStage === 'deferred' || this.loadingStage === 'complete') return;

    const startTime = performance.now();
    this.loadingStage = 'deferred';

    try {
      // Load full analytics suite
      const modules = await Promise.allSettled([
        import('./analytics-enhanced'),
        import('./unified-identity'),
        import('./personalization-api'),
      ]);

      const [enhancedAnalytics, unifiedIdentity, personalizationAPI] = modules.map(m =>
        m.status === 'fulfilled' ? m.value.default : null
      );

      if (enhancedAnalytics) {
        await enhancedAnalytics.init();
        this.deferredAnalytics.push(enhancedAnalytics);
      }

      if (unifiedIdentity) {
        await unifiedIdentity.init();
        this.deferredAnalytics.push(unifiedIdentity);
      }

      if (personalizationAPI) {
        // Preload personalization data in background
        whenIdle(() => {
          personalizationAPI.preloadPersonalization();
        });
        this.deferredAnalytics.push(personalizationAPI);
      }

      this.performanceMetrics.deferredLoadTime = performance.now() - startTime;
      this.performanceMetrics.totalLoadTime = performance.now();
      this.loadingStage = 'complete';

      console.log(
        `📊 Deferred analytics loaded in ${this.performanceMetrics.deferredLoadTime.toFixed(2)}ms`
      );

      // Execute any queued callbacks
      this.deferredCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Deferred callback error:', error);
        }
      });
      this.deferredCallbacks = [];
    } catch (error) {
      console.error('Failed to load deferred analytics:', error);
    }
  }

  /**
   * Track event with appropriate analytics based on loading stage
   */
  track(eventName, properties = {}, options = {}) {
    // Always use critical analytics if available
    if (this.criticalAnalytics) {
      this.criticalAnalytics.track(eventName, properties, options);
    }

    // Use enhanced analytics if loaded
    if (this.deferredAnalytics.length > 0) {
      const enhancedAnalytics = this.deferredAnalytics[0];
      if (enhancedAnalytics && enhancedAnalytics.trackEvent) {
        enhancedAnalytics.trackEvent(eventName, properties, options);
      }
    }
  }

  /**
   * Track page view optimized for critical path
   */
  pageView(url, title) {
    if (this.criticalAnalytics) {
      this.criticalAnalytics.pageView(url, title);
    }

    // Enhanced page view tracking will happen when deferred analytics load
    if (this.loadingStage === 'complete') {
      const enhancedAnalytics = this.deferredAnalytics[0];
      if (enhancedAnalytics && enhancedAnalytics.trackPageView) {
        enhancedAnalytics.trackPageView(url, title);
      }
    }
  }

  /**
   * Track download intent (critical event)
   */
  downloadIntent(platform, source) {
    // This is a critical conversion event, so track immediately
    if (this.criticalAnalytics) {
      this.criticalAnalytics.downloadIntent(platform, source);
    }

    // If deferred analytics not loaded yet, queue the enhanced tracking
    if (this.loadingStage !== 'complete') {
      this.deferredCallbacks.push(() => {
        const enhancedAnalytics = this.deferredAnalytics[0];
        if (enhancedAnalytics && enhancedAnalytics.trackDownloadIntent) {
          enhancedAnalytics.trackDownloadIntent(platform, source);
        }
      });
    } else {
      const enhancedAnalytics = this.deferredAnalytics[0];
      if (enhancedAnalytics && enhancedAnalytics.trackDownloadIntent) {
        enhancedAnalytics.trackDownloadIntent(platform, source);
      }
    }
  }

  /**
   * Wait for deferred analytics to load
   */
  whenReady(callback) {
    if (this.loadingStage === 'complete') {
      callback();
    } else {
      this.deferredCallbacks.push(callback);
    }
  }

  /**
   * Get optimization status
   */
  getStatus() {
    return {
      loadingStage: this.loadingStage,
      hasUserInteracted: this.hasUserInteracted,
      criticalAnalyticsReady: !!this.criticalAnalytics,
      deferredAnalyticsCount: this.deferredAnalytics.length,
      performanceMetrics: this.performanceMetrics,
      queuedCallbacks: this.deferredCallbacks.length,
    };
  }

  /**
   * Force load deferred analytics (for testing or special cases)
   */
  forceLoadDeferred() {
    if (this.loadingStage === 'critical-ready') {
      this.loadDeferredAnalytics();
    }
  }

  /**
   * Get performance metrics for monitoring
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      loadingStage: this.loadingStage,
      interactionDetected: this.hasUserInteracted,
      corWebVitalsImpact: {
        criticalPathOptimized: this.performanceMetrics.criticalLoadTime < 100,
        deferredLoadingWorking: this.hasUserInteracted || this.loadingStage === 'complete',
      },
    };
  }

  /**
   * Report Core Web Vitals impact
   */
  reportWebVitals() {
    if (supportsFeature('intersectionObserver') && typeof PerformanceObserver !== 'undefined') {
      // Monitor Largest Contentful Paint
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.track('core_web_vitals', {
              metric: 'LCP',
              value: entry.startTime,
              analytics_optimization: this.loadingStage,
              critical_load_time: this.performanceMetrics.criticalLoadTime,
            });
          }
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            this.track('core_web_vitals', {
              metric: 'FID',
              value: entry.processingStart - entry.startTime,
              analytics_optimization: this.loadingStage,
            });
          }
        }
      }).observe({ entryTypes: ['first-input'] });
    }
  }
}

// Create singleton instance
const analyticsOptimizer = new AnalyticsOptimizer();

// Auto-initialize critical analytics
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      analyticsOptimizer.initCritical();
    });
  } else {
    analyticsOptimizer.initCritical();
  }

  // Start monitoring Core Web Vitals
  analyticsOptimizer.reportWebVitals();
}

export default analyticsOptimizer;

// Convenience exports that route to appropriate analytics
export const track = (...args) => analyticsOptimizer.track(...args);
export const pageView = (...args) => analyticsOptimizer.pageView(...args);
export const downloadIntent = (...args) => analyticsOptimizer.downloadIntent(...args);
export const whenReady = (...args) => analyticsOptimizer.whenReady(...args);
export const getStatus = () => analyticsOptimizer.getStatus();
export const getPerformanceMetrics = () => analyticsOptimizer.getPerformanceMetrics();
