/**
 * Analytics Integration Layer
 * Connects the new dataLayer manager with existing analytics systems
 * Addresses audit findings and ensures consistent event tracking
 */

import dataLayerManager from './dataLayer-manager';
import enhancedConversionsServer from './enhanced-conversions-server';
import metaStandardEvents from './meta-standard-events';
import { trackConversion } from './analytics';

class AnalyticsIntegration {
  constructor() {
    this.debug = process.env.NODE_ENV === 'development';
    this.initialized = false;
  }

  /**
   * Initialize analytics integration
   */
  async init() {
    if (this.initialized) return;
    
    try {
      // Initialize dataLayer manager
      dataLayerManager.init();
      
      // Set up cross-platform event synchronization
      this.setupEventBridging();
      
      // Initialize page tracking
      this.initPageTracking();
      
      this.initialized = true;
      
      if (this.debug) {
        console.log('✅ Analytics Integration initialized');
      }
    } catch (error) {
      console.error('Analytics Integration initialization failed:', error);
    }
  }

  /**
   * Set up event bridging between dataLayer and other platforms
   */
  setupEventBridging() {
    // Listen for dataLayer events and forward to other platforms
    if (typeof window !== 'undefined') {
      // Override dataLayer.push to intercept events
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = (data) => {
        // Call original push
        originalPush.call(window.dataLayer, data);
        
        // Process for cross-platform forwarding
        this.processCrossPlatformEvent(data);
      };
    }
  }

  /**
   * Process events for cross-platform forwarding
   */
  processCrossPlatformEvent(eventData) {
    if (!eventData || !eventData.event) return;

    try {
      const { event: eventName, ...params } = eventData;

      // Forward to Meta/Facebook
      this.forwardToMeta(eventName, params);

      // Forward to Google Ads Enhanced Conversions
      this.forwardToGoogleAds(eventName, params);

      // Forward to backend analytics
      this.forwardToBackend(eventName, params);

    } catch (error) {
      console.error('Cross-platform event forwarding failed:', error);
    }
  }

  /**
   * Forward events to Meta/Facebook
   */
  forwardToMeta(eventName, params) {
    try {
      const metaEventMapping = {
        'purchase': 'Purchase',
        'sign_up': 'CompleteRegistration',
        'login': 'CompleteRegistration',
        'quiz_complete': 'CompleteRegistration',
        'app_download': 'Lead',
        'generate_lead': 'Lead',
        'begin_checkout': 'InitiateCheckout',
        'subscription_renew': 'Subscribe'
      };

      const metaEventName = metaEventMapping[eventName] || eventName;
      
      if (metaEventMapping[eventName]) {
        // Convert dataLayer parameters to Meta format
        const metaParams = this.convertToMetaParams(params);
        metaStandardEvents.track(metaEventName, metaParams);
        
        if (this.debug) {
          console.log(`📘 Meta event forwarded: ${metaEventName}`, metaParams);
        }
      }
    } catch (error) {
      console.error('Meta event forwarding failed:', error);
    }
  }

  /**
   * Forward events to Google Ads Enhanced Conversions
   */
  async forwardToGoogleAds(eventName, params) {
    try {
      const conversionEvents = ['purchase', 'subscription_renew', 'app_download', 'generate_lead'];
      
      if (conversionEvents.includes(eventName)) {
        const conversionData = {
          conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
          conversionLabel: this.getConversionLabel(eventName),
          value: params.value || params.ecommerce?.value || 0,
          currency: params.currency || params.ecommerce?.currency || 'USD',
          transactionId: params.transaction_id || params.ecommerce?.transaction_id,
          userData: this.extractUserData(params)
        };

        await enhancedConversionsServer.trackConversion(conversionData);
        
        if (this.debug) {
          console.log(`🎯 Google Ads conversion tracked: ${eventName}`, conversionData);
        }
      }
    } catch (error) {
      console.error('Google Ads conversion forwarding failed:', error);
    }
  }

