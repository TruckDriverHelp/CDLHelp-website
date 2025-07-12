/**
 * Session Continuity Service for CDLHelp
 * Manages seamless transitions between website and mobile app
 */

import unifiedIdentity from './unified-identity';
import enhancedAnalytics from './analytics-enhanced';

class SessionContinuityService {
  constructor() {
    this.initialized = false;
    this.sessionEndpoints = {
      create: '/api/v2/meta/session-continuity',
      handoff: '/api/v2/meta/cross-platform-handoff',
    };
    this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.cdlhelp.app';
  }

  /**
   * Initialize session continuity service
   */
  async init() {
    if (this.initialized) return;

    try {
      // Ensure unified identity is initialized
      await unifiedIdentity.init();

      // Set up page visibility tracking for session preservation
      this.setupPageVisibilityTracking();

      // Set up beforeunload handling for session handoff
      this.setupSessionHandoff();

      this.initialized = true;
      console.log('🔗 Session Continuity Service initialized');
    } catch (error) {
      console.error('Failed to initialize Session Continuity Service:', error);
    }
  }

  /**
   * Prepare session for mobile app handoff
   */
  async prepareAppHandoff(appUrl, additionalData = {}) {
    try {
      const identity = unifiedIdentity.getUserIdentity();

      // Create session continuity data
      const continuityData = {
        unified_user_id: identity.unifiedUserId,
        session_id: identity.sessionId,
        device_fingerprint: identity.deviceFingerprint,
        handoff_timestamp: Date.now(),
        source_platform: 'web',
        target_platform: 'mobile',
        source_url: window.location.href,
        target_url: appUrl,
        session_data: {
          page_views: this.getSessionPageViews(),
          time_on_site: this.getTimeOnSite(),
          last_activity: Date.now(),
          referrer: document.referrer,
          ...additionalData,
        },
      };

      // Store locally for immediate app handoff
      unifiedIdentity.storeCrossPlatformData(continuityData);

      // Send to backend for persistence
      await this.sendSessionToBackend(continuityData);

      // Track handoff event
      await enhancedAnalytics.trackEvent('session_handoff_prepared', {
        target_platform: 'mobile',
        target_url: appUrl,
        session_duration: this.getTimeOnSite(),
        ...additionalData,
      });

      console.log('📱 Session prepared for app handoff:', continuityData);
      return continuityData;
    } catch (error) {
      console.error('Error preparing app handoff:', error);
      throw error;
    }
  }

  /**
   * Handle app download with session continuity
   */
  async handleAppDownload(platform, downloadSource = 'website') {
    try {
      // Track download intent with enhanced analytics
      const attribution = await enhancedAnalytics.trackDownloadIntent(platform, downloadSource);

      // Prepare session for handoff
      const sessionData = await this.prepareAppHandoff(attribution.attributionParams, {
        download_intent: true,
        download_platform: platform,
        download_source: downloadSource,
      });

      // Generate attribution URL with session data
      const appStoreUrl = this.generateAppStoreUrl(platform, {
        ...attribution.attributionParams,
        session_continuity_id: sessionData.session_id,
        handoff_timestamp: sessionData.handoff_timestamp,
      });

      // Send handoff tracking to backend
      await this.trackCrossPlatformHandoff('web', 'mobile', 'app_download', {
        platform,
        download_source: downloadSource,
        app_store_url: appStoreUrl,
      });

      return {
        appStoreUrl,
        sessionData,
        attribution: attribution.attributionParams,
      };
    } catch (error) {
      console.error('Error handling app download:', error);
      throw error;
    }
  }

  /**
   * Restore session from mobile app handoff
   */
  async restoreSessionFromApp() {
    try {
      // Check URL parameters for session continuity data
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const handoffTimestamp = urlParams.get('handoff_timestamp');

      if (!sessionId || !handoffTimestamp) {
        console.log('No session continuity data found in URL');
        return null;
      }

      // Check if handoff is recent (within 10 minutes)
      const handoffAge = Date.now() - parseInt(handoffTimestamp);
      if (handoffAge > 10 * 60 * 1000) {
        console.log('Session handoff data is too old, ignoring');
        return null;
      }

      // Fetch session data from backend
      const sessionData = await this.fetchSessionFromBackend(sessionId);

      if (sessionData) {
        // Restore session context
        await this.restoreSessionContext(sessionData);

        // Track successful session restoration
        await enhancedAnalytics.trackEvent('session_restored_from_app', {
          original_session_id: sessionId,
          handoff_age_seconds: Math.round(handoffAge / 1000),
          source_platform: 'mobile',
          target_platform: 'web',
        });

        console.log('🔄 Session restored from mobile app:', sessionData);
        return sessionData;
      }
    } catch (error) {
      console.error('Error restoring session from app:', error);
    }

    return null;
  }

  /**
   * Send session data to backend for persistence
   */
  async sendSessionToBackend(sessionData) {
    try {
      const response = await fetch(`${this.backendUrl}/api/v2/meta/cross-platform-handoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Unified-User-Id': sessionData.unified_user_id,
          'X-Session-Id': sessionData.session_id,
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Session data sent to backend:', result);
    } catch (error) {
      console.error('Error sending session to backend:', error);
      // Don't throw - session continuity should be resilient
    }
  }

  /**
   * Fetch session data from backend
   */
  async fetchSessionFromBackend(sessionId) {
    try {
      const response = await fetch(
        `${this.backendUrl}/api/v2/meta/session-continuity/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log('Session continuity data not found in backend');
          return null;
        }
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const result = await response.json();
      return result.session_continuity;
    } catch (error) {
      console.error('Error fetching session from backend:', error);
      return null;
    }
  }

