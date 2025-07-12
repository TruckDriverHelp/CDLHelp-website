/**
 * Unified Analytics Module for CDLHelp
 * Handles tracking across GA4, Meta Pixel, and AppsFlyer
 */

import consentManager from './consent-manager';

class Analytics {
  constructor() {
    this.initialized = false;
    this.debug = process.env.NODE_ENV === 'development';

    // Initialize advanced features
    if (typeof window !== 'undefined') {
      this.initPerformanceMonitoring();
    }
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

    // Initialize Google Ads (marketing consent)
    if (typeof window !== 'undefined' && window.gtag && consentManager.hasConsent('marketing')) {
      this.gads = window.gtag; // Same gtag function, different consent
    }

    // Initialize Facebook Pixel (marketing consent)
    if (typeof window !== 'undefined' && window.fbq && consentManager.hasConsent('marketing')) {
      this.fbq = window.fbq;
    }

    // Initialize Smartlook (analytics consent)
    if (consentManager.hasConsent('analytics')) {
      this.initSmartlook();
    }

    // Initialize Amplitude (analytics consent)
    if (consentManager.hasConsent('analytics')) {
      this.initAmplitude();
    }

    // Initialize AppsFlyer (marketing consent)
    if (consentManager.hasConsent('marketing')) {
      this.initAppsFlyer();
    }

    this.initialized = true;
    this.log('Analytics initialized');
  }

  /**
   * Initialize Smartlook Web SDK
   */
  initSmartlook() {
    if (typeof window === 'undefined' || window.smartlook) return;

    // Load Smartlook script asynchronously
    window.smartlook ||
      (function (d) {
        var o = (window.smartlook = function () {
            o.api.push(arguments);
          }),
          h = d.getElementsByTagName('head')[0];
        var c = d.createElement('script');
        o.api = new Array();
        c.async = true;
        c.type = 'text/javascript';
        c.charset = 'utf-8';
        c.src = 'https://web-sdk.smartlook.com/recorder.js';
        h.appendChild(c);
      })(document);

    // Initialize with project key and configuration
    window.smartlook('init', process.env.NEXT_PUBLIC_SMARTLOOK_PROJECT_KEY, {
      region: 'eu',
      recordingQuality: 'high',
      recordUserActions: true,
      recordNetworkRequests: false, // Privacy-focused
      recordConsoleMessages: false, // Privacy-focused
      privacyMode: false,
    });

    this.smartlook = window.smartlook;
    this.log('Smartlook SDK loaded and initialized');
  }

