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
    
    // Check for consent parameters in URL first (for cross-domain sync)
    this.handleIncomingConsentParameters();
    
    // Check existing consent and apply if available
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
    // Wait for gtag to be available if it's not ready yet
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Google Consent Mode V2 - Required for EEA/UK compliance
      const consentUpdate = {
        // Core consent types
        analytics_storage: this.consentTypes.analytics ? 'granted' : 'denied',
        ad_storage: this.consentTypes.marketing ? 'granted' : 'denied',
        
        // Consent Mode V2 - New required parameters for ads
        ad_user_data: this.consentTypes.marketing ? 'granted' : 'denied',
        ad_personalization: this.consentTypes.marketing ? 'granted' : 'denied',
        
        // Additional consent types
        functionality_storage: 'granted', // Always granted for necessary cookies
        personalization_storage: this.consentTypes.preferences ? 'granted' : 'denied',
        security_storage: 'granted', // Always granted for security
      };

      // Update Google Consent Mode with V2 parameters
      window.gtag('consent', 'update', consentUpdate);
      
      // Set region-specific defaults for Consent Mode V2
      if (this.isPrivacyStrictRegion()) {
        // For EEA/UK users, set wait_for_update to ensure consent is collected
        window.gtag('consent', 'default', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 2000, // Wait up to 2 seconds for consent update
          region: ['EEA', 'GB', 'EU', 'UK']
        });
      }

      // Debug logging
      if (window.__ANALYTICS_DEBUG__) {
        console.log('Google Consent Mode V2 updated:', consentUpdate);
      }

      // Send consent state as event for monitoring
      window.gtag('event', 'consent_update', {
        event_category: 'consent',
        event_label: this.getConsentSummary(),
        consent_analytics: this.consentTypes.analytics,
        consent_marketing: this.consentTypes.marketing,
        consent_mode_version: 'v2',
        region: this.getUserRegion(),
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
  
  // Get user's region for Consent Mode V2
  getUserRegion() {
    if (typeof document === 'undefined') return 'unknown';
    
    // Try to get region from Cloudflare header
    const cfCountry = document.querySelector('meta[name="cf-country"]')?.content;
    if (cfCountry) return cfCountry;
    
    // Try to get from Accept-Language header
    const lang = navigator.language || navigator.userLanguage;
    if (lang) {
      const country = lang.split('-')[1];
      if (country) return country.toUpperCase();
    }
    
    // Try timezone-based detection
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      if (tz.includes('Europe')) return 'EU';
      if (tz.includes('London')) return 'GB';
      if (tz.includes('America')) return 'US';
    }
    
    return 'unknown';
  }

  /**
   * Handle incoming consent parameters from URL (for cross-domain consent sync)
   */
  handleIncomingConsentParameters() {
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check if this is a consent sync request
      const isConsentSync = urlParams.get('consent_sync') === '1';
      if (!isConsentSync) return;

      // Get timestamp to check if consent data is recent
      const consentTimestamp = urlParams.get('consent_timestamp');
      if (consentTimestamp) {
        const timestamp = parseInt(consentTimestamp, 10);
        const now = Date.now();
        // Only accept consent data that's less than 5 minutes old
        if (now - timestamp > 300000) {
          console.warn('ConsentManager: Incoming consent data is too old, ignoring');
          return;
        }
      }

      // Extract consent parameters
      const incomingConsent = {};
      const analyticsParam = urlParams.get('consent_analytics');
      const marketingParam = urlParams.get('consent_marketing');
      const preferencesParam = urlParams.get('consent_preferences');
      const necessaryParam = urlParams.get('consent_necessary');
      
      if (analyticsParam !== null) {
        incomingConsent.analytics = analyticsParam === '1';
      }
      if (marketingParam !== null) {
        incomingConsent.marketing = marketingParam === '1';
      }
      if (preferencesParam !== null) {
        incomingConsent.preferences = preferencesParam === '1';
      }
      if (necessaryParam !== null) {
        incomingConsent.necessary = necessaryParam === '1';
      }

      // Only apply incoming consent if we don't have existing consent
      const existingConsent = this.getConsent();
      if (!existingConsent && Object.keys(incomingConsent).length > 0) {
        console.log('ConsentManager: Applying incoming consent from URL parameters');
        this.setConsent(incomingConsent);
        
        // Clean up URL parameters to avoid re-processing
        this.cleanupConsentParametersFromUrl();
      }
    } catch (error) {
      console.warn('ConsentManager: Error handling incoming consent parameters:', error);
    }
  }

  /**
   * Remove consent parameters from URL after processing
   */
  cleanupConsentParametersFromUrl() {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(window.location.href);
      const consentParams = [
        'consent_sync',
        'consent_timestamp',
        'consent_analytics',
        'consent_marketing',
        'consent_preferences',
        'consent_necessary',
        'consent_mode_version',
        'consent_source'
      ];

      let hasChanges = false;
      consentParams.forEach(param => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        // Update URL without consent parameters using replaceState to avoid page reload
        window.history.replaceState({}, '', url.toString());
      }
    } catch (error) {
      console.warn('ConsentManager: Error cleaning up consent parameters from URL:', error);
    }
  }
  
}

// Create singleton instance
const consentManager = new ConsentManager();

export default consentManager;
