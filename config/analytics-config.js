/**
 * Website Analytics Configuration
 * Centralized configuration for all analytics services with backend compatibility
 */

const AnalyticsConfig = {
  // Backend API Configuration
  api: {
    productionUrl: 'https://api.truckdriver.help',
    localUrl: 'http://localhost:8003',
    timeout: 10000, // 10 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },

  // Meta Pixel & CAPI Configuration
  meta: {
    enabled: true,
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN, // Server-side only
    enableCAPI: true,
    enableAdvancedMatching: true,
    enableEMQOptimization: true,
    capiVersion: 'v23.0.1',
    testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE, // For testing
  },

  // Google Ads Configuration
  googleAds: {
    enabled: true,
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
    enableEnhancedConversions: true,
    enableGlobalSiteTag: true,
    enableConsentMode: true,
  },

  // Google Analytics 4 Configuration
  googleAnalytics: {
    enabled: true,
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    enableGtagConfig: true,
    enableEcommerce: true,
    enableUserProperties: true,
  },

  // Backend Integration Configuration
  backend: {
    enabled: true,
    enableAnalyticsForwarding: true,
    enableMetaCAPIForwarding: true,
    enableGoogleAdsForwarding: true,
    enableEventDeduplication: true,
    enableUserDataHashing: true,
  },

  // Event Schema Configuration
  events: {
    schemaVersion: '2.0',
    enableValidation: true,
    enableDeduplication: true,
    maxEventAge: 300, // 5 minutes in seconds
  },

  // Privacy and Consent Configuration
  privacy: {
    requireConsent: true,
    enableGDPR: true,
    enableCCPA: true,
    enableConsentMode: true,
    defaultConsentState: {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    },
  },

  // Debug and Development Configuration
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    enableConsoleLogging: process.env.NODE_ENV === 'development',
    enableValidation: true,
    enableTestEvents: process.env.NODE_ENV === 'development',
  },

  // Performance Configuration
  performance: {
    enableLazyLoading: true,
    enableEventBatching: true,
    batchSize: 10,
    batchTimeout: 5000, // 5 seconds
    enableOfflineSupport: true,
    maxOfflineEvents: 100,
  },

  // Platform Detection
  platform: {
    detectMobile: true,
    detectTablet: true,
    detectBot: true,
    enableUserAgentParsing: true,
  },

  // Standard Events Configuration
  standardEvents: {
    // Commerce Events
    commerce: [
      'purchase',
      'add_to_cart',
      'begin_checkout',
      'add_payment_info',
      'subscribe',
      'start_trial',
    ],
    
    // Engagement Events
    engagement: [
      'page_view',
      'view_content',
      'search',
      'video_play',
      'video_complete',
      'file_download',
    ],
    
    // Conversion Events
    conversion: [
      'purchase',
      'subscribe',
      'sign_up',
      'contact_form_submit',
      'download_app',
      'lead',
    ],
    
    // Custom App Events
    custom: [
      'quiz_started',
      'quiz_completed',
      'tutorial_started',
      'tutorial_completed',
      'feature_used',
    ],
  },

  // Backend Endpoints
  endpoints: {
    // Analytics
    analyticsTrack: '/analytics/track-event',
    analyticsHealth: '/analytics/health-check',
    
    // Meta
    metaCAPI: '/api/meta/capi/track',
    metaConversion: '/api/v2/meta/unified-conversion',
    metaWebhook: '/api/v3/meta/webhook/event',
    
    // Google Ads
    googleAdsConversion: '/api/google-ads/conversion',
    googleAdsEnhanced: '/api/google-ads/enhanced-conversion',
    
    // Validation
    validate: '/analytics/validate',
    healthCheck: '/health-check',
  },

  // Feature Flags
  features: {
    enableServerSideTracking: true,
    enableCrossPlatformAttribution: true,
    enableRealTimePersonalization: true,
    enablePredictiveAnalytics: true,
    enableAutomatedAudiences: false, // Coming soon
    enableDynamicCreatives: false,   // Coming soon
  },

  // Data Layer Configuration
  dataLayer: {
    enabled: true,
    windowProperty: 'dataLayer',
    enableEcommerce: true,
    enableUserData: true,
    enableConsentData: true,
  },

  // Cookie Configuration
  cookies: {
    enableFirstPartyCookies: true,
    enableThirdPartyCookies: false,
    cookieDomain: process.env.NODE_ENV === 'production' ? '.truckdriver.help' : undefined,
    cookieSecure: process.env.NODE_ENV === 'production',
    cookieSameSite: 'Lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Error Handling
  errorHandling: {
    enableGlobalErrorTracking: true,
    enableJavaScriptErrorTracking: true,
    enableNetworkErrorTracking: true,
    enableConsentErrorTracking: true,
    maxErrorsPerSession: 10,
  },

  // Validation Configuration
  validation: {
    enabled: true,
    enableRealTimeValidation: process.env.NODE_ENV === 'development',
    enablePeriodicValidation: false,
    validationInterval: 5 * 60 * 1000, // 5 minutes
    enableValidationReporting: true,
    enableValidationAlerts: process.env.NODE_ENV === 'development',
  },

  // Helper Functions
  
  /**
   * Get API URL based on environment
   */
  getApiUrl() {
    const useLocal = process.env.USE_LOCAL_API === 'true' || 
                    (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    return useLocal ? this.api.localUrl : this.api.productionUrl;
  },

  /**
   * Check if service is enabled
   */
  isServiceEnabled(serviceName) {
    switch (serviceName.toLowerCase()) {
      case 'meta':
      case 'facebook':
        return this.meta.enabled;
      case 'google_ads':
      case 'googleads':
        return this.googleAds.enabled;
      case 'google_analytics':
      case 'ga':
        return this.googleAnalytics.enabled;
      case 'backend':
        return this.backend.enabled;
      case 'validation':
        return this.validation.enabled;
      default:
        return false;
    }
  },

  /**
   * Check if event is of specific type
   */
  isEventType(eventName, type) {
    const events = this.standardEvents[type] || [];
    return events.includes(eventName.toLowerCase());
  },

  /**
   * Get backend endpoint URL
   */
  getEndpoint(endpointName) {
    const endpoint = this.endpoints[endpointName];
    if (!endpoint) {
      throw new Error(`Unknown endpoint: ${endpointName}`);
    }
    return `${this.getApiUrl()}${endpoint}`;
  },

  /**
   * Check feature flag
   */
  isFeatureEnabled(featureName) {
    return this.features[featureName] || false;
  },

  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig() {
    const env = process.env.NODE_ENV || 'production';
    
    switch (env) {
      case 'development':
        return {
          enableDebugLogging: true,
          enableTestEvents: true,
          enableValidationAlerts: true,
          apiTimeout: 30000,
          maxRetries: 1,
        };
      case 'staging':
        return {
          enableDebugLogging: true,
          enableTestEvents: false,
          enableValidationAlerts: false,
          apiTimeout: 15000,
          maxRetries: 2,
        };
      case 'production':
      default:
        return {
          enableDebugLogging: false,
          enableTestEvents: false,
          enableValidationAlerts: false,
          apiTimeout: 10000,
          maxRetries: 3,
        };
    }
  },

  /**
   * Get consent configuration based on region
   */
  getConsentConfig(region = 'US') {
    const baseConfig = {
      required: this.privacy.requireConsent,
      enableConsentMode: this.privacy.enableConsentMode,
    };

    switch (region.toUpperCase()) {
      case 'EU':
      case 'EEA':
        return {
          ...baseConfig,
          enableGDPR: true,
          enableCCPA: false,
          strictMode: true,
        };
      case 'CA':
        return {
          ...baseConfig,
          enableGDPR: false,
          enableCCPA: true,
          strictMode: true,
        };
      case 'US':
      default:
        return {
          ...baseConfig,
          enableGDPR: this.privacy.enableGDPR,
          enableCCPA: this.privacy.enableCCPA,
          strictMode: false,
        };
    }
  },

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];
    const warnings = [];

    // Check required environment variables
    if (this.meta.enabled && !this.meta.pixelId) {
      errors.push('Meta Pixel ID not configured');
    }

    if (this.googleAds.enabled && !this.googleAds.conversionId) {
      warnings.push('Google Ads Conversion ID not configured');
    }

    if (this.googleAnalytics.enabled && !this.googleAnalytics.measurementId) {
      warnings.push('Google Analytics Measurement ID not configured');
    }

    // Check feature compatibility
    if (this.backend.enableMetaCAPIForwarding && !this.backend.enabled) {
      errors.push('Backend must be enabled for Meta CAPI forwarding');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  },
};

// Validate configuration on load
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const validation = AnalyticsConfig.validate();
  if (!validation.valid) {
    console.error('Analytics configuration errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('Analytics configuration warnings:', validation.warnings);
  }
}

export default AnalyticsConfig;