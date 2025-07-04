/**
 * Unified Analytics Module for CDLHelp
 * Handles tracking across GA4, Meta Pixel, and AppsFlyer
 */

import consentManager from './consent-manager';

class Analytics {
  constructor() {
    this.initialized = false;
    this.debug = process.env.NODE_ENV === 'development';
  }

  /**
   * Initialize all analytics platforms
   */
  init() {
    if (this.initialized) return;

    // Only initialize if we have consent
    if (!consentManager.hasConsent('analytics') && !consentManager.hasConsent('marketing')) {
      this.log('Analytics not initialized - no consent');
      return;
    }

    // Initialize Google Analytics (analytics consent)
    if (typeof window !== 'undefined' && window.gtag && consentManager.hasConsent('analytics')) {
      this.gtag = window.gtag;
    }

    // Initialize Facebook Pixel (marketing consent)
    if (typeof window !== 'undefined' && window.fbq && consentManager.hasConsent('marketing')) {
      this.fbq = window.fbq;
    }

    // Initialize AppsFlyer (marketing consent)
    if (consentManager.hasConsent('marketing')) {
      this.initAppsFlyer();
    }

    this.initialized = true;
    this.log('Analytics initialized');
  }

  /**
   * Initialize AppsFlyer Web SDK
   */
  initAppsFlyer() {
    if (typeof window === 'undefined') return;

    // AppsFlyer Web SDK configuration
    window.AF_SDK_CONFIG = {
      appId: process.env.NEXT_PUBLIC_APPSFLYER_APP_ID || 'help.truckdriver.cdlhelp',
      devKey: process.env.NEXT_PUBLIC_APPSFLYER_DEV_KEY || '',
      isDebug: this.debug,
      oneLinkId: process.env.NEXT_PUBLIC_APPSFLYER_ONELINK_ID || '',
      timeoutInterval: 5000,
    };

    // Load AppsFlyer SDK asynchronously
    const script = document.createElement('script');
    script.src = 'https://websdk.appsflyer.com/v2/websdk.min.js';
    script.async = true;
    script.onload = () => {
      this.log('AppsFlyer SDK loaded');
      this.af = window.AF;
      if (this.af && window.AF_SDK_CONFIG.devKey) {
        this.af('init', window.AF_SDK_CONFIG);
      }
    };
    document.head.appendChild(script);
  }

