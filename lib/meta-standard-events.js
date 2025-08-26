/**
 * Meta Standard Events Implementation
 * Properly implements all Meta standard events with correct parameters
 */

import metaEMQOptimizer from './meta-emq-optimizer';

class MetaStandardEvents {
  constructor() {
    this.debug = process.env.NODE_ENV === 'development';
    this.pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    
    // Define standard events with required parameters
    this.standardEvents = {
      // Core Web Events
      PageView: {
        name: 'PageView',
        required: [],
        optional: ['content_ids', 'content_type']
      },
      
      ViewContent: {
        name: 'ViewContent',
        required: [],
        recommended: ['content_ids', 'content_type', 'content_name'],
        optional: ['content_category', 'value', 'currency']
      },
      
      Search: {
        name: 'Search',
        required: [],
        recommended: ['search_string'],
        optional: ['content_ids', 'content_category', 'value', 'currency']
      },
      
      // Conversion Events
      AddToCart: {
        name: 'AddToCart',
        required: [],
        recommended: ['content_ids', 'content_type', 'value', 'currency'],
        optional: ['content_name', 'content_category', 'num_items']
      },
      
      AddToWishlist: {
        name: 'AddToWishlist',
        required: [],
        recommended: ['content_ids', 'content_type', 'value', 'currency'],
        optional: ['content_name', 'content_category']
      },
      
      InitiateCheckout: {
        name: 'InitiateCheckout',
        required: [],
        recommended: ['content_ids', 'content_type', 'value', 'currency', 'num_items'],
        optional: ['content_name', 'content_category']
      },
      
      AddPaymentInfo: {
        name: 'AddPaymentInfo',
        required: [],
        recommended: ['content_ids', 'content_type', 'value', 'currency'],
        optional: ['content_category']
      },
      
      Purchase: {
        name: 'Purchase',
        required: ['value', 'currency'],
        recommended: ['content_ids', 'content_type', 'content_name', 'num_items'],
        optional: ['content_category', 'order_id']
      },
      
      // Lead Generation Events
      Lead: {
        name: 'Lead',
        required: [],
        recommended: ['content_name', 'content_category'],
        optional: ['value', 'currency']
      },
      
      CompleteRegistration: {
        name: 'CompleteRegistration',
        required: [],
        recommended: ['content_name', 'status'],
        optional: ['value', 'currency']
      },
      
      // App Events
      StartTrial: {
        name: 'StartTrial',
        required: [],
        recommended: ['value', 'currency', 'predicted_ltv'],
        optional: ['content_name', 'content_id']
      },
      
      Subscribe: {
        name: 'Subscribe',
        required: [],
        recommended: ['value', 'currency', 'predicted_ltv'],
        optional: ['content_name', 'content_id']
      },
      
      // Custom App Events (mapped to standard)
      Schedule: {
        name: 'Schedule',
        required: [],
        optional: ['content_name', 'content_ids', 'content_type']
      },
      
      Contact: {
        name: 'Contact',
        required: [],
        optional: ['content_name', 'content_type']
      },
      
      CustomizeProduct: {
        name: 'CustomizeProduct',
        required: [],
        optional: ['content_name', 'content_ids', 'content_type']
      },
      
      Donate: {
        name: 'Donate',
        required: [],
        optional: ['value', 'currency', 'content_name']
      },
      
      FindLocation: {
        name: 'FindLocation',
        required: [],
        optional: ['content_type', 'content_ids']
      },
      
      SubmitApplication: {
        name: 'SubmitApplication',
        required: [],
        optional: ['content_name', 'content_ids']
      }
    };
    
    // Map custom events to standard events
    this.eventMapping = {
      // Website events
      'quiz_completed': 'CompleteRegistration',
      'quiz_started': 'ViewContent',
      'quiz_passed': 'Lead',
      'download_app': 'Lead',
      'click_app_store': 'InitiateCheckout',
      'tutorial_complete': 'CompleteRegistration',
      'video_play': 'ViewContent',
      'video_complete': 'ViewContent',
      
      // Mobile app events
      'trial_started': 'StartTrial',
      'subscription_started': 'Subscribe',
      'subscription_renewed': 'Subscribe',
      'subscription_cancelled': 'CustomEvent',
      'study_session_started': 'ViewContent',
      'study_session_completed': 'CompleteRegistration',
      'practice_test_started': 'ViewContent',
      'practice_test_completed': 'CompleteRegistration',
      'achievement_unlocked': 'CustomEvent',
      'user_signup': 'CompleteRegistration',
      'user_login': 'CustomEvent'
    };
  }
  