  /**
   * Initialize Amplitude Web SDK with optimized configuration
   */
  initAmplitude() {
    if (typeof window === 'undefined' || window.amplitude) return;

    // Load Amplitude script asynchronously
    const script = document.createElement('script');
    script.src = `https://cdn.amplitude.com/script/${process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY}.js`;
    script.async = true;
    script.onload = () => {
      if (window.amplitude) {
        // Advanced session replay configuration for CDL app optimization
        window.amplitude.add(
          window.sessionReplay.plugin({
            sampleRate: this.debug ? 1 : 0.1, // 10% sampling in production, 100% in dev
            enableRecordingClicks: true,
            enableRecordingFormInputs: false, // Privacy: don't record form inputs
            enableRecordingKeystrokes: false, // Privacy: don't record keystrokes
            recordingCanvasElements: false, // Performance: skip canvas recording
            recordingMaskAllInputs: true, // Privacy: mask all input fields
            recordingMaskAllText: false, // Allow text recording for UX analysis
          })
        );

        // Optimized Amplitude configuration for CDL training app
        window.amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, {
          // Performance optimizations
          batchEvents: true,
          eventUploadThreshold: 5, // Send events in batches of 5
          eventUploadPeriodMillis: 2000, // Send events every 2 seconds

          // Remote configuration for A/B testing
          fetchRemoteConfig: true,

          // Privacy and compliance
          optOut: false,
          trackingSessionEvents: true,
          saveParamsReferrerOncePerSession: true,

          // Enhanced tracking for app conversion optimization
          autocapture: {
            attribution: true,
            pageViews: true,
            sessions: true,
            formInteractions: true,
            fileDownloads: true,
            elementInteractions: true,
          },

          // CDL app specific tracking
          defaultTracking: {
            attribution: true,
            pageViews: true,
            sessions: true,
            formInteractions: true,
            fileDownloads: true,
          },

          // User identification for better attribution
          deviceIdFromUrlParam: false,
          forceHttps: true,
          saveEvents: true,
          savedMaxCount: 1000,

          // Advanced features for conversion analysis
          trackingOptions: {
            city: false, // Privacy: don't track city
            country: true, // Important for localization analysis
            carrier: false, // Not relevant for web
            device_manufacturer: true, // Important for device optimization
            device_model: true, // Important for device optimization
            dma: false, // Privacy: don't track DMA
            ip_address: false, // Privacy: don't track IP
            language: true, // Critical for localization
            os_name: true, // Important for device optimization
            os_version: true, // Important for compatibility
            platform: true, // Critical for app optimization
            region: true, // Important for localization
            version_name: true, // Important for app version tracking
          },
        });

        // Set initial user properties for CDL app optimization
        this.setAmplitudeUserProperties();

        // Initialize cohort tracking
        this.trackCohortBehavior();

        this.amplitude = window.amplitude;
        this.log('Amplitude SDK loaded and initialized with optimized config');
      }
    };
    script.onerror = () => {
      this.log('Failed to load Amplitude SDK');
    };
    document.head.appendChild(script);
  }

  /**
   * Set optimized user properties for Amplitude CDL app tracking
   */
  setAmplitudeUserProperties() {
    if (!this.amplitude || typeof window === 'undefined') return;

    const userAgent = navigator.userAgent || '';
    const language = navigator.language || 'en';
    const screenResolution = `${screen.width}x${screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;

    // Detect device type for app optimization
    const deviceType = this.getDeviceType();
    const isAppCapable = this.isAppCapableDevice();

    // Get campaign data for attribution
    const campaignData = this.getCampaignParams();

    // Set comprehensive user properties
    const userProperties = {
      // Device and platform optimization
      device_type: deviceType,
      screen_resolution: screenResolution,
      viewport_size: viewportSize,
      is_mobile: deviceType === 'mobile',
      is_app_capable: isAppCapable,

      // Localization and content optimization
      browser_language: language,
      locale_preference: this.getLocaleFromUrl() || language.split('-')[0],

      // Attribution and campaign tracking
      initial_utm_source: campaignData.utm_source,
      initial_utm_medium: campaignData.utm_medium,
      initial_utm_campaign: campaignData.utm_campaign,
      initial_referrer: campaignData.referrer,

      // CDL-specific properties
      is_returning_visitor: this.isReturningVisitor(),
      session_start_time: new Date().toISOString(),

      // Technical properties for optimization
      connection_type: this.getConnectionType(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    this.amplitude.setUserProperties(userProperties);
    this.log('Amplitude user properties set:', userProperties);
  }

  /**
   * Get device type for app optimization
   */
  getDeviceType() {
    if (typeof window === 'undefined') return 'unknown';

    const userAgent = navigator.userAgent.toLowerCase();
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      if (/ipad/i.test(userAgent)) return 'tablet';
      return 'mobile';
    }
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  /**
   * Check if device is capable of app installation
   */
  isAppCapableDevice() {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod/i.test(userAgent);
  }

  /**
   * Get locale from URL for internationalization tracking
   */
  getLocaleFromUrl() {
    if (typeof window === 'undefined') return null;

    const path = window.location.pathname;
    const localeMatch = path.match(/^\/([a-z]{2})\//);
    return localeMatch ? localeMatch[1] : null;
  }

  /**
   * Check if user is returning visitor
   */
  isReturningVisitor() {
    if (typeof localStorage === 'undefined') return false;

    const hasVisited = localStorage.getItem('cdl_visited');
    if (!hasVisited) {
      localStorage.setItem('cdl_visited', 'true');
      return false;
    }
    return true;
  }

  /**
   * Get connection type for performance optimization
   */
  getConnectionType() {
    if (typeof navigator === 'undefined' || !navigator.connection) return 'unknown';

    const connection = navigator.connection;
    return connection.effectiveType || connection.type || 'unknown';
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
   * Track app download intents with enhanced Amplitude attribution
   */
  trackDownloadIntent(platform, source = 'website', campaign = null) {
    const campaignParams = this.getCampaignParams();
    const deviceType = this.getDeviceType();
    const isAppCapable = this.isAppCapableDevice();

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
      // Enhanced properties for Amplitude optimization
      device_type: deviceType,
      is_app_capable: isAppCapable,
      locale: this.getLocaleFromUrl() || 'en',
      connection_type: this.getConnectionType(),
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

    // Amplitude - Enhanced tracking for conversion optimization
    if (this.amplitude && consentManager.hasConsent('analytics')) {
      this.amplitude.track('Download Intent', {
        platform: platform,
        source: source,
        device_type: deviceType,
        is_app_capable: isAppCapable,
        locale: eventData.locale,
        connection_type: eventData.connection_type,
        utm_source: campaignParams.utm_source,
        utm_medium: campaignParams.utm_medium,
        utm_campaign: campaignParams.utm_campaign,
        gclid: campaignParams.gclid,
        fbclid: campaignParams.fbclid,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_title: typeof document !== 'undefined' ? document.title : '',
        referrer: campaignParams.referrer,
        timestamp: eventData.timestamp,
      });

      // Set user properties for segmentation
      this.amplitude.setUserProperties({
        last_download_intent_platform: platform,
        last_download_intent_source: source,
        total_download_intents: this.amplitude.getUserProperty('total_download_intents') + 1 || 1,
        last_active_date: new Date().toISOString().split('T')[0],
      });
    }

    // Google Ads Conversion Tracking
    if (
      this.gads &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID &&
      consentManager.hasConsent('marketing')
    ) {
      // Track download intent as a conversion
      this.gads('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID}`,
        value: 0.0,
        currency: 'USD',
        transaction_id: `${Date.now()}_${platform}_${source}`,
        event_callback: () => {
          this.log('Google Ads conversion tracked');
        },
      });

      // Also track as a remarketing event
      this.gads('event', 'page_view', {
        send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
        value: 0.0,
        items: [
          {
            id: 'cdlhelp_app',
            google_business_vertical: 'custom',
          },
        ],
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

    // Google Ads - Track app store redirect
    if (
      this.gads &&
      process.env.NEXT_PUBLIC_GOOGLE_ADS_ID &&
      consentManager.hasConsent('marketing')
    ) {
      this.gads('event', 'click', {
        send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
        event_category: 'app_store_redirect',
        event_label: platform,
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

    // Smartlook - Track as custom event
    if (this.smartlook && consentManager.hasConsent('analytics')) {
      this.smartlook('track', 'feature_engagement', {
        feature,
        action,
        value: value || 0,
      });
    }

    // Amplitude - Track as event
    if (this.amplitude && consentManager.hasConsent('analytics')) {
      this.amplitude.track('Feature Engagement', {
        feature,
        action,
        value: value || 0,
        timestamp: new Date().toISOString(),
      });
    }

    this.log('Feature engagement tracked:', eventData);
  }

  /**
   * Track quiz/test completions with enhanced Amplitude analytics
   */
  trackQuizCompletion(score, totalQuestions, locale) {
    const completionRate = ((score / totalQuestions) * 100).toFixed(2);
    const passed = score >= totalQuestions * 0.8;
    const deviceType = this.getDeviceType();
    const timeSpent = this.getQuizTimeSpent(); // If available from quiz context

    const eventData = {
      score,
      total_questions: totalQuestions,
      completion_rate: completionRate,
      locale,
      passed,
      // Enhanced properties for learning analytics
      device_type: deviceType,
      time_spent_seconds: timeSpent,
      performance_level: this.getPerformanceLevel(completionRate),
      quiz_type: this.getQuizTypeFromUrl(),
      session_quiz_number: this.getSessionQuizCount(),
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

    // Amplitude - Enhanced educational analytics
    if (this.amplitude && consentManager.hasConsent('analytics')) {
      this.amplitude.track('Quiz Completed', {
        score: score,
        total_questions: totalQuestions,
        completion_rate: parseFloat(completionRate),
        passed: passed,
        locale: locale,
        device_type: deviceType,
        time_spent_seconds: timeSpent,
        performance_level: eventData.performance_level,
        quiz_type: eventData.quiz_type,
        session_quiz_number: eventData.session_quiz_number,
        answers_correct: score,
        answers_incorrect: totalQuestions - score,
        accuracy_percentage: parseFloat(completionRate),
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
      });

      // Update user properties for learning progression tracking
      const currentStreak = passed
        ? (this.amplitude.getUserProperty('quiz_pass_streak') || 0) + 1
        : 0;

      this.amplitude.setUserProperties({
        total_quizzes_completed:
          (this.amplitude.getUserProperty('total_quizzes_completed') || 0) + 1,
        total_quizzes_passed: passed
          ? (this.amplitude.getUserProperty('total_quizzes_passed') || 0) + 1
          : this.amplitude.getUserProperty('total_quizzes_passed') || 0,
        quiz_pass_streak: currentStreak,
        highest_quiz_score: Math.max(
          score,
          this.amplitude.getUserProperty('highest_quiz_score') || 0
        ),
        last_quiz_performance: eventData.performance_level,
        last_quiz_date: new Date().toISOString().split('T')[0],
        preferred_quiz_locale: locale,
      });

      // Track learning milestones
      this.trackLearningMilestones(score, totalQuestions, passed);
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
   * Track contact form submission attempt
   */
  trackContactFormSubmit(subject) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'generate_lead', {
        event_category: 'Contact',
        event_label: subject,
        value: 1,
      });
    }

    // Facebook Pixel - Track as Lead event
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'Lead', {
        content_name: 'Contact Form',
        content_category: subject,
        status: 'attempted',
      });
    }

    this.log('Contact form submission tracked:', { subject });
  }

  /**
   * Track successful contact form submission
   */
  trackContactFormSuccess(subject) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'contact_success', {
        event_category: 'Contact',
        event_label: subject,
        value: 5, // Higher value for successful submissions
      });
    }

    // Facebook Pixel - Track as Contact event
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'Contact', {
        content_name: 'Contact Form',
        content_category: subject,
        status: 'success',
      });
    }

    this.log('Contact form success tracked:', { subject });
  }

  /**
   * Track contact form error
   */
  trackContactFormError(error) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'contact_error', {
        event_category: 'Contact',
        event_label: error,
        value: 0,
      });
    }

    this.log('Contact form error tracked:', { error });
  }

  /**
   * Track search events (for state/school searches)
   */
  trackSearch(searchType, query, resultsCount = 0) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'search', {
        search_term: query,
        event_category: searchType,
        results_count: resultsCount,
      });
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'Search', {
        search_string: query,
        content_category: searchType,
        content_ids: [`search_${searchType}`],
        value: resultsCount,
      });
    }

    this.log('Search tracked:', { searchType, query, resultsCount });
  }

  /**
   * Track content views with enhanced parameters
   */
  trackContentView(contentType, contentId, contentName, value = 0) {
    // Google Analytics
    if (this.gtag && consentManager.hasConsent('analytics')) {
      this.gtag('event', 'view_item', {
        currency: 'USD',
        value: value,
        items: [
          {
            item_id: contentId,
            item_name: contentName,
            item_category: contentType,
          },
        ],
      });
    }

    // Facebook Pixel
    if (this.fbq && consentManager.hasConsent('marketing')) {
      this.fbq('track', 'ViewContent', {
        content_ids: [contentId],
        content_name: contentName,
        content_type: contentType,
        currency: 'USD',
        value: value,
      });
    }

    this.log('Content view tracked:', { contentType, contentId, contentName, value });
  }

  /**
   * Track Smartlook-specific user events
   */
  trackSmartlookEvent(eventName, properties = {}) {
    if (this.smartlook && consentManager.hasConsent('analytics')) {
      this.smartlook('track', eventName, properties);
      this.log('Smartlook event tracked:', { eventName, properties });
    }
  }

  /**
   * Identify user in Smartlook (for better session tracking)
   */
  identifySmartlookUser(userId, userProperties = {}) {
    if (this.smartlook && consentManager.hasConsent('analytics')) {
      this.smartlook('identify', userId, userProperties);
      this.log('Smartlook user identified:', { userId, userProperties });
    }
  }

  /**
   * Track Amplitude-specific events
   */
  trackAmplitudeEvent(eventName, eventProperties = {}) {
    if (this.amplitude && consentManager.hasConsent('analytics')) {
      this.amplitude.track(eventName, eventProperties);
      this.log('Amplitude event tracked:', { eventName, eventProperties });
    }
  }

  /**
   * Identify user in Amplitude
   */
  identifyAmplitudeUser(userId, userProperties = {}) {
    if (this.amplitude && consentManager.hasConsent('analytics')) {
      this.amplitude.setUserId(userId);
      if (Object.keys(userProperties).length > 0) {
        this.amplitude.setUserProperties(userProperties);
      }
      this.log('Amplitude user identified:', { userId, userProperties });
    }
  }

  /**
   * Get quiz time spent (helper method)
   */
  getQuizTimeSpent() {
    // This would be set by the quiz component when quiz starts/ends
    if (typeof window !== 'undefined' && window.quizStartTime) {
      return Math.round((Date.now() - window.quizStartTime) / 1000);
    }
    return null;
  }

  /**
   * Get performance level based on completion rate
   */
  getPerformanceLevel(completionRate) {
    const rate = parseFloat(completionRate);
    if (rate >= 95) return 'excellent';
    if (rate >= 85) return 'good';
    if (rate >= 70) return 'average';
    if (rate >= 60) return 'below_average';
    return 'poor';
  }

  /**
   * Get quiz type from URL
   */
  getQuizTypeFromUrl() {
    if (typeof window === 'undefined') return 'unknown';

    const path = window.location.pathname;
    if (path.includes('road-signs')) return 'road_signs';
    if (path.includes('pre-trip')) return 'pre_trip_inspection';
    if (path.includes('general')) return 'general_knowledge';
    return 'general';
  }

  /**
   * Get session quiz count
   */
  getSessionQuizCount() {
    if (typeof sessionStorage === 'undefined') return 1;

    const count = parseInt(sessionStorage.getItem('session_quiz_count') || '0') + 1;
    sessionStorage.setItem('session_quiz_count', count.toString());
    return count;
  }

  /**
   * Track learning milestones for gamification
   */
  trackLearningMilestones(score, totalQuestions, passed) {
    if (!this.amplitude || !consentManager.hasConsent('analytics')) return;

    const totalCompleted = this.amplitude.getUserProperty('total_quizzes_completed') || 0;
    const totalPassed = this.amplitude.getUserProperty('total_quizzes_passed') || 0;
    const passStreak = this.amplitude.getUserProperty('quiz_pass_streak') || 0;

    // Track milestone achievements
    const milestones = [];

    if (totalCompleted === 1) milestones.push('first_quiz_completed');
    if (totalCompleted === 5) milestones.push('5_quizzes_completed');
    if (totalCompleted === 10) milestones.push('10_quizzes_completed');
    if (totalCompleted === 25) milestones.push('25_quizzes_completed');

    if (passed && totalPassed === 1) milestones.push('first_quiz_passed');
    if (passed && totalPassed === 5) milestones.push('5_quizzes_passed');
    if (passed && totalPassed === 10) milestones.push('10_quizzes_passed');

    if (passStreak === 3) milestones.push('3_quiz_streak');
    if (passStreak === 5) milestones.push('5_quiz_streak');
    if (passStreak === 10) milestones.push('10_quiz_streak');

    if (score === totalQuestions) milestones.push('perfect_score');

    // Track each milestone as a separate event
    milestones.forEach(milestone => {
      this.amplitude.track('Learning Milestone', {
        milestone_type: milestone,
        total_quizzes_completed: totalCompleted,
        total_quizzes_passed: totalPassed,
        current_streak: passStreak,
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Set user properties across all analytics platforms
   */
  setGlobalUserProperties(properties) {
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

    // Amplitude
    if (this.amplitude && consentManager.hasConsent('analytics')) {
      this.amplitude.setUserProperties(properties);
    }

    // Smartlook
    if (this.smartlook && consentManager.hasConsent('analytics')) {
      this.smartlook('identify', null, properties);
    }

    this.log('Global user properties set:', properties);
  }

  /**
   * Track conversion funnel progression for Amplitude
   */
  trackFunnelStep(stepName, stepNumber, funnelType = 'download', properties = {}) {
    if (!this.amplitude || !consentManager.hasConsent('analytics')) return;

    this.amplitude.track('Funnel Step', {
      step_name: stepName,
      step_number: stepNumber,
      funnel_type: funnelType,
      device_type: this.getDeviceType(),
      locale: this.getLocaleFromUrl() || 'en',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      ...properties,
    });

    // Update user properties for funnel analysis
    this.amplitude.setUserProperties({
      [`${funnelType}_funnel_furthest_step`]: Math.max(
        stepNumber,
        this.amplitude.getUserProperty(`${funnelType}_funnel_furthest_step`) || 0
      ),
      [`${funnelType}_funnel_last_step_date`]: new Date().toISOString().split('T')[0],
    });

    this.log('Funnel step tracked:', { stepName, stepNumber, funnelType, properties });
  }

  /**
   * Track user cohort behavior for Amplitude
   */
  trackCohortBehavior() {
    if (!this.amplitude || !consentManager.hasConsent('analytics')) return;

    const firstVisitDate = this.getFirstVisitDate();
    const daysSinceFirstVisit = firstVisitDate
      ? Math.floor((Date.now() - new Date(firstVisitDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    this.amplitude.setUserProperties({
      first_visit_date: firstVisitDate,
      days_since_first_visit: daysSinceFirstVisit,
      cohort_week: this.getCohortWeek(firstVisitDate),
      cohort_month: this.getCohortMonth(firstVisitDate),
      user_lifecycle_stage: this.getUserLifecycleStage(daysSinceFirstVisit),
    });
  }

  /**
   * Get first visit date for cohort analysis
   */
  getFirstVisitDate() {
    if (typeof localStorage === 'undefined') return null;

    let firstVisit = localStorage.getItem('cdl_first_visit');
    if (!firstVisit) {
      firstVisit = new Date().toISOString();
      localStorage.setItem('cdl_first_visit', firstVisit);
    }
    return firstVisit;
  }

  /**
   * Get cohort week for user segmentation
   */
  getCohortWeek(firstVisitDate) {
    if (!firstVisitDate) return null;

    const date = new Date(firstVisitDate);
    const year = date.getFullYear();
    const week = Math.ceil(
      (date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  /**
   * Get cohort month for user segmentation
   */
  getCohortMonth(firstVisitDate) {
    if (!firstVisitDate) return null;

    const date = new Date(firstVisitDate);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  /**
   * Get user lifecycle stage for retention analysis
   */
  getUserLifecycleStage(daysSinceFirstVisit) {
    if (daysSinceFirstVisit === 0) return 'new';
    if (daysSinceFirstVisit <= 7) return 'recent';
    if (daysSinceFirstVisit <= 30) return 'returning';
    if (daysSinceFirstVisit <= 90) return 'established';
    return 'loyal';
  }

  /**
   * Track revenue events for Amplitude (if applicable)
   */
  trackRevenue(amount, productType = 'app_download', properties = {}) {
    if (!this.amplitude || !consentManager.hasConsent('analytics')) return;

    const revenueEvent = new window.amplitude.Revenue()
      .setProductId(productType)
      .setPrice(amount)
      .setQuantity(1)
      .setEventProperties(properties);

    this.amplitude.revenue(revenueEvent);
    this.log('Revenue tracked:', { amount, productType, properties });
  }

  /**
   * Initialize performance monitoring for Amplitude
   */
  initPerformanceMonitoring() {
    if (typeof window === 'undefined' || !window.performance) return;

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData && this.amplitude && consentManager.hasConsent('analytics')) {
          this.amplitude.track('Page Performance', {
            load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
            first_paint: this.getFirstPaint(),
            connection_type: this.getConnectionType(),
            device_type: this.getDeviceType(),
            page_url: window.location.href,
          });
        }
      }, 0);
    });
  }

  /**
   * Get first paint timing for performance analysis
   */
  getFirstPaint() {
    if (typeof window === 'undefined' || !window.performance) return null;

    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }

  /**
   * Debug logging
   */
  log(...args) {
    if (this.debug) {
      // eslint-disable-next-line no-console
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
  setGlobalUserProperties,
  trackSmartlookEvent,
  identifySmartlookUser,
  trackAmplitudeEvent,
  identifyAmplitudeUser,
  trackFunnelStep,
  trackCohortBehavior,
  trackRevenue,
} = {
  trackPageView: (...args) => analytics.trackPageView(...args),
  trackDownloadIntent: (...args) => analytics.trackDownloadIntent(...args),
  trackAppStoreRedirect: (...args) => analytics.trackAppStoreRedirect(...args),
  trackFeatureEngagement: (...args) => analytics.trackFeatureEngagement(...args),
  trackQuizCompletion: (...args) => analytics.trackQuizCompletion(...args),
  trackVideoEngagement: (...args) => analytics.trackVideoEngagement(...args),
  setUserProperties: (...args) => analytics.setUserProperties(...args),
  setGlobalUserProperties: (...args) => analytics.setGlobalUserProperties(...args),
  trackSmartlookEvent: (...args) => analytics.trackSmartlookEvent(...args),
  identifySmartlookUser: (...args) => analytics.identifySmartlookUser(...args),
  trackAmplitudeEvent: (...args) => analytics.trackAmplitudeEvent(...args),
  identifyAmplitudeUser: (...args) => analytics.identifyAmplitudeUser(...args),
  trackFunnelStep: (...args) => analytics.trackFunnelStep(...args),
  trackCohortBehavior: (...args) => analytics.trackCohortBehavior(...args),
  trackRevenue: (...args) => analytics.trackRevenue(...args),
};