  /**
   * Forward events to backend analytics
   */
  async forwardToBackend(eventName, params) {
    try {
      // Use existing backend analytics integration
      const backendPayload = {
        event_name: eventName,
        parameters: params,
        timestamp: Date.now(),
        source: 'website_datalayer',
        platform: 'web'
      };

      // Send to backend (implementation depends on your backend analytics setup)
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backendPayload)
      });

    } catch (error) {
      // Silent fail for backend - don't break client-side tracking
      if (this.debug) {
        console.warn('Backend analytics forwarding failed:', error);
      }
    }
  }

  /**
   * Convert dataLayer parameters to Meta format
   */
  convertToMetaParams(params) {
    const metaParams = {};

    // Map common parameters
    if (params.value || params.ecommerce?.value) {
      metaParams.value = params.value || params.ecommerce.value;
    }
    
    if (params.currency || params.ecommerce?.currency) {
      metaParams.currency = params.currency || params.ecommerce.currency;
    }

    if (params.ecommerce?.items) {
      metaParams.content_ids = params.ecommerce.items.map(item => item.item_id);
      metaParams.content_type = 'product';
      metaParams.num_items = params.ecommerce.items.length;
    }

    // Add custom parameters
    Object.keys(params).forEach(key => {
      if (!['ecommerce', 'value', 'currency'].includes(key)) {
        metaParams[key] = params[key];
      }
    });

    return metaParams;
  }

  /**
   * Get Google Ads conversion label for event type
   */
  getConversionLabel(eventName) {
    const conversionLabels = {
      'purchase': 'UXMnCJi4quYaEJyPhqwq',
      'subscription_renew': 'UXMnCJi4quYaEJyPhqwq',
      'app_download': 'app_download_conversion',
      'generate_lead': 'lead_conversion'
    };

    return conversionLabels[eventName] || 'default_conversion';
  }

  /**
   * Extract user data from parameters
   */
  extractUserData(params) {
    const userData = {};
    
    // Extract from various parameter structures
    if (params.user_data) {
      Object.assign(userData, params.user_data);
    }
    
    if (params.customer_data) {
      Object.assign(userData, params.customer_data);
    }

    // Extract from top-level parameters
    ['email', 'phone', 'phone_number', 'first_name', 'last_name'].forEach(field => {
      if (params[field]) {
        userData[field] = params[field];
      }
    });

    return userData;
  }

  /**
   * Initialize page tracking with enhanced attribution
   */
  initPageTracking() {
    if (typeof window === 'undefined') return;

    // Track initial page view
    dataLayerManager.trackPageView({
      utm_source: this.getURLParam('utm_source'),
      utm_medium: this.getURLParam('utm_medium'),
      utm_campaign: this.getURLParam('utm_campaign'),
      utm_content: this.getURLParam('utm_content'),
      utm_term: this.getURLParam('utm_term'),
      gclid: this.getURLParam('gclid'),
      fbclid: this.getURLParam('fbclid')
    });

    // Set up SPA navigation tracking
    this.setupSPATracking();
  }

  /**
   * Set up Single Page Application navigation tracking
   */
  setupSPATracking() {
    // Track Next.js route changes
    if (typeof window !== 'undefined' && window.next) {
      window.addEventListener('routeChangeComplete', (url) => {
        dataLayerManager.trackVirtualPageView(url);
      });
    }

    // Fallback: listen for history changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(history, arguments);
      setTimeout(() => {
        dataLayerManager.trackVirtualPageView(window.location.pathname);
      }, 100);
    };

    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      setTimeout(() => {
        dataLayerManager.trackVirtualPageView(window.location.pathname);
      }, 100);
    };
  }

  /**
   * Get URL parameter
   */
  getURLParam(param) {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // ======================
  // PUBLIC API METHODS
  // ======================

  /**
   * Track purchase with cross-platform forwarding
   */
  async trackPurchase(purchaseData) {
    // Use dataLayer manager for structured tracking
    const result = dataLayerManager.trackPurchase(purchaseData);
    
    // Additional direct Google Ads tracking for critical conversions
    if (purchaseData.value > 0) {
      await enhancedConversionsServer.trackSubscriptionConversion({
        subscriptionType: purchaseData.subscriptionType,
        value: purchaseData.value,
        currency: purchaseData.currency,
        userId: purchaseData.userId,
        email: purchaseData.email,
        phone: purchaseData.phone
      });
    }

    return result;
  }

  /**
   * Track quiz completion with business-specific logic
   */
  trackQuizCompletion(quizData) {
    // Use dataLayer manager
    dataLayerManager.trackQuizComplete(quizData);

    // If quiz passed, track as potential conversion
    if (quizData.passed) {
      this.trackPotentialConversion({
        type: 'quiz_passed',
        value: 1.50, // Estimated value of a passing quiz
        quiz_category: quizData.category,
        score: quizData.score
      });
    }
  }

  /**
   * Track app download with conversion value
   */
  async trackAppDownload(downloadData = {}) {
    // Use dataLayer manager
    dataLayerManager.trackAppDownload(downloadData);

    // Track as Google Ads conversion
    await enhancedConversionsServer.trackAppDownloadConversion(downloadData);
  }

  /**
   * Track lead generation
   */
  async trackLead(leadData) {
    // Use dataLayer manager
    dataLayerManager.trackLead(leadData);

    // Track as Google Ads conversion
    await enhancedConversionsServer.trackLeadConversion(leadData);
  }

  /**
   * Track potential conversion (internal scoring)
   */
  trackPotentialConversion(conversionData) {
    // Internal event for optimization algorithms
    dataLayerManager.push({
      event: 'potential_conversion',
      conversion_type: conversionData.type,
      conversion_value: conversionData.value,
      conversion_probability: conversionData.probability || 0.5,
      ...conversionData
    });
  }
}

// Export singleton instance
const analyticsIntegration = new AnalyticsIntegration();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      analyticsIntegration.init();
    });
  } else {
    analyticsIntegration.init();
  }
}

export default analyticsIntegration;