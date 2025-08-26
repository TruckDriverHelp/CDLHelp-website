/**
 * DataLayer Manager for CDL Help Website
 * Implements Enhanced Ecommerce and structured event tracking as identified in Google Tags audit
 * Follows Google Analytics 4 Enhanced Ecommerce specification
 */

class DataLayerManager {
  constructor() {
    this.debug = process.env.NODE_ENV === 'development';
    
    // Initialize dataLayer if not already present
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      this.dataLayer = window.dataLayer;
    }
    
    // CDL Help specific configuration
    this.siteConfig = {
      currency: 'USD',
      language: 'en',
      country: 'US',
      business_type: 'education',
      industry: 'cdl_training'
    };
    
    this.init();
  }

  /**
   * Initialize dataLayer with site configuration
   */
  init() {
    if (typeof window === 'undefined') return;
    
    this.push({
      'event': 'datalayer_initialized',
      'site_config': this.siteConfig,
      'timestamp': new Date().toISOString()
    });
    
    if (this.debug) {
      console.log('DataLayer Manager initialized');
    }
  }

  /**
   * Base push method with debugging
   */
  push(data) {
    if (typeof window === 'undefined') return;
    
    try {
      // Add common metadata
      const eventData = {
        ...data,
        'client_timestamp': Date.now(),
        'page_location': window.location.href,
        'page_referrer': document.referrer || '',
        'user_agent': navigator.userAgent,
        'viewport_size': `${window.innerWidth}x${window.innerHeight}`
      };
      
      this.dataLayer.push(eventData);
      
      if (this.debug) {
        console.log('DataLayer Push:', eventData);
      }
      
      return eventData;
    } catch (error) {
      console.error('DataLayer push error:', error);
    }
  }

  // ======================
  // PAGE TRACKING
  // ======================

  /**
   * Track page views with CDL Help specific context
   */
  trackPageView(data = {}) {
    const pageData = {
      'event': 'page_view',
      'page_title': document.title || '',
      'page_location': window.location.href,
      'page_path': window.location.pathname,
      'content_group1': this._getContentGroup(window.location.pathname),
      'content_group2': this._getPageType(window.location.pathname),
      'language': this._getCurrentLanguage(),
      ...data
    };
    
    return this.push(pageData);
  }

  /**
   * Track virtual page views for SPA navigation
   */
  trackVirtualPageView(path, title = '') {
    return this.trackPageView({
      'page_path': path,
      'page_title': title || document.title,
      'navigation_type': 'virtual'
    });
  }

  // ======================
  // USER EVENTS
  // ======================

  /**
   * Track user signup with proper Enhanced Ecommerce structure
   */
  trackSignup(userData = {}) {
    const signupData = {
      'event': 'sign_up',
      'method': userData.method || 'email',
      'user_properties': {
        'user_type': userData.userType || 'driver',
        'signup_source': userData.source || 'direct',
        'language': userData.language || this._getCurrentLanguage()
      },
      'custom_parameters': {
        'signup_page': window.location.pathname,
        'referrer_domain': this._extractDomain(document.referrer)
      },
      ...userData
    };
    
    return this.push(signupData);
  }

  /**
   * Track user login
   */
  trackLogin(userData = {}) {
    const loginData = {
      'event': 'login',
      'method': userData.method || 'email',
      'user_properties': {
        'user_type': userData.userType || 'driver',
        'returning_user': userData.returning || true
      },
      ...userData
    };
    
    return this.push(loginData);
  }

  // ======================
  // ENHANCED ECOMMERCE - PURCHASES
  // ======================

  /**
   * Track subscription purchase (RevenueCat/Stripe) - CRITICAL FIX
   */
  trackPurchase(purchaseData) {
    const {
      transactionId,
      value,
      currency = 'USD',
      items = [],
      coupon = null,
      subscriptionType = 'monthly'
    } = purchaseData;

    const ecommerceData = {
      'event': 'purchase',
      'transaction_id': transactionId,
      'value': parseFloat(value),
      'currency': currency,
      'coupon': coupon,
      'ecommerce': {
        'transaction_id': transactionId,
        'value': parseFloat(value),
        'currency': currency,
        'coupon': coupon,
        'items': items.map(item => ({
          'item_id': item.itemId || item.sku,
          'item_name': item.itemName || item.name,
          'item_category': item.category || 'subscription',
          'item_category2': subscriptionType,
          'price': parseFloat(item.price || value),
          'quantity': parseInt(item.quantity || 1),
          'item_brand': 'CDL Help',
          'item_variant': item.variant || subscriptionType
        }))
      },
      'custom_parameters': {
        'subscription_type': subscriptionType,
        'payment_method': purchaseData.paymentMethod || 'unknown',
        'trial_period': purchaseData.trialPeriod || null,
        'billing_cycle': purchaseData.billingCycle || 'monthly'
      }
    };

    return this.push(ecommerceData);
  }

  /**
   * Track subscription renewal
   */
  trackSubscriptionRenew(renewalData) {
    const {
      transactionId,
      value,
      currency = 'USD',
      subscriptionType = 'monthly'
    } = renewalData;

    const renewData = {
      'event': 'subscription_renew',
      'transaction_id': transactionId,
      'value': parseFloat(value),
      'currency': currency,
      'ecommerce': {
        'transaction_id': transactionId,
        'value': parseFloat(value),
        'currency': currency,
        'items': [{
          'item_id': `subscription_${subscriptionType}`,
          'item_name': `CDL Help ${subscriptionType} Subscription`,
          'item_category': 'subscription_renewal',
          'price': parseFloat(value),
          'quantity': 1
        }]
      },
      'custom_parameters': {
        'subscription_type': subscriptionType,
        'renewal_number': renewalData.renewalNumber || 1
      }
    };

    return this.push(renewData);
  }

  /**
   * Track subscription cancellation
   */
  trackSubscriptionCancel(cancelData) {
    const cancelEvent = {
      'event': 'subscription_cancel',
      'subscription_type': cancelData.subscriptionType || 'monthly',
      'cancel_reason': cancelData.reason || 'user_initiated',
      'subscription_value': parseFloat(cancelData.value || 0),
      'currency': 'USD',
      'custom_parameters': {
        'subscription_duration_days': cancelData.durationDays || 0,
        'cancel_source': cancelData.source || 'app'
      }
    };

    return this.push(cancelEvent);
  }

  // ======================
  // ENHANCED ECOMMERCE - FUNNEL
  // ======================

  /**
   * Track trial start
   */
  trackTrialStart(trialData) {
    const trialEvent = {
      'event': 'begin_checkout',
      'currency': 'USD',
      'value': parseFloat(trialData.futureValue || 0),
      'ecommerce': {
        'currency': 'USD',
        'value': 0, // Trial is free
        'items': [{
          'item_id': `trial_${trialData.trialType || 'premium'}`,
          'item_name': `CDL Help ${trialData.trialType || 'Premium'} Trial`,
          'item_category': 'trial',
          'price': 0,
          'quantity': 1
        }]
      },
      'custom_parameters': {
        'trial_length_days': trialData.trialLengthDays || 7,
        'trial_type': trialData.trialType || 'premium',
        'conversion_value': parseFloat(trialData.futureValue || 0)
      }
    };

    return this.push(trialEvent);
  }

  // ======================
  // CDL HELP SPECIFIC EVENTS
  // ======================

  /**
   * Track quiz completion - key conversion for CDL Help
   */
  trackQuizComplete(quizData) {
    const quizEvent = {
      'event': 'quiz_complete',
      'quiz_id': quizData.quizId,
      'quiz_name': quizData.quizName,
      'quiz_category': quizData.category || 'practice_test',
      'score': parseInt(quizData.score || 0),
      'total_questions': parseInt(quizData.totalQuestions || 0),
      'correct_answers': parseInt(quizData.correctAnswers || 0),
      'time_spent': parseInt(quizData.timeSpent || 0),
      'passed': quizData.passed === true,
      'custom_parameters': {
        'difficulty_level': quizData.difficulty || 'medium',
        'language': quizData.language || this._getCurrentLanguage(),
        'attempt_number': quizData.attemptNumber || 1
      }
    };

    return this.push(quizEvent);
  }

  /**
   * Track quiz start
   */
  trackQuizStart(quizData) {
    const quizStartEvent = {
      'event': 'quiz_start',
      'quiz_id': quizData.quizId,
      'quiz_name': quizData.quizName,
      'quiz_category': quizData.category || 'practice_test',
      'custom_parameters': {
        'difficulty_level': quizData.difficulty || 'medium',
        'language': quizData.language || this._getCurrentLanguage()
      }
    };

    return this.push(quizStartEvent);
  }

  /**
   * Track mobile app download - key conversion
   */
  trackAppDownload(downloadData = {}) {
    const downloadEvent = {
      'event': 'app_download',
      'platform': downloadData.platform || 'unknown', // ios, android
      'download_source': downloadData.source || 'website',
      'value': 5.00, // Estimated conversion value
      'currency': 'USD',
      'custom_parameters': {
        'page_location': window.location.pathname,
        'cta_position': downloadData.ctaPosition || 'unknown'
      }
    };

    return this.push(downloadEvent);
  }

  /**
   * Track language selection
   */
  trackLanguageSelection(language) {
    const langEvent = {
      'event': 'language_selection',
      'language': language,
      'previous_language': this._getCurrentLanguage(),
      'custom_parameters': {
        'selection_method': 'manual',
        'page_location': window.location.pathname
      }
    };

    return this.push(langEvent);
  }

  /**
   * Track content engagement
   */
  trackContentEngagement(contentData) {
    const engagementEvent = {
      'event': 'content_engagement',
      'content_type': contentData.type || 'article',
      'content_id': contentData.id || '',
      'content_title': contentData.title || '',
      'engagement_type': contentData.engagementType || 'view', // view, scroll, time_spent
      'engagement_value': contentData.value || 1,
      'custom_parameters': {
        'content_category': contentData.category || 'educational',
        'language': contentData.language || this._getCurrentLanguage()
      }
    };

    return this.push(engagementEvent);
  }

  // ======================
  // CONVERSION EVENTS
  // ======================

  /**
   * Track lead generation
   */
  trackLead(leadData) {
    const leadEvent = {
      'event': 'generate_lead',
      'lead_type': leadData.type || 'contact_form',
      'value': parseFloat(leadData.value || 2.50), // Estimated lead value
      'currency': 'USD',
      'custom_parameters': {
        'form_id': leadData.formId || '',
        'lead_source': leadData.source || 'website',
        'contact_method': leadData.contactMethod || 'form'
      }
    };

    return this.push(leadEvent);
  }

  // ======================
  // UTILITY METHODS
  // ======================

  /**
   * Get current language from URL or localStorage
   */
  _getCurrentLanguage() {
    if (typeof window === 'undefined') return 'en';
    
    // Check URL path for language
    const pathLang = window.location.pathname.match(/^\/([a-z]{2})\//);
    if (pathLang) return pathLang[1];
    
    // Check localStorage
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang) return storedLang;
    
    // Default
    return 'en';
  }

  /**
   * Get content group based on URL path
   */
  _getContentGroup(path) {
    if (path.includes('/quiz')) return 'quiz';
    if (path.includes('/practice')) return 'practice_test';
    if (path.includes('/study')) return 'study_material';
    if (path.includes('/download')) return 'app_download';
    if (path === '/' || path.match(/^\/[a-z]{2}\/?$/)) return 'homepage';
    return 'other';
  }

  /**
   * Get page type
   */
  _getPageType(path) {
    if (path === '/' || path.match(/^\/[a-z]{2}\/?$/)) return 'homepage';
    if (path.includes('/quiz')) return 'quiz_page';
    if (path.includes('/download')) return 'download_page';
    if (path.includes('/pricing')) return 'pricing_page';
    if (path.includes('/contact')) return 'contact_page';
    return 'content_page';
  }

  /**
   * Extract domain from URL
   */
  _extractDomain(url) {
    if (!url) return '';
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  /**
   * Get enhanced ecommerce event validation
   */
  validateEcommerceEvent(eventData) {
    const required = ['event', 'transaction_id', 'value', 'currency'];
    const missing = required.filter(field => !eventData[field]);
    
    if (missing.length > 0) {
      console.warn('Missing required ecommerce fields:', missing);
      return false;
    }
    
    return true;
  }
}

// Export singleton instance
const dataLayerManager = new DataLayerManager();

// Expose globally for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.dataLayerManager = dataLayerManager;
}

export default dataLayerManager;