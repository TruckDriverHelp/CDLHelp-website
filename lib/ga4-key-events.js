/**
 * GA4 Key Events Configuration for Google Ads Import
 * Configures key conversion events to be imported into Google Ads
 */

class GA4KeyEvents {
  constructor() {
    // Define key events (formerly conversions) to track
    this.keyEvents = {
      // Primary conversion events (for Google Ads import)
      trial_started: {
        name: 'trial_started',
        category: 'engagement',
        value: 0, // No monetary value for trials
        import_to_ads: true,
        parameters: {
          trial_type: null,
          trial_days: null,
        }
      },
      
      sign_up: {
        name: 'sign_up',
        category: 'engagement',
        value: 0,
        import_to_ads: true,
        parameters: {
          method: 'email',
        }
      },
      
      // Secondary actions (not for purchase optimization)
      add_to_cart: {
        name: 'add_to_cart',
        category: 'ecommerce',
        value: 0,
        import_to_ads: true,
        parameters: {
          currency: 'USD',
          value: null,
          items: []
        }
      },
      
      begin_checkout: {
        name: 'begin_checkout',
        category: 'ecommerce',
        value: 0,
        import_to_ads: true,
        parameters: {
          currency: 'USD',
          value: null,
          items: []
        }
      },
      
      // Primary purchase event (handled separately for ROAS)
      purchase: {
        name: 'purchase',
        category: 'ecommerce',
        value: null, // Dynamic value
        import_to_ads: false, // Already tracked via enhanced conversions
        parameters: {
          transaction_id: null,
          value: null,
          currency: 'USD',
          items: []
        }
      },
      
      // Engagement events for quality scoring
      quiz_completed: {
        name: 'quiz_completed',
        category: 'engagement',
        value: 0,
        import_to_ads: true,
        parameters: {
          quiz_type: null,
          score: null,
          passed: null
        }
      },
      
      first_quiz_passed: {
        name: 'first_quiz_passed',
        category: 'engagement',
        value: 0,
        import_to_ads: true,
        parameters: {
          quiz_type: null,
          score: null
        }
      },
      
      // App-specific events
      app_tutorial_complete: {
        name: 'tutorial_complete',
        category: 'engagement',
        value: 0,
        import_to_ads: true,
        parameters: {}
      },
      
      // Lead generation events
      generate_lead: {
        name: 'generate_lead',
        category: 'engagement',
        value: 0,
        import_to_ads: true,
        parameters: {
          lead_source: null
        }
      },
      
      // Content engagement
      view_item: {
        name: 'view_item',
        category: 'engagement',
        value: 0,
        import_to_ads: false, // Too frequent, not a key event
        parameters: {
          item_id: null,
          item_name: null,
          item_category: null
        }
      },
      
      // Session quality indicators
      engaged_session: {
        name: 'user_engagement',
        category: 'engagement',
        value: 0,
        import_to_ads: false, // Automatic GA4 event
        parameters: {
          engagement_time_msec: null
        }
      }
    };
    
    this.initialized = false;
    this.debug = false;
  }
  
  /**
   * Initialize GA4 key events configuration
   */
  init() {
    if (this.initialized) return;
    
    // Mark configured events as conversions in GA4
    this.configureKeyEvents();
    
    // Set up Google Ads import
    this.setupGoogleAdsImport();
    
    // Configure custom parameters
    this.configureCustomDimensions();
    
    this.initialized = true;
    
    if (this.debug) {
      console.log('GA4 Key Events initialized:', this.keyEvents);
    }
  }
  
  /**
   * Configure events as key events (conversions) in GA4
   */
  configureKeyEvents() {
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('gtag not available for key events configuration');
      return;
    }
    
    // Configure each key event
    Object.entries(this.keyEvents).forEach(([eventName, config]) => {
      if (config.import_to_ads) {
        // These need to be marked as conversions in GA4 UI
        // Sending configuration hints to GA4
        window.gtag('event', 'config_hint', {
          event_category: 'ga4_configuration',
          event_label: `mark_as_conversion:${eventName}`,
          non_interaction: true
        });
      }
    });
    