  /**
   * Track a standard event with proper parameters
   * @param {string} eventName - Standard event name or custom event
   * @param {Object} parameters - Event parameters
   */
  track(eventName, parameters = {}) {
    // Map custom event to standard if needed
    const standardEventName = this.eventMapping[eventName] || eventName;
    
    // Get event configuration
    const eventConfig = this.standardEvents[standardEventName];
    
    if (!eventConfig) {
      // Track as custom event
      this.trackCustom(eventName, parameters);
      return;
    }
    
    // Validate and enhance parameters
    const enhancedParams = this.enhanceParameters(standardEventName, parameters);
    
    // Add Advanced Matching data for better EMQ
    const advancedMatching = metaEMQOptimizer.getAdvancedMatchingData();
    
    // Track via pixel
    this.trackViaPixel(standardEventName, enhancedParams, advancedMatching);
    
    // Track via CAPI
    this.trackViaCAPI(standardEventName, enhancedParams);
    
    if (this.debug) {
      console.log(`Meta Standard Event: ${standardEventName}`, enhancedParams);
    }
  }
  
  /**
   * Enhance parameters based on event requirements
   */
  enhanceParameters(eventName, parameters) {
    const eventConfig = this.standardEvents[eventName];
    const enhanced = { ...parameters };
    
    // Add default parameters based on event type
    switch (eventName) {
      case 'Purchase':
      case 'AddToCart':
      case 'InitiateCheckout':
      case 'StartTrial':
      case 'Subscribe':
        // Ensure value and currency are present
        if (!enhanced.value && enhanced.price) {
          enhanced.value = enhanced.price;
        }
        if (!enhanced.currency) {
          enhanced.currency = 'USD';
        }
        // Ensure content_type
        if (!enhanced.content_type) {
          enhanced.content_type = 'product';
        }
        // Ensure content_ids
        if (!enhanced.content_ids && enhanced.product_id) {
          enhanced.content_ids = [enhanced.product_id];
        }
        break;
        
      case 'ViewContent':
        // Add content type
        if (!enhanced.content_type) {
          enhanced.content_type = enhanced.type || 'product';
        }
        // Add content IDs
        if (!enhanced.content_ids && enhanced.id) {
          enhanced.content_ids = [enhanced.id];
        }
        break;
        
      case 'CompleteRegistration':
        // Add status
        if (!enhanced.status) {
          enhanced.status = enhanced.success ? 'completed' : 'attempted';
        }
        break;
        
      case 'Lead':
        // Add content category
        if (!enhanced.content_category) {
          enhanced.content_category = enhanced.category || 'General';
        }
        break;
    }
    
    // Add event_id for deduplication
    if (!enhanced.event_id) {
      enhanced.event_id = this.generateEventId();
    }
    
    // Add source URL
    if (typeof window !== 'undefined') {
      enhanced.source_url = window.location.href;
    }
    
    return enhanced;
  }
  
  /**
   * Track via Facebook Pixel
   */
  trackViaPixel(eventName, parameters, advancedMatching) {
    if (typeof window === 'undefined' || !window.fbq) return;
    
    // Track with Advanced Matching for better EMQ
    if (Object.keys(advancedMatching).length > 0) {
      window.fbq('trackSingle', this.pixelId, eventName, parameters, advancedMatching);
    } else {
      window.fbq('track', eventName, parameters);
    }
  }
  
  /**
   * Track via Conversions API (server-side) with v23.0.1 compatibility
   */
  async trackViaCAPI(eventName, parameters) {
    if (typeof window === 'undefined') return;
    
    try {
      // Enhanced payload structure for backend v23.0.1 compatibility
      const payload = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: parameters.event_id || this.generateEventId(),
        event_source_url: parameters.source_url || window.location.href,
        action_source: 'website', // Backend expects this field
        platform: 'web', // Backend platform detection
        user_data: await this._collectEnhancedUserData(),
        custom_data: this._formatCustomDataForBackend(parameters),
        // New v23.0.1 fields for enhanced attribution
        data_processing_options: this._getDataProcessingOptions(),
        data_processing_options_country: 1, // US
        data_processing_options_state: 1000, // California
        // Additional context for better EMQ
        referrer: document.referrer || '',
        user_agent: navigator.userAgent,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language || 'en-US',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      
      // Send to backend CAPI service with enhanced headers
      const response = await fetch('/api/meta/capi/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': 'web',
          'X-Event-Source': 'pixel',
          'X-SDK-Version': 'v23.0.1',
          'X-Request-ID': this.generateRequestId(),
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (this.debug) {
          console.warn('Enhanced CAPI tracking failed:', errorText);
        }
        throw new Error(`CAPI request failed: ${response.status}`);
      }
      
      if (this.debug) {
        console.log('Enhanced CAPI event tracked successfully:', eventName);
      }
    } catch (error) {
      if (this.debug) {
        console.error('Enhanced CAPI tracking error:', error);
      }
    }
  }
  
