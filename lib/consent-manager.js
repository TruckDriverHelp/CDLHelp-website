import cookie from 'js-cookie';

class ConsentManager {
  constructor() {
    this.consentKey = 'cookieConsent';
    this.consentTypes = {
      necessary: true, // Always true
      analytics: false,
      marketing: false,
    };
    this.callbacks = [];
    this.initialized = false;
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
    cookie.set(this.consentKey, JSON.stringify(this.consentTypes), { expires: 365 });
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
    this.setConsent({ analytics: true, marketing: true });
  }

  updateGoogleConsent() {
    if (typeof window !== 'undefined' && window.gtag) {
      // Update Google Consent Mode based on user choices
      window.gtag('consent', 'update', {
        analytics_storage: this.consentTypes.analytics ? 'granted' : 'denied',
        ad_storage: this.consentTypes.marketing ? 'granted' : 'denied',
        ad_user_data: this.consentTypes.marketing ? 'granted' : 'denied',
        ad_personalization: this.consentTypes.marketing ? 'granted' : 'denied',
      });
    }
  }

  rejectAll() {
    cookie.set(this.consentKey, 'rejected', { expires: 365 });
    this.consentTypes = { necessary: true, analytics: false, marketing: false };
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
      'facebook-pixel': 'marketing',
      appsflyer: 'marketing',
    };

    const requiredConsent = consentMap[scriptType];
    return !requiredConsent || this.hasConsent(requiredConsent);
  }
}

// Create singleton instance
const consentManager = new ConsentManager();

export default consentManager;
