/**
 * Attribution and Deep Linking Module
 * Handles AppsFlyer OneLink, UTM parameters, and deep linking
 * Enhanced with Unified Identity Service for cross-platform tracking
 */

import consentManager from './consent-manager';
import unifiedIdentity from './unified-identity';

class Attribution {
  constructor() {
    this.appStoreUrls = {
      ios: 'https://apps.apple.com/{locale}/app/cdl-help/id6444388755',
      android: 'https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp',
    };

    // AppsFlyer OneLink configuration
    this.oneLinkConfig = {
      oneLinkURL:
        process.env.NEXT_PUBLIC_APPSFLYER_ONELINK_URL || 'https://cdlhelp.onelink.me/mHbW/mgvvp96d',
      pidKeysList: ['pid', 'utm_source', 'source'],
      pidStaticValue: 'website',
      campaignKeysList: ['c', 'utm_campaign', 'campaign'],
      campaignStaticValue: null,
      pidOverrideList: {
        google: 'google_ads',
        facebook: 'facebook_ads',
        instagram: 'instagram_ads',
        twitter: 'twitter_ads',
        linkedin: 'linkedin_ads',
      },
    };
  }

  /**
   * Generate attribution link with all tracking parameters and unified identity
   */
  generateAttributionLink(platform, customParams = {}) {
    const baseUrl = this.getBaseUrl(platform);

    // Only add tracking parameters if we have marketing consent
    if (!consentManager.hasConsent('marketing')) {
      return baseUrl;
    }

    // Get unified identity data for cross-platform tracking
    const identity = unifiedIdentity.getUserIdentity();

    // Merge unified identity with custom parameters
    const unifiedParams = {
      ...customParams,
      unified_user_id: identity.unifiedUserId,
      session_id: identity.sessionId,
      device_fingerprint: identity.deviceFingerprint,
      web_visit_count: identity.visitMetrics.visitCount,
      attribution_timestamp: Date.now(),
    };

    const params = this.buildAttributionParams(unifiedParams);

    // For AppsFlyer OneLink
    if (this.shouldUseOneLink()) {
      return this.generateOneLink(platform, params);
    }

    // Fallback to direct app store links with parameters
    return this.appendParamsToUrl(baseUrl, params);
  }

  /**
   * Generate AppsFlyer OneLink
   */
  generateOneLink(platform, params) {
    const oneLinkUrl = this.oneLinkConfig.oneLinkURL;
    const afParams = {
      pid: this.getPid(params),
      c: this.getCampaign(params),
      af_dp: this.getDeepLink(params),
      af_web_dp: window.location.href,
      af_force_deeplink: true,
      af_ios_url: this.appStoreUrls.ios.replace('{locale}', 'us'),
      af_android_url: this.appStoreUrls.android,
    };

    // Add custom parameters
    Object.keys(params).forEach(key => {
      if (!['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content'].includes(key)) {
        afParams[`af_${key}`] = params[key];
      }
    });

    // Add sub parameters for detailed attribution
    afParams.af_sub1 = params.utm_medium || 'organic';
    afParams.af_sub2 = params.utm_term || '';
    afParams.af_sub3 = params.utm_content || '';
    afParams.af_sub4 = platform;
    afParams.af_sub5 = this.getLocale();

    return this.appendParamsToUrl(oneLinkUrl, afParams);
  }

  /**
   * Get PID (media source) from parameters
   */
  getPid(params) {
    // Check override list first
    const source = params.utm_source || params.source || params.pid;
    if (source && this.oneLinkConfig.pidOverrideList[source]) {
      return this.oneLinkConfig.pidOverrideList[source];
    }

    // Check pid keys list
    for (const key of this.oneLinkConfig.pidKeysList) {
      if (params[key]) return params[key];
    }

    return this.oneLinkConfig.pidStaticValue;
  }

  /**
   * Get campaign from parameters
   */
  getCampaign(params) {
    for (const key of this.oneLinkConfig.campaignKeysList) {
      if (params[key]) return params[key];
    }
    return this.oneLinkConfig.campaignStaticValue || 'website_organic';
  }

  /**
   * Build deep link for specific app content
   */
  getDeepLink(params) {
    const path = params.deep_link_path || params.path || '';
    const screen = params.screen || params.page || 'home';

    // Build deep link based on app's URL scheme
    return `cdlhelp://${screen}${path}`;
  }