  /**
   * Track custom event
   */
  trackCustom(eventName, parameters = {}) {
    if (typeof window === 'undefined' || !window.fbq) return;
    
    const advancedMatching = metaEMQOptimizer.getAdvancedMatchingData();
    
    if (Object.keys(advancedMatching).length > 0) {
      window.fbq('trackSingleCustom', this.pixelId, eventName, parameters, advancedMatching);
    } else {
      window.fbq('trackCustom', eventName, parameters);
    }
    
    // Also send via CAPI
    this.trackViaCAPI(eventName, parameters);
  }
  
  /**
   * Generate unique event ID for deduplication with session context
   */
  generateEventId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const sessionId = this._getSessionId();
    
    return `${sessionId}_${timestamp}_${random}`;
  }
  
  /**
   * Generate request ID for tracking
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get or create session ID for consistent tracking
   */
  _getSessionId() {
    if (!sessionStorage.getItem('meta_session_id')) {
      sessionStorage.setItem('meta_session_id', 
        `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      );
    }
    return sessionStorage.getItem('meta_session_id');
  }
  
  // Convenience methods for common events
  
  /**
   * Track page view
   */
  trackPageView(title, url) {
    this.track('PageView', {
      content_name: title,
      content_url: url
    });
  }
  
  /**
   * Track content view
   */
  trackViewContent(contentId, contentName, contentType = 'product', value = null) {
    this.track('ViewContent', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: contentType,
      value: value,
      currency: value ? 'USD' : undefined
    });
  }
  
  /**
   * Track search
   */
  trackSearch(searchString, category = null, resultsCount = null) {
    this.track('Search', {
      search_string: searchString,
      content_category: category,
      value: resultsCount
    });
  }
  
  /**
   * Track add to cart
   */
  trackAddToCart(productId, productName, value, quantity = 1) {
    this.track('AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: value,
      currency: 'USD',
      num_items: quantity
    });
  }
  
  /**
   * Track checkout initiation
   */
  trackInitiateCheckout(products, totalValue) {
    const contentIds = products.map(p => p.id);
    const numItems = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
    
    this.track('InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: numItems
    });
  }
  
  /**
   * Track purchase
   */
  trackPurchase(orderId, products, totalValue) {
    const contentIds = products.map(p => p.id);
    const contentNames = products.map(p => p.name).join(', ');
    const numItems = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
    
    this.track('Purchase', {
      order_id: orderId,
      content_ids: contentIds,
      content_name: contentNames,
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: numItems
    });
  }
  
  /**
   * Track lead
   */
  trackLead(leadType, leadSource = null, value = null) {
    this.track('Lead', {
      content_name: leadType,
      content_category: leadSource,
      value: value,
      currency: value ? 'USD' : undefined
    });
  }
  
  /**
   * Track registration
   */
  trackCompleteRegistration(registrationType, status = 'completed', value = null) {
    this.track('CompleteRegistration', {
      content_name: registrationType,
      status: status,
      value: value,
      currency: value ? 'USD' : undefined
    });
  }
  
  /**
   * Track trial start
   */
  trackStartTrial(trialType, trialLength, value = null, predictedLTV = null) {
    this.track('StartTrial', {
      content_name: trialType,
      content_id: `trial_${trialLength}_days`,
      value: value || 0,
      currency: 'USD',
      predicted_ltv: predictedLTV
    });
  }
  
  /**
   * Track subscription
   */
  trackSubscribe(subscriptionType, value, predictedLTV = null) {
    this.track('Subscribe', {
      content_name: subscriptionType,
      content_id: subscriptionType.toLowerCase().replace(/\s+/g, '_'),
      value: value,
      currency: 'USD',
      predicted_ltv: predictedLTV || value * 12 // Assume annual LTV if not provided
    });
  }
  
  /**
   * Get event validation report
   */
  getValidationReport() {
    const report = {
      standardEventsConfigured: Object.keys(this.standardEvents).length,
      customEventMappings: Object.keys(this.eventMapping).length,
      recommendations: []
    };
    
    // Check for common issues
    if (typeof window !== 'undefined' && !window.fbq) {
      report.recommendations.push('Facebook Pixel not installed');
    }
    
    if (!this.pixelId) {
      report.recommendations.push('Pixel ID not configured');
    }
    
    // Check EMQ score
    const emqScore = metaEMQOptimizer.calculateCurrentEMQ();
    if (emqScore < 8.0) {
      report.recommendations.push(`Improve EMQ score (current: ${emqScore}/10)`);
    }
    
    report.status = report.recommendations.length === 0 ? 'optimal' : 'needs_improvement';
    
    return report;
  }
  
  /**
   * Collect enhanced user data for better EMQ and v23.0.1 compatibility
   */
  async _collectEnhancedUserData() {
    const userData = metaEMQOptimizer.getServerData();
    
    // Add enhanced fields for better attribution
    return {
      ...userData,
      // Enhanced fields for v23.0.1
      client_ip_address: await this._getClientIP(),
      client_user_agent: navigator.userAgent,
      fbc: this._getFacebookClickId(),
      fbp: this._getFacebookBrowserId(),
      // Additional advanced matching data
      subscription_id: await this._getSubscriptionId(),
      lead_id: await this._getLeadId(),
      // Browser and session context
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: screen.width,
      screen_height: screen.height,
      pixel_ratio: window.devicePixelRatio || 1,
      timezone_offset: new Date().getTimezoneOffset(),
      session_duration: this._getSessionDuration(),
    };
  }
  
  /**
   * Format custom data for backend compatibility
   */
  _formatCustomDataForBackend(parameters) {
    const formatted = { ...parameters };
    
    // Ensure standard commerce fields
    if (formatted.value && !formatted.currency) {
      formatted.currency = 'USD';
    }
    
    // Ensure content type for better categorization
    if (!formatted.content_type) {
      formatted.content_type = 'product';
    }
    
    // Add content IDs array if individual content_id provided
    if (formatted.content_id && !formatted.content_ids) {
      formatted.content_ids = [formatted.content_id];
    }
    
    // Remove undefined values
    Object.keys(formatted).forEach(key => {
      if (formatted[key] === undefined) {
        delete formatted[key];
      }
    });
    
    return formatted;
  }
  
  /**
   * Get data processing options for privacy compliance
   */
  _getDataProcessingOptions() {
    // Check if user is in CCPA jurisdiction
    if (this._isCCPAUser()) {
      return ['LDU']; // Limited Data Use
    }
    return [];
  }
  
  /**
   * Check if user is in CCPA jurisdiction
   */
  _isCCPAUser() {
    try {
      // Simple check based on timezone - in production, use more sophisticated geo-detection
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return timezone && timezone.includes('Los_Angeles');
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Get client IP address (placeholder)
   */
  async _getClientIP() {
    try {
      // In production, you might use a service to get the public IP
      // For now, return null and let the backend determine it
      return null;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get Facebook Click ID from URL or storage
   */
  _getFacebookClickId() {
    try {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const fbclid = urlParams.get('fbclid');
      
      if (fbclid) {
        // Store for future use
        localStorage.setItem('_fbc', `fb.1.${Date.now()}.${fbclid}`);
        return `fb.1.${Date.now()}.${fbclid}`;
      }
      
      // Get from storage
      return localStorage.getItem('_fbc') || null;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get Facebook Browser ID from storage or create new one
   */
  _getFacebookBrowserId() {
    try {
      let fbp = localStorage.getItem('_fbp');
      
      if (!fbp) {
        // Generate new FBP
        fbp = `fb.1.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('_fbp', fbp);
      }
      
      return fbp;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get subscription ID if user is subscribed
   */
  async _getSubscriptionId() {
    try {
      // Get from local storage or API call
      return localStorage.getItem('subscription_id') || null;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get lead ID for lead attribution
   */
  async _getLeadId() {
    try {
      // Get from local storage or generate if qualifying action taken
      return localStorage.getItem('lead_id') || null;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get session duration in seconds
   */
  _getSessionDuration() {
    try {
      const sessionStart = sessionStorage.getItem('session_start_time');
      if (!sessionStart) {
        const now = Date.now();
        sessionStorage.setItem('session_start_time', now.toString());
        return 0;
      }
      
      return Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
    } catch (e) {
      return 0;
    }
  }
}

// Create singleton instance
const metaStandardEvents = new MetaStandardEvents();

export default metaStandardEvents;