  /**
   * Track cross-platform handoff event
   */
  async trackCrossPlatformHandoff(
    sourcePlatform,
    targetPlatform,
    handoffType,
    additionalData = {}
  ) {
    try {
      const identity = unifiedIdentity.getUserIdentity();

      const handoffData = {
        source_platform: sourcePlatform,
        target_platform: targetPlatform,
        handoff_type: handoffType,
        unified_user_id: identity.unifiedUserId,
        session_id: identity.sessionId,
        timestamp: Date.now(),
        ...additionalData,
      };

      // Send to backend
      await fetch(`${this.backendUrl}/api/v2/meta/cross-platform-handoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Unified-User-Id': identity.unifiedUserId,
          'X-Session-Id': identity.sessionId,
        },
        body: JSON.stringify(handoffData),
      });

      console.log('📊 Cross-platform handoff tracked:', handoffData);
    } catch (error) {
      console.error('Error tracking cross-platform handoff:', error);
    }
  }

  /**
   * Generate app store URL with session continuity parameters
   */
  generateAppStoreUrl(platform, params) {
    const baseUrls = {
      ios: 'https://apps.apple.com/app/cdl-help/id6444388755',
      android: 'https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp',
    };

    const baseUrl = baseUrls[platform];
    if (!baseUrl) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Add session continuity parameters
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.set(key, params[key]);
      }
    });

    return url.toString();
  }

  /**
   * Restore session context from handoff data
   */
  async restoreSessionContext(sessionData) {
    try {
      // Update unified identity with restored session
      if (sessionData.unified_user_id && sessionData.session_id) {
        // This would update the current session to continue the mobile session
        localStorage.setItem(
          'cdlhelp_continued_session',
          JSON.stringify({
            original_unified_user_id: sessionData.unified_user_id,
            original_session_id: sessionData.session_id,
            handoff_data: sessionData,
            restored_timestamp: Date.now(),
          })
        );
      }

      // Set any relevant context from the mobile session
      if (sessionData.session_data) {
        // Could restore user preferences, last viewed content, etc.
        console.log('Session context data available:', sessionData.session_data);
      }
    } catch (error) {
      console.error('Error restoring session context:', error);
    }
  }

  /**
   * Set up page visibility tracking for session preservation
   */
  setupPageVisibilityTracking() {
    let sessionStartTime = Date.now();
    let lastActivityTime = Date.now();

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page is hidden - store current session state
        this.storeSessionState();
      } else {
        // Page is visible - resume session tracking
        lastActivityTime = Date.now();
      }
    });

    // Track user activity
    ['click', 'scroll', 'keypress', 'mousemove'].forEach(eventType => {
      document.addEventListener(
        eventType,
        () => {
          lastActivityTime = Date.now();
        },
        { passive: true }
      );
    });

    // Store session metrics
    this.getTimeOnSite = () => Date.now() - sessionStartTime;
    this.getLastActivityTime = () => lastActivityTime;
  }

  /**
   * Set up session handoff on page unload
   */
  setupSessionHandoff() {
    window.addEventListener('beforeunload', () => {
      // Store final session state
      this.storeSessionState();

      // Send session data to backend (with sendBeacon for reliability)
      const identity = unifiedIdentity.getUserIdentity();
      const sessionState = {
        unified_user_id: identity.unifiedUserId,
        session_id: identity.sessionId,
        final_url: window.location.href,
        session_duration: this.getTimeOnSite(),
        page_views: this.getSessionPageViews(),
        timestamp: Date.now(),
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          `${this.backendUrl}/api/v2/meta/session-continuity`,
          JSON.stringify(sessionState)
        );
      }
    });
  }

  /**
   * Store current session state
   */
  storeSessionState() {
    try {
      const identity = unifiedIdentity.getUserIdentity();
      const sessionState = {
        unified_user_id: identity.unifiedUserId,
        session_id: identity.sessionId,
        current_url: window.location.href,
        time_on_site: this.getTimeOnSite(),
        page_views: this.getSessionPageViews(),
        last_activity: this.getLastActivityTime(),
        timestamp: Date.now(),
      };

      sessionStorage.setItem('cdlhelp_session_state', JSON.stringify(sessionState));
    } catch (error) {
      console.error('Error storing session state:', error);
    }
  }

  /**
   * Get session page views count
   */
  getSessionPageViews() {
    try {
      const sessionData = sessionStorage.getItem('cdlhelp_session_id');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        return session.pageViews || 1;
      }
    } catch (e) {
      // Ignore errors
    }
    return 1;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      identity: unifiedIdentity.getUserIdentity(),
      session_state: this.getStoredSessionState(),
      time_on_site: this.getTimeOnSite ? this.getTimeOnSite() : 0,
    };
  }

  /**
   * Get stored session state
   */
  getStoredSessionState() {
    try {
      const stored = sessionStorage.getItem('cdlhelp_session_state');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }
}

// Export singleton instance
const sessionContinuity = new SessionContinuityService();
export default sessionContinuity;

// Convenience exports
export const {
  prepareAppHandoff,
  handleAppDownload,
  restoreSessionFromApp,
  trackCrossPlatformHandoff,
} = {
  prepareAppHandoff: (...args) => sessionContinuity.prepareAppHandoff(...args),
  handleAppDownload: (...args) => sessionContinuity.handleAppDownload(...args),
  restoreSessionFromApp: () => sessionContinuity.restoreSessionFromApp(),
  trackCrossPlatformHandoff: (...args) => sessionContinuity.trackCrossPlatformHandoff(...args),
};