  /**
   * Build attribution parameters from various sources
   */
  buildAttributionParams(customParams = {}) {
    const urlParams = this.getUrlParams();
    const sessionParams = this.getSessionParams();
    const deviceParams = this.getDeviceParams();

    return {
      ...deviceParams,
      ...sessionParams,
      ...urlParams,
      ...customParams,
      timestamp: new Date().toISOString(),
      locale: this.getLocale(),
    };
  }

  /**
   * Get URL parameters
   */
  getUrlParams() {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    const params = {};

    // Standard UTM parameters
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const value = urlParams.get(key);
      if (value) params[key] = value;
    });

    // Google and Facebook click IDs
    ['gclid', 'fbclid', 'msclkid', 'ttclid'].forEach(key => {
      const value = urlParams.get(key);
      if (value) params[key] = value;
    });

    return params;
  }

  /**
   * Get session storage parameters (for cross-page attribution)
   */
  getSessionParams() {
    if (typeof window === 'undefined') return {};

    try {
      const stored = sessionStorage.getItem('attribution_params');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get device and browser parameters
   */
  getDeviceParams() {
    if (typeof window === 'undefined') return {};

    return {
      device_type: this.getDeviceType(),
      os: this.getOS(),
      browser: this.getBrowser(),
      referrer: document.referrer || 'direct',
      landing_page: window.location.pathname,
    };
  }

  /**
   * Store attribution parameters for cross-page tracking
   */
  storeAttributionParams(params) {
    if (typeof window === 'undefined') return;

    try {
      const existing = this.getSessionParams();
      const merged = { ...existing, ...params };
      sessionStorage.setItem('attribution_params', JSON.stringify(merged));
    } catch (e) {}
  }

  /**
   * Detect device type
   */
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        ua
      )
    )
      return 'mobile';
    return 'desktop';
  }

  /**
   * Detect operating system
   */
  getOS() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'ios';
    if (/win/i.test(ua)) return 'windows';
    if (/mac/i.test(ua)) return 'macos';
    return 'other';
  }

  /**
   * Detect browser
   */
  getBrowser() {
    const ua = navigator.userAgent;
    if (/chrome|crios|crmo/i.test(ua)) return 'chrome';
    if (/firefox|fxios/i.test(ua)) return 'firefox';
    if (/safari/i.test(ua) && !/chrome|crios|crmo/i.test(ua)) return 'safari';
    if (/edg/i.test(ua)) return 'edge';
    return 'other';
  }

  /**
   * Get current locale
   */
  getLocale() {
    if (typeof window === 'undefined') return 'en';

    const path = window.location.pathname;
    const localeMatch = path.match(/^\/([a-z]{2})\//);
    return localeMatch ? localeMatch[1] : 'en';
  }

  /**
   * Get base URL for platform
   */
  getBaseUrl(platform) {
    const locale = this.getLocale();
    if (platform === 'ios') {
      return this.appStoreUrls.ios.replace('{locale}', locale === 'en' ? 'us' : locale);
    }
    return this.appStoreUrls.android;
  }

  /**
   * Check if should use OneLink
   */
  shouldUseOneLink() {
    return !!(
      process.env.NEXT_PUBLIC_APPSFLYER_ONELINK_URL && process.env.NEXT_PUBLIC_APPSFLYER_DEV_KEY
    );
  }

  /**
   * Append parameters to URL
   */
  appendParamsToUrl(url, params) {
    const urlObj = new URL(url);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        urlObj.searchParams.set(key, params[key]);
      }
    });
    return urlObj.toString();
  }

  /**
   * Handle app store redirect with attribution
   */
  redirect(platform, customParams = {}) {
    // Store parameters for later use
    this.storeAttributionParams(customParams);

    // Generate attribution link
    const attributionUrl = this.generateAttributionLink(platform, customParams);

    // Track redirect event
    if (window.analytics) {
      window.analytics.trackAppStoreRedirect(platform, attributionUrl);
    }

    // Redirect to app store
    window.location.href = attributionUrl;
  }
}

// Export singleton instance
const attribution = new Attribution();
export default attribution;

// Convenience exports
export const { generateAttributionLink, redirect, storeAttributionParams } = {
  generateAttributionLink: (...args) => attribution.generateAttributionLink(...args),
  redirect: (...args) => attribution.redirect(...args),
  storeAttributionParams: (...args) => attribution.storeAttributionParams(...args),
};
