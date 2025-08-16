/**
 * Unified Identity Service for CDLHelp
 * Manages cross-platform user identification and attribution
 */

import { v4 as uuidv4 } from 'uuid';

class UnifiedIdentityService {
  constructor() {
    this.STORAGE_KEYS = {
      UNIFIED_USER_ID: 'cdlhelp_unified_user_id',
      SESSION_ID: 'cdlhelp_session_id',
      ATTRIBUTION_DATA: 'cdlhelp_attribution_data',
      FIRST_VISIT: 'cdlhelp_first_visit',
      LAST_VISIT: 'cdlhelp_last_visit',
      VISIT_COUNT: 'cdlhelp_visit_count',
      DEVICE_FINGERPRINT: 'cdlhelp_device_fp',
    };

    this.initialized = false;
    this.currentSession = null;
    this.unifiedUserId = null;
    this.deviceFingerprint = null;
  }

  /**
   * Initialize the unified identity system
   */
  async init() {
    if (this.initialized) return;

    try {
      // Generate or retrieve unified user ID
      this.unifiedUserId = this.getOrCreateUnifiedUserId();

      // Generate device fingerprint
      this.deviceFingerprint = await this.generateDeviceFingerprint();

      // Initialize session
      this.currentSession = this.initializeSession();

      // Track visit metrics
      this.updateVisitMetrics();

      // Store attribution data if available
      this.captureAttributionData();

      this.initialized = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Unified Identity Service initialized', {
          unifiedUserId: this.unifiedUserId,
          sessionId: this.currentSession.id,
          deviceFingerprint: this.deviceFingerprint.slice(0, 8) + '...',
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to initialize Unified Identity Service:', error);
      }
    }
  }

  /**
   * Generate or retrieve unified user ID
   */
  getOrCreateUnifiedUserId() {
    let userId = localStorage.getItem(this.STORAGE_KEYS.UNIFIED_USER_ID);

    if (!userId) {
      // Generate new UUID with CDLHelp prefix for identification
      userId = `cdlh_${uuidv4()}`;
      localStorage.setItem(this.STORAGE_KEYS.UNIFIED_USER_ID, userId);

      // Mark as new user for analytics
      this.isNewUser = true;
    }

    return userId;
  }

  /**
   * Generate device fingerprint for cross-device matching
   */
  async generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('CDLHelp device fingerprint', 2, 2);

    const fingerprint = {
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent.slice(0, 100), // Truncated for privacy
      canvas: canvas.toDataURL().slice(0, 50), // Truncated hash
      timestamp: Date.now(),
    };

    // Generate hash of fingerprint data
    const fpString = JSON.stringify(fingerprint);
    const fpHash = await this.simpleHash(fpString);

    // Store device fingerprint
    localStorage.setItem(this.STORAGE_KEYS.DEVICE_FINGERPRINT, fpHash);

    return fpHash;
  }

  /**
   * Simple hash function for device fingerprinting
   */
  async simpleHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);
  }

  /**
   * Initialize or continue session
   */
  initializeSession() {
    const sessionData = sessionStorage.getItem(this.STORAGE_KEYS.SESSION_ID);

    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        // Check if session is still valid (30 minutes)
        if (Date.now() - session.lastActivity < 30 * 60 * 1000) {
          session.lastActivity = Date.now();
          sessionStorage.setItem(this.STORAGE_KEYS.SESSION_ID, JSON.stringify(session));
          return session;
        }
      } catch (e) {
        // Invalid session data, create new
      }
    }

    // Create new session
    const newSession = {
      id: `sess_${uuidv4()}`,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 1,
      events: [],
      referrer: document.referrer || 'direct',
      landingPage: window.location.pathname + window.location.search,
      userAgent: navigator.userAgent,
    };

    sessionStorage.setItem(this.STORAGE_KEYS.SESSION_ID, JSON.stringify(newSession));
    return newSession;
  }

  /**
   * Update visit metrics
   */
  updateVisitMetrics() {
    const now = Date.now();
    const firstVisit = localStorage.getItem(this.STORAGE_KEYS.FIRST_VISIT);
    const lastVisit = localStorage.getItem(this.STORAGE_KEYS.LAST_VISIT);
    const visitCount = parseInt(localStorage.getItem(this.STORAGE_KEYS.VISIT_COUNT) || '0');

    if (!firstVisit) {
      localStorage.setItem(this.STORAGE_KEYS.FIRST_VISIT, now.toString());
    }

    localStorage.setItem(this.STORAGE_KEYS.LAST_VISIT, now.toString());
    localStorage.setItem(this.STORAGE_KEYS.VISIT_COUNT, (visitCount + 1).toString());
  }

  /**
   * Capture attribution data from URL parameters
   */
  captureAttributionData() {
    const urlParams = new URLSearchParams(window.location.search);
    const attributionData = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      gclid: urlParams.get('gclid'),
      fbclid: urlParams.get('fbclid'),
      ttclid: urlParams.get('ttclid'),
      msclkid: urlParams.get('msclkid'),
      referrer: document.referrer,
      landingPage: window.location.href,
      timestamp: Date.now(),
    };

    // Only store if we have actual attribution data
    const hasAttributionData = Object.values(attributionData).some(
      value => value && value !== 'null' && value !== ''
    );

    if (hasAttributionData) {
      // Store first-touch attribution (don't overwrite)
      const existingAttribution = localStorage.getItem(this.STORAGE_KEYS.ATTRIBUTION_DATA);
      if (!existingAttribution) {
        localStorage.setItem(this.STORAGE_KEYS.ATTRIBUTION_DATA, JSON.stringify(attributionData));
      }

      // Store last-touch attribution (always update)
      sessionStorage.setItem('cdlhelp_last_touch_attribution', JSON.stringify(attributionData));
    }
  }

  /**
   * Get complete user identity data
   */
  getUserIdentity() {
    return {
      unifiedUserId: this.unifiedUserId,
      sessionId: this.currentSession?.id,
      deviceFingerprint: this.deviceFingerprint,
      isNewUser: this.isNewUser || false,
      visitMetrics: this.getVisitMetrics(),
      attribution: this.getAttributionData(),
    };
  }

  /**
   * Get visit metrics
   */
  getVisitMetrics() {
    return {
      firstVisit: localStorage.getItem(this.STORAGE_KEYS.FIRST_VISIT),
      lastVisit: localStorage.getItem(this.STORAGE_KEYS.LAST_VISIT),
      visitCount: parseInt(localStorage.getItem(this.STORAGE_KEYS.VISIT_COUNT) || '0'),
    };
  }

  /**
   * Get attribution data
   */
  getAttributionData() {
    const firstTouch = localStorage.getItem(this.STORAGE_KEYS.ATTRIBUTION_DATA);
    const lastTouch = sessionStorage.getItem('cdlhelp_last_touch_attribution');

    return {
      firstTouch: firstTouch ? JSON.parse(firstTouch) : null,
      lastTouch: lastTouch ? JSON.parse(lastTouch) : null,
    };
  }

  /**
   * Generate attribution URL for app download with enhanced UTM preservation
   */
  generateAttributionUrl(platform, source = 'website') {
    const identity = this.getUserIdentity();
    const firstTouch = identity.attribution.firstTouch || {};
    const lastTouch = identity.attribution.lastTouch || {};
    const currentUrl = new URLSearchParams(window.location.search);

    // Prioritize: Current URL params > Last Touch > First Touch > Defaults
    const params = {
      // Unified tracking parameters
      unified_user_id: identity.unifiedUserId,
      session_id: identity.sessionId,
      device_fingerprint: identity.deviceFingerprint,

      // Enhanced UTM parameter preservation with fallback hierarchy
      utm_source:
        currentUrl.get('utm_source') || lastTouch.utm_source || firstTouch.utm_source || 'website',
      utm_medium:
        currentUrl.get('utm_medium') ||
        lastTouch.utm_medium ||
        firstTouch.utm_medium ||
        'app_download',
      utm_campaign:
        currentUrl.get('utm_campaign') ||
        lastTouch.utm_campaign ||
        firstTouch.utm_campaign ||
        'mobile_app',
      utm_term: currentUrl.get('utm_term') || lastTouch.utm_term || firstTouch.utm_term,
      utm_content: currentUrl.get('utm_content') || lastTouch.utm_content || firstTouch.utm_content,

      // Cross-platform tracking
      web_referrer: lastTouch.referrer || firstTouch.referrer || document.referrer || 'direct',
      web_landing_page: firstTouch.landingPage || window.location.href,
      web_current_page: window.location.href,
      web_source: source,

      // Attribution click IDs (prioritize current > last > first)
      gclid: currentUrl.get('gclid') || lastTouch.gclid || firstTouch.gclid,
      fbclid: currentUrl.get('fbclid') || lastTouch.fbclid || firstTouch.fbclid,
      ttclid: currentUrl.get('ttclid') || lastTouch.ttclid || firstTouch.ttclid,
      msclkid: currentUrl.get('msclkid') || lastTouch.msclkid || firstTouch.msclkid,

      // AppsFlyer specific parameters
      af_web_dp: window.location.href,
      af_unified_id: identity.unifiedUserId,
      af_session_id: identity.sessionId,
      af_web_session_id: identity.sessionId,
      af_attribution_chain: this.buildAttributionChain(firstTouch, lastTouch, currentUrl),

      // Session context for attribution
      first_touch_timestamp: firstTouch.timestamp,
      last_touch_timestamp: lastTouch.timestamp,
      session_start_timestamp: this.currentSession?.startTime,
      attribution_timestamp: Date.now(),

      // Device context
      user_agent: navigator.userAgent.substring(0, 200), // Truncated for URL length
      screen_resolution: `${screen.width}x${screen.height}`,
      browser_language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      // App store routing
      target_platform: platform,
      handoff_type: 'app_download',
    };

    // Store complete attribution data for mobile app to access
    this.storeAttributionForMobile({
      unified_user_id: identity.unifiedUserId,
      attribution_params: params,
      first_touch: firstTouch,
      last_touch: lastTouch,
      session_data: this.currentSession,
      timestamp: Date.now(),
    });

    // Remove null/undefined values to clean up URL
    return Object.keys(params).reduce((acc, key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        acc[key] = params[key];
      }
      return acc;
    }, {});
  }

  /**
   * Build attribution chain showing the user's journey
   */
  buildAttributionChain(firstTouch, lastTouch, currentUrl) {
    const chain = [];

    if (firstTouch?.utm_source) {
      chain.push(`first:${firstTouch.utm_source}/${firstTouch.utm_medium || 'none'}`);
    }

    if (lastTouch?.utm_source && lastTouch.utm_source !== firstTouch?.utm_source) {
      chain.push(`last:${lastTouch.utm_source}/${lastTouch.utm_medium || 'none'}`);
    }

    const currentSource = currentUrl.get('utm_source');
    if (currentSource && currentSource !== lastTouch?.utm_source) {
      chain.push(`current:${currentSource}/${currentUrl.get('utm_medium') || 'none'}`);
    }

    return chain.join('|');
  }

  /**
   * Store attribution data for mobile app to access via backend
   */
  storeAttributionForMobile(attributionData) {
    try {
      // Store in localStorage for immediate access
      localStorage.setItem('cdlhelp_mobile_attribution', JSON.stringify(attributionData));

      // Send to backend for mobile app to retrieve
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.cdlhelp.app';

      fetch(`${backendUrl}/api/v2/meta/store-attribution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Unified-User-Id': attributionData.unified_user_id,
        },
        body: JSON.stringify({
          ...attributionData,
          source_platform: 'website',
          storage_timestamp: Date.now(),
          expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }),
      }).catch(error => {
        console.log('Attribution storage to backend failed (non-critical):', error.message);
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to store attribution for mobile:', error);
      }
    }
  }

  /**
   * Track event with unified identity context
   */
  trackEvent(eventName, properties = {}) {
    const identity = this.getUserIdentity();

    const enrichedEvent = {
      ...properties,
      unified_user_id: identity.unifiedUserId,
      session_id: identity.sessionId,
      device_fingerprint: identity.deviceFingerprint,
      platform: 'web',
      timestamp: Date.now(),
      page_url: window.location.href,
      page_title: document.title,
    };

    // Add to session events log
    if (this.currentSession) {
      this.currentSession.events.push({
        name: eventName,
        properties: enrichedEvent,
        timestamp: Date.now(),
      });
      sessionStorage.setItem(this.STORAGE_KEYS.SESSION_ID, JSON.stringify(this.currentSession));
    }

    return enrichedEvent;
  }

  /**
   * Update session activity
   */
  updateSessionActivity() {
    if (this.currentSession) {
      this.currentSession.lastActivity = Date.now();
      this.currentSession.pageViews += 1;
      sessionStorage.setItem(this.STORAGE_KEYS.SESSION_ID, JSON.stringify(this.currentSession));
    }
  }

  /**
   * Store cross-platform data for app handoff
   */
  storeCrossPlatformData(additionalData = {}) {
    const identity = this.getUserIdentity();
    const crossPlatformData = {
      ...identity,
      ...additionalData,
      handoffTimestamp: Date.now(),
      sourceUrl: window.location.href,
    };

    // Store in localStorage for persistence
    localStorage.setItem('cdlhelp_cross_platform_data', JSON.stringify(crossPlatformData));

    // Store in sessionStorage for immediate access
    sessionStorage.setItem('cdlhelp_app_handoff', JSON.stringify(crossPlatformData));

    return crossPlatformData;
  }

  /**
   * Get stored cross-platform data
   */
  getCrossPlatformData() {
    const stored = localStorage.getItem('cdlhelp_cross_platform_data');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Clear cross-platform data (called after successful app handoff)
   */
  clearCrossPlatformData() {
    sessionStorage.removeItem('cdlhelp_app_handoff');
  }
}

// Export singleton instance
const unifiedIdentity = new UnifiedIdentityService();
export default unifiedIdentity;

// Convenience exports
export const {
  getUserIdentity,
  generateAttributionUrl,
  trackEvent,
  storeCrossPlatformData,
  getCrossPlatformData,
} = {
  getUserIdentity: () => unifiedIdentity.getUserIdentity(),
  generateAttributionUrl: (...args) => unifiedIdentity.generateAttributionUrl(...args),
  trackEvent: (...args) => unifiedIdentity.trackEvent(...args),
  storeCrossPlatformData: (...args) => unifiedIdentity.storeCrossPlatformData(...args),
  getCrossPlatformData: () => unifiedIdentity.getCrossPlatformData(),
};
