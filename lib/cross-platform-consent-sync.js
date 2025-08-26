/**
 * Cross-Platform Consent Synchronization Service
 * Handles bidirectional consent sync between website and mobile app
 */

import consentManager from './consent-manager';

class CrossPlatformConsentSync {
  constructor() {
    this.initialized = false;
    this.syncInProgress = false;
    this.lastSyncTimestamp = null;
    this.mobileAppScheme = 'cdlhelp://';
  }

  /**
   * Initialize the cross-platform consent sync service
   */
  init() {
    if (this.initialized) return;

    // Listen for consent changes to potentially sync back to app
    consentManager.onConsentChange((consent) => {
      this.onConsentChanged(consent);
    });

    this.initialized = true;
    console.log('CrossPlatformConsentSync: Initialized');
  }

  /**
   * Handle consent changes on website
   * @param {Object} consent - The updated consent object
   */
  onConsentChanged(consent) {
    // Store the consent change for potential app sync
    this.lastSyncTimestamp = Date.now();
    
    // If user navigates to mobile app, consent will be passed via URL
    console.log('CrossPlatformConsentSync: Consent updated, ready for app sync');
  }

  /**
   * Generate a mobile app URL with current consent parameters
   * @param {string} appRoute - The route within the mobile app
   * @returns {string} - Mobile app deep link with consent parameters
   */
  generateAppDeepLinkWithConsent(appRoute = '') {
    try {
      const consent = consentManager.getConsent();
      if (!consent) {
        // No consent to sync, return basic app link
        return `${this.mobileAppScheme}${appRoute}`;
      }

      const url = new URL(`${this.mobileAppScheme}${appRoute}`);
      
      // Add consent sync parameters
      url.searchParams.set('consent_sync', '1');
      url.searchParams.set('consent_timestamp', Date.now().toString());
      url.searchParams.set('consent_source', 'website');
      url.searchParams.set('consent_mode_version', 'v2');
      
      // Add individual consent types
      if (consent.analytics !== undefined) {
        url.searchParams.set('consent_analytics', consent.analytics ? '1' : '0');
      }
      if (consent.marketing !== undefined) {
        url.searchParams.set('consent_marketing', consent.marketing ? '1' : '0');
      }
      if (consent.preferences !== undefined) {
        url.searchParams.set('consent_preferences', consent.preferences ? '1' : '0');
      }
      if (consent.necessary !== undefined) {
        url.searchParams.set('consent_necessary', consent.necessary ? '1' : '0');
      }

      console.log('CrossPlatformConsentSync: Generated app deep link with consent');
      return url.toString();
    } catch (error) {
      console.warn('CrossPlatformConsentSync: Error generating app deep link:', error);
      return `${this.mobileAppScheme}${appRoute}`;
    }
  }

  /**
   * Generate a website URL with current consent parameters (for app to website navigation)
   * @param {string} websitePath - The path on the website
   * @returns {string} - Website URL with consent parameters
   */
  generateWebsiteUrlWithConsent(websitePath = '/') {
    try {
      const consent = consentManager.getConsent();
      if (!consent) {
        // No consent to sync, return basic website URL
        return `https://www.cdlhelp.com${websitePath}`;
      }

      const url = new URL(websitePath, 'https://www.cdlhelp.com');
      
      // Add consent sync parameters
      url.searchParams.set('consent_sync', '1');
      url.searchParams.set('consent_timestamp', Date.now().toString());
      url.searchParams.set('consent_source', 'website');
      url.searchParams.set('consent_mode_version', 'v2');
      
      // Add individual consent types
      if (consent.analytics !== undefined) {
        url.searchParams.set('consent_analytics', consent.analytics ? '1' : '0');
      }
      if (consent.marketing !== undefined) {
        url.searchParams.set('consent_marketing', consent.marketing ? '1' : '0');
      }
      if (consent.preferences !== undefined) {
        url.searchParams.set('consent_preferences', consent.preferences ? '1' : '0');
      }
      if (consent.necessary !== undefined) {
        url.searchParams.set('consent_necessary', consent.necessary ? '1' : '0');
      }

      return url.toString();
    } catch (error) {
      console.warn('CrossPlatformConsentSync: Error generating website URL:', error);
      return `https://www.cdlhelp.com${websitePath}`;
    }
  }

  /**
   * Check if consent data should be synced to mobile app
   * @returns {boolean} - True if sync is recommended
   */
  shouldSyncToApp() {
    const consent = consentManager.getConsent();
    return consent !== null && this.lastSyncTimestamp !== null;
  }

  /**
   * Check if the current page load came from mobile app with consent data
   * @returns {boolean} - True if this is a consent sync from app
   */
  isIncomingAppConsentSync() {
    if (typeof window === 'undefined') return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('consent_sync') === '1' && urlParams.get('consent_source') === 'app';
  }

  /**
   * Get consent sync status for debugging
   * @returns {Object} - Current sync status
   */
  getSyncStatus() {
    return {
      initialized: this.initialized,
      syncInProgress: this.syncInProgress,
      lastSyncTimestamp: this.lastSyncTimestamp,
      hasConsent: consentManager.getConsent() !== null,
      isIncomingAppSync: this.isIncomingAppConsentSync(),
      shouldSyncToApp: this.shouldSyncToApp(),
    };
  }

  /**
   * Force sync consent to storage (for testing)
   */
  forceSyncToStorage() {
    const consent = consentManager.getConsent();
    if (consent) {
      // Re-save consent to trigger any storage updates
      consentManager.setConsent(consent);
      console.log('CrossPlatformConsentSync: Forced consent sync to storage');
    }
  }

  /**
   * Clear sync history (for account deletion or reset)
   */
  clearSyncHistory() {
    this.lastSyncTimestamp = null;
    this.syncInProgress = false;
    console.log('CrossPlatformConsentSync: Sync history cleared');
  }
}

// Create singleton instance
const crossPlatformConsentSync = new CrossPlatformConsentSync();

export default crossPlatformConsentSync;