    // Set up Enhanced Ecommerce for better tracking
    window.gtag('set', {
      'currency': 'USD',
      'country': 'US'
    });
  }
  
  /**
   * Configure Google Ads import settings
   */
  setupGoogleAdsImport() {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    // Configure Google Ads conversion tracking
    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-11366664092';
    
    // Import configuration for each key event
    Object.entries(this.keyEvents).forEach(([eventName, config]) => {
      if (config.import_to_ads) {
        // Configure as Google Ads conversion
        window.gtag('config', googleAdsId, {
          'conversion_events': [eventName],
          'conversion_linker': true,
          'phone_conversion_number': process.env.NEXT_PUBLIC_PHONE_NUMBER,
          'phone_conversion_callback': () => {
            this.trackEvent('phone_call_conversion');
          }
        });
      }
    });
    
    // Enable conversion linker for cross-domain tracking
    window.gtag('set', 'linker', {
      'domains': ['cdlhelp.com', 'app.cdlhelp.com'],
      'accept_incoming': true
    });
  }
  
  /**
   * Configure custom dimensions and metrics
   */
  configureCustomDimensions() {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    // Custom dimensions for better segmentation
    const customDimensions = {
      'user_type': 'dimension1',
      'subscription_status': 'dimension2',
      'language': 'dimension3',
      'quiz_count': 'metric1',
      'ltv': 'metric2'
    };
    
    // Set up custom dimensions
    Object.entries(customDimensions).forEach(([name, dimension]) => {
      window.gtag('config', window.GA_MEASUREMENT_ID, {
        'custom_map': { [dimension]: name }
      });
    });
  }
  
  /**
   * Track a key event
   * @param {string} eventName - Name of the event
   * @param {Object} parameters - Event parameters
   */
  trackEvent(eventName, parameters = {}) {
    const eventConfig = this.keyEvents[eventName];
    
    if (!eventConfig) {
      console.warn(`Unknown key event: ${eventName}`);
      return;
    }
    
    // Merge default parameters with provided ones
    const eventParams = {
      ...eventConfig.parameters,
      ...parameters,
      event_category: eventConfig.category,
      send_to: 'GA4' // Ensure it goes to GA4
    };
    
    // Add value if specified
    if (eventConfig.value !== null || parameters.value) {
      eventParams.value = parameters.value || eventConfig.value;
    }
    
    // Add currency for ecommerce events
    if (eventConfig.category === 'ecommerce' && !eventParams.currency) {
      eventParams.currency = 'USD';
    }
    
    // Track the event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventConfig.name, eventParams);
      
      if (this.debug) {
        console.log(`GA4 Key Event tracked: ${eventConfig.name}`, eventParams);
      }
      
      // Also track to Google Ads if configured
      if (eventConfig.import_to_ads) {
        this.trackToGoogleAds(eventConfig.name, eventParams);
      }
    }
  }
  
  /**
   * Track event specifically to Google Ads
   * @param {string} eventName - Event name
   * @param {Object} parameters - Event parameters
   */
  trackToGoogleAds(eventName, parameters) {
    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-11366664092';
    
    // Map GA4 events to Google Ads conversion actions
    const conversionMap = {
      'trial_started': 'start_trial',
      'sign_up': 'sign_up',
      'add_to_cart': 'add_to_cart',
      'begin_checkout': 'begin_checkout',
      'quiz_completed': 'complete_registration',
      'first_quiz_passed': 'submit_lead_form',
      'tutorial_complete': 'complete_registration',
      'generate_lead': 'submit_lead_form'
    };
    
    const conversionAction = conversionMap[eventName];
    if (!conversionAction) return;
    
    // Send conversion to Google Ads
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `${googleAdsId}/${conversionAction}`,
        'value': parameters.value || 0,
        'currency': parameters.currency || 'USD',
        'transaction_id': parameters.transaction_id || Date.now().toString()
      });
      
      if (this.debug) {
        console.log(`Google Ads conversion tracked: ${conversionAction}`);
      }
    }
  }
  
  /**
   * Track trial start as key event
   * @param {string} trialType - Type of trial
   * @param {number} trialDays - Number of trial days
   */
  trackTrialStart(trialType, trialDays = 7) {
    this.trackEvent('trial_started', {
      trial_type: trialType,
      trial_days: trialDays,
      method: 'credit_card'
    });
  }
  
  /**
   * Track sign up as key event
   * @param {string} method - Sign up method
   */
  trackSignUp(method = 'email') {
    this.trackEvent('sign_up', {
      method: method
    });
  }
  
  /**
   * Track add to cart
   * @param {Object} item - Item added to cart
   * @param {number} value - Cart value
   */
  trackAddToCart(item, value) {
    this.trackEvent('add_to_cart', {
      currency: 'USD',
      value: value,
      items: [item]
    });
  }
  
  /**
   * Track checkout begin
   * @param {Array} items - Items in cart
   * @param {number} value - Total value
   */
  trackBeginCheckout(items, value) {
    this.trackEvent('begin_checkout', {
      currency: 'USD',
      value: value,
      items: items,
      coupon: items[0]?.coupon || null
    });
  }
  
  /**
   * Track quiz completion
   * @param {string} quizType - Type of quiz
   * @param {number} score - Quiz score
   * @param {boolean} passed - Whether quiz was passed
   */
  trackQuizComplete(quizType, score, passed) {
    this.trackEvent('quiz_completed', {
      quiz_type: quizType,
      score: score,
      passed: passed
    });
    
    // Track first pass as separate event
    if (passed && this.isFirstPass()) {
      this.trackEvent('first_quiz_passed', {
        quiz_type: quizType,
        score: score
      });
    }
  }
  
  /**
   * Check if this is the first quiz pass
   * @returns {boolean} True if first pass
   */
  isFirstPass() {
    const passCount = parseInt(localStorage.getItem('quiz_pass_count') || '0');
    if (passCount === 0) {
      localStorage.setItem('quiz_pass_count', '1');
      return true;
    }
    localStorage.setItem('quiz_pass_count', (passCount + 1).toString());
    return false;
  }
  
  /**
   * Get import status for debugging
   * @returns {Object} Import status
   */
  getImportStatus() {
    const importableEvents = Object.entries(this.keyEvents)
      .filter(([_, config]) => config.import_to_ads)
      .map(([name, config]) => ({
        name: name,
        category: config.category,
        configured: true
      }));
    
    return {
      total_events: Object.keys(this.keyEvents).length,
      importable_events: importableEvents.length,
      events: importableEvents,
      initialized: this.initialized
    };
  }
  
  /**
   * Validate event tracking setup
   */
  validateSetup() {
    const issues = [];
    
    // Check if gtag is available
    if (typeof window === 'undefined' || !window.gtag) {
      issues.push('gtag not found - GA4 may not be properly installed');
    }
    
    // Check if Google Ads ID is configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) {
      issues.push('Google Ads ID not configured in environment variables');
    }
    
    // Check if GA4 Measurement ID is configured
    if (!window.GA_MEASUREMENT_ID) {
      issues.push('GA4 Measurement ID not found');
    }
    
    // Check conversion linker
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('get', window.GA_MEASUREMENT_ID, 'linker', (linker) => {
        if (!linker) {
          issues.push('Conversion linker not enabled');
        }
      });
    }
    
    if (issues.length > 0) {
      console.warn('GA4 Key Events setup issues:', issues);
      return false;
    }
    
    console.log('GA4 Key Events setup validated successfully');
    return true;
  }
}

// Create singleton instance
const ga4KeyEvents = new GA4KeyEvents();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ga4KeyEvents.init());
  } else {
    ga4KeyEvents.init();
  }
}

export default ga4KeyEvents;