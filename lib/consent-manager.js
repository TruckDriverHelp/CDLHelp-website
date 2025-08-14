import cookie from 'js-cookie';

class ConsentManager {
  constructor() {
    this.consentKey = 'cookieConsent';
    this.consentTypes = {
      necessary: true, // Always true
      analytics: false,
      marketing: false,
      preferences: false,
    };
    this.callbacks = [];
    this.initialized = false;
    this.consentHistory = [];
  }

  init() {
    if (this.initialized) return;

    const consent = this.getConsent();
    if (consent) {
      this.consentTypes = { ...this.consentTypes, ...consent };
      // Update Google Consent Mode if user has already made a choice
      this.updateGoogleConsent();
    }

    this.initialized = true;
  }

  getConsent() {
    const consentCookie = cookie.get(this.consentKey);
    if (!consentCookie || consentCookie === 'rejected') {
      return null;
    }

    try {
      return JSON.parse(consentCookie);
    } catch {
      // Legacy format - treat 'accepted' as all consents
      if (consentCookie === 'accepted') {
        return { analytics: true, marketing: true };
      }
      return null;
    }
  }

  setConsent(consentTypes) {
    this.consentTypes = { ...this.consentTypes, ...consentTypes };

    // Store consent history for debugging
    this.consentHistory.push({
      timestamp: new Date().toISOString(),
      consentTypes: { ...this.consentTypes },
      source: this.getConsentSource(),
    });

    // Persist to cookie
    cookie.set(this.consentKey, JSON.stringify(this.consentTypes), { expires: 365 });

    // Also persist to localStorage for redundancy
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.consentKey, JSON.stringify(this.consentTypes));
      localStorage.setItem(`${this.consentKey}_timestamp`, new Date().toISOString());
    }

    this.updateGoogleConsent();
    this.notifyCallbacks();

    // Dispatch custom event for Yandex.Metrica and other listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('consentChanged', {
          detail: this.consentTypes,
        })
      );
    }
  }

  acceptAll() {
    this.setConsent({ analytics: true, marketing: true, preferences: true });
  }

  updateGoogleConsent() {
    if (typeof window !== 'undefined' && window.gtag) {
      const consentUpdate = {
        analytics_storage: this.consentTypes.analytics ? 'granted' : 'denied',
        ad_storage: this.consentTypes.marketing ? 'granted' : 'denied',
        ad_user_data: this.consentTypes.marketing ? 'granted' : 'denied',
        ad_personalization: this.consentTypes.marketing ? 'granted' : 'denied',
        functionality_storage: 'granted', // Always granted for necessary cookies
        personalization_storage: this.consentTypes.preferences ? 'granted' : 'denied',
        security_storage: 'granted', // Always granted for security
      };

      // Update Google Consent Mode
      window.gtag('consent', 'update', consentUpdate);

      // Debug logging
      if (window.__ANALYTICS_DEBUG__) {
        console.log('[Consent Manager] Google Consent Mode Updated:', consentUpdate);
        console.log('[Consent Manager] Consent History:', this.consentHistory);
      }

      // Send consent state as event for monitoring
      window.gtag('event', 'consent_update', {
        event_category: 'consent',
        event_label: this.getConsentSummary(),
        consent_analytics: this.consentTypes.analytics,
        consent_marketing: this.consentTypes.marketing,
        non_interaction: true,
      });
    }
  }

  rejectAll() {
    cookie.set(this.consentKey, 'rejected', { expires: 365 });
    this.consentTypes = { necessary: true, analytics: false, marketing: false, preferences: false };
    this.updateGoogleConsent();
    this.notifyCallbacks();
  }

  hasConsent(type) {
    return this.consentTypes[type] || false;
  }

  onConsentChange(callback) {
    this.callbacks.push(callback);
  }

  notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.consentTypes));
  }

  shouldLoadScript(scriptType) {
    // Map script types to consent categories
    const consentMap = {
      'google-analytics': 'analytics',
      'google-tag-manager': 'analytics',
      'yandex-metrica': 'analytics',
      smartlook: 'analytics',
      amplitude: 'analytics',
      'facebook-pixel': 'marketing',
      appsflyer: 'marketing',
    };

    const requiredConsent = consentMap[scriptType];
    return !requiredConsent || this.hasConsent(requiredConsent);
  }

  getConsentSource() {
    // Detect source of consent update
    const stack = new Error().stack;
    if (stack.includes('acceptAll')) return 'accept_all_button';
    if (stack.includes('rejectAll')) return 'reject_all_button';
    if (stack.includes('handleCustomize')) return 'customize_button';
    return 'unknown';
  }

  getConsentSummary() {
    return `analytics:${this.consentTypes.analytics},marketing:${this.consentTypes.marketing}`;
  }

  // Get consent state for debugging
  getConsentState() {
    return {
      current: this.consentTypes,
      history: this.consentHistory,
      initialized: this.initialized,
      cookieValue: cookie.get(this.consentKey),
      localStorageValue:
        typeof window !== 'undefined' ? localStorage.getItem(this.consentKey) : null,
    };
  }

  // Check if user is in privacy-strict region
  isPrivacyStrictRegion() {
    const strictRegions = ['EU', 'UK', 'CA', 'CH', 'EEA', 'GB'];
    const cfCountry =
      typeof document !== 'undefined'
        ? document.querySelector('meta[name="cf-country"]')?.content
        : null;

    if (cfCountry && strictRegions.includes(cfCountry)) {
      return true;
    }

    return false;
  }
}

// Create singleton instance
const consentManager = new ConsentManager();

export default consentManager;