  /**
   * Track page views across all platforms
   */
  trackPageView(url, title) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
        page_title: title,
        cookieFlags: 'SameSite=None; Secure',
      });
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'PageView', {
        page: url,
        title: title,
      });
    }

    // AppsFlyer
    if (this.af && consentManager.hasConsent('marketing')) {
      this.af('event', 'page_view', {
        page: url,
        title: title,
      });
    }

    this.log('Page view tracked:', { url, title });
  }

  /**
   * Track app download intents with attribution
   */
  trackDownloadIntent(platform, source = 'website', campaign = null) {
    const campaignParams = this.getCampaignParams();
    const eventData = {
      platform,
      source,
      campaign: campaign || campaignParams,
      timestamp: new Date().toISOString(),
      // Include partner-specific IDs for better attribution
      partner_ids: {
        gclid: campaignParams.gclid, // Google Click ID
        fbclid: campaignParams.fbclid, // Facebook Click ID
        ttclid: campaignParams.ttclid, // TikTok Click ID
        msclkid: campaignParams.msclkid, // Microsoft Click ID
      },
    };

    // Google Analytics 4 - Enhanced Ecommerce
    if (this.gtag) {
      this.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: 0,
        items: [
          {
            item_id: 'cdlhelp_app',
            item_name: 'CDL Help App',
            item_category: 'Mobile App',
            item_variant: platform,
            price: 0,
            quantity: 1,
          },
        ],
      });

      // Custom event for download intent
      this.gtag('event', 'download_intent', {
        event_category: 'App',
        event_label: platform,
        value: 1,
        ...eventData,
      });
    }

    // Facebook Pixel - Standard and Custom Events
    if (this.fbq && consentManager.hasConsent('marketing')) {
      // Standard InitiateCheckout event
      this.fbq('track', 'InitiateCheckout', {
        content_category: 'Mobile App',
        content_ids: ['cdlhelp_app'],
        content_type: 'product',
        currency: 'USD',
        value: 0,
      });

      // Custom event for platform-specific tracking
      this.fbq('trackCustom', `DownloadIntent_${platform}`, eventData);
    }

    // AppsFlyer - Pre-install attribution
    if (this.af && consentManager.hasConsent('marketing')) {
      this.af('event', 'download_intent', {
        af_platform: platform,
        af_channel: source,
        ...eventData,
      });
    }

    this.log('Download intent tracked:', eventData);
  }

  /**
   * Track actual app store redirects with attribution preservation
   */
  trackAppStoreRedirect(platform, finalUrl) {
    const eventData = {
      platform,
      url: finalUrl,
      campaign: this.getCampaignParams(),
    };

    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'app_store_redirect', {
        event_category: 'App',
        event_label: platform,
        event_value: 1,
        ...eventData,
      });
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'Lead', {
        content_category: 'App Download',
        content_name: platform,
        ...eventData,
      });
    }

    // AppsFlyer OneLink attribution
    if (this.af) {
      this.af('event', 'app_store_click', eventData);
    }

    this.log('App store redirect tracked:', eventData);
  }

  /**
   * Track feature engagement for optimization
   */
  trackFeatureEngagement(feature, action, value = null) {
    const eventData = {
      feature,
      action,
      value,
      timestamp: new Date().toISOString(),
    };

    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'feature_engagement', {
        event_category: 'Engagement',
        event_label: `${feature}_${action}`,
        value: value || 0,
        ...eventData,
      });
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('trackCustom', 'FeatureEngagement', eventData);
    }

    this.log('Feature engagement tracked:', eventData);
  }

  /**
   * Track quiz/test completions for conversion optimization
   */
  trackQuizCompletion(score, totalQuestions, locale) {
    const completionRate = ((score / totalQuestions) * 100).toFixed(2);
    const eventData = {
      score,
      total_questions: totalQuestions,
      completion_rate: completionRate,
      locale,
      passed: score >= totalQuestions * 0.8,
    };

    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'quiz_completed', {
        event_category: 'Engagement',
        event_label: 'Quiz Completion',
        value: score,
        ...eventData,
      });

      // Track as conversion if passed
      if (eventData.passed) {
        this.gtag('event', 'conversion', {
          send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}/quiz_pass`,
        });
      }
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'CompleteRegistration', {
        content_name: 'Quiz',
        status: eventData.passed ? 'Passed' : 'Failed',
        value: completionRate,
        ...eventData,
      });
    }

    // AppsFlyer
    if (this.af && consentManager.hasConsent('marketing')) {
      this.af('event', 'quiz_complete', eventData);
    }

    this.log('Quiz completion tracked:', eventData);
  }

  /**
   * Track video engagement
   */
  trackVideoEngagement(videoId, action, duration = null) {
    const eventData = {
      video_id: videoId,
      action,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', `video_${action}`, {
        event_category: 'Video',
        event_label: videoId,
        value: duration || 0,
        ...eventData,
      });
    }

    // Facebook Pixel
    if (this.fbq && action === 'complete') {
      this.fbq('track', 'ViewContent', {
        content_ids: [videoId],
        content_type: 'video',
        content_category: 'Educational',
        ...eventData,
      });
    }

    this.log('Video engagement tracked:', eventData);
  }

  /**
   * Get campaign parameters from URL
   */
  getCampaignParams() {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || 'direct',
      utm_medium: urlParams.get('utm_medium') || 'none',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
      gclid: urlParams.get('gclid') || '',
      fbclid: urlParams.get('fbclid') || '',
      referrer: document.referrer || '',
    };
  }

  /**
   * Set user properties for segmentation
   */
  setUserProperties(properties) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('set', 'user_properties', properties);
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'UserProperties', properties);
    }

    // AppsFlyer
    if (this.af && consentManager.hasConsent('marketing')) {
      this.af('setUserProperties', properties);
    }

    this.log('User properties set:', properties);
  }

  /**
   * Debug logging
   */
  log(...args) {
    if (this.debug) {
      console.log('[Analytics]', ...args);
    }
  }
}

// Export singleton instance
const analytics = new Analytics();
export default analytics;

// Convenience export for tracking functions
export const {
  trackPageView,
  trackDownloadIntent,
  trackAppStoreRedirect,
  trackFeatureEngagement,
  trackQuizCompletion,
  trackVideoEngagement,
  setUserProperties,
} = {
  trackPageView: (...args) => analytics.trackPageView(...args),
  trackDownloadIntent: (...args) => analytics.trackDownloadIntent(...args),
  trackAppStoreRedirect: (...args) => analytics.trackAppStoreRedirect(...args),
  trackFeatureEngagement: (...args) => analytics.trackFeatureEngagement(...args),
  trackQuizCompletion: (...args) => analytics.trackQuizCompletion(...args),
  trackVideoEngagement: (...args) => analytics.trackVideoEngagement(...args),
  setUserProperties: (...args) => analytics.setUserProperties(...args),
};
