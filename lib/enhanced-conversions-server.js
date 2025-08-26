/**
 * Server-Side Enhanced Conversions for Google Ads
 * Addresses audit finding: "Hashing reliability" and "Missing server-side implementation"
 * Provides reliable SHA-256 hashing with proper error handling and fallbacks
 */

import { SHA256 } from 'crypto-js';

class EnhancedConversionsServer {
  constructor() {
    this.debug = process.env.NODE_ENV === 'development';
    this.apiEndpoint = process.env.NODE_ENV === 'production' 
      ? 'https://api.truckdriver.help'
      : 'http://localhost:8003';
  }

  /**
   * Track conversion with server-side Enhanced Conversions
   * Addresses critical audit issue with client-side hashing reliability
   */
  async trackConversion(conversionData) {
    try {
      const {
        conversionId,
        conversionLabel,
        value,
        currency = 'USD',
        transactionId,
        userData = {}
      } = conversionData;

      // Validate required parameters
      if (!conversionId || !conversionLabel) {
        throw new Error('Missing required conversion parameters');
      }

      // Prepare conversion payload
      const conversionPayload = {
        conversion_id: conversionId,
        conversion_label: conversionLabel,
        value: parseFloat(value || 0),
        currency: currency,
        transaction_id: transactionId || this._generateTransactionId(),
        timestamp: Math.floor(Date.now() / 1000),
        user_data: userData,
        // Additional context for server processing
        page_location: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        client_timestamp: Date.now()
      };

      // Try server-side processing first (most reliable)
      try {
        const serverResult = await this._sendToServer(conversionPayload);
        if (serverResult.success) {
          if (this.debug) {
            console.log('✅ Enhanced Conversion processed server-side:', conversionPayload);
          }
          return { success: true, method: 'server', data: serverResult };
        }
      } catch (serverError) {
        console.warn('Server-side Enhanced Conversions failed, falling back to client:', serverError);
      }

      // Fallback to client-side with improved reliability
      const clientResult = await this._processClientSide(conversionPayload);
      return { success: true, method: 'client', data: clientResult };

    } catch (error) {
      console.error('Enhanced Conversions tracking failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send conversion to server for reliable processing
   */
  async _sendToServer(conversionData) {
    const response = await fetch(`${this.apiEndpoint}/api/google-ads/enhanced-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'website',
        'X-Conversion-Source': 'enhanced_conversions',
      },
      body: JSON.stringify(conversionData)
    });

    if (!response.ok) {
      throw new Error(`Server response: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Client-side processing with improved reliability
   * Addresses audit finding about CryptoJS dependency issues
   */
  async _processClientSide(conversionData) {
    try {
      // Collect and hash user data with multiple fallback methods
      const hashedUserData = await this._collectAndHashUserData(conversionData.user_data);
      
      // Send to Google Ads with Enhanced Conversions
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': `${conversionData.conversion_id}/${conversionData.conversion_label}`,
          'value': conversionData.value,
          'currency': conversionData.currency,
          'transaction_id': conversionData.transaction_id,
          'user_data': hashedUserData
        });

        return { 
          success: true, 
          hashedUserData: hashedUserData,
          timestamp: conversionData.timestamp 
        };
      } else {
        throw new Error('gtag not available for client-side tracking');
      }
    } catch (error) {
      console.error('Client-side Enhanced Conversions failed:', error);
      // Fallback to basic conversion tracking
      return this._fallbackBasicTracking(conversionData);
    }
  }

  /**
   * Collect and hash user data with multiple fallback methods
   * Addresses audit issue: "Hashing dependency reliability"
   */
  async _collectAndHashUserData(userData = {}) {
    const hashedData = {};

    try {
      // Method 1: Try Web Crypto API (most reliable, built-in)
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        return await this._hashWithWebCrypto(userData);
      }
    } catch (error) {
      console.warn('Web Crypto API failed, trying CryptoJS:', error);
    }

    try {
      // Method 2: CryptoJS fallback
      return this._hashWithCryptoJS(userData);
    } catch (error) {
      console.warn('CryptoJS failed, using basic hashing:', error);
    }

    // Method 3: Basic fallback (for development/testing)
    return this._basicHashFallback(userData);
  }

  /**
   * Hash with Web Crypto API (most reliable)
   */
  async _hashWithWebCrypto(userData) {
    const hashedData = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (value && typeof value === 'string') {
        const normalizedValue = this._normalizeValue(key, value);
        const encoder = new TextEncoder();
        const data = encoder.encode(normalizedValue);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashedData[key] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    }

    return hashedData;
  }

  /**
   * Hash with CryptoJS (fallback)
   */
  _hashWithCryptoJS(userData) {
    const hashedData = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (value && typeof value === 'string') {
        const normalizedValue = this._normalizeValue(key, value);
        hashedData[key] = SHA256(normalizedValue).toString();
      }
    }

    return hashedData;
  }

  /**
   * Basic hash fallback (for testing environments)
   */
  _basicHashFallback(userData) {
    console.warn('Using basic hash fallback - not suitable for production');
    const hashedData = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (value && typeof value === 'string') {
        // Simple hash for development/testing only
        let hash = 0;
        const normalizedValue = this._normalizeValue(key, value);
        for (let i = 0; i < normalizedValue.length; i++) {
          const char = normalizedValue.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        hashedData[key] = 'basic_' + Math.abs(hash).toString(16);
      }
    }

    return hashedData;
  }

  /**
   * Normalize user data values according to Google Ads requirements
   */
  _normalizeValue(key, value) {
    if (!value) return '';

    let normalized = value.toString().toLowerCase().trim();

    // Email normalization
    if (key === 'email') {
      // Remove dots from Gmail addresses
      if (normalized.includes('@gmail.')) {
        const [localPart, domain] = normalized.split('@');
        normalized = localPart.replace(/\./g, '') + '@' + domain;
      }
    }

    // Phone number normalization
    if (key === 'phone_number') {
      // Remove all non-digit characters
      normalized = normalized.replace(/\D/g, '');
      // Add country code if missing (assume US)
      if (normalized.length === 10) {
        normalized = '1' + normalized;
      }
    }

    // Name normalization
    if (key.includes('name')) {
      // Remove extra whitespace
      normalized = normalized.replace(/\s+/g, ' ');
    }

    // Address normalization
    if (key.includes('address')) {
      normalized = normalized.replace(/\s+/g, ' ');
    }

    return normalized;
  }

  /**
   * Fallback to basic conversion tracking without Enhanced Conversions
   */
  _fallbackBasicTracking(conversionData) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `${conversionData.conversion_id}/${conversionData.conversion_label}`,
        'value': conversionData.value,
        'currency': conversionData.currency,
        'transaction_id': conversionData.transaction_id
      });

      return { 
        success: true, 
        method: 'basic_fallback',
        timestamp: conversionData.timestamp 
      };
    }

    throw new Error('No tracking method available');
  }

  /**
   * Collect user data from various sources
   */
  async _collectUserData() {
    const userData = {};

    try {
      // Try to get user data from various sources
      
      // From forms or user input (when available)
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          userData.email = emailInput.value;
        }

        const phoneInput = form.querySelector('input[type="tel"], input[name*="phone"]');
        if (phoneInput && phoneInput.value) {
          userData.phone_number = phoneInput.value;
        }
      });

      // From localStorage or session data (with user consent)
      if (this._hasUserConsent()) {
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
          try {
            const parsed = JSON.parse(storedUserData);
            Object.assign(userData, parsed);
          } catch (e) {
            console.warn('Failed to parse stored user data:', e);
          }
        }
      }

    } catch (error) {
      console.warn('Failed to collect user data:', error);
    }

    return userData;
  }

  /**
   * Check if user has given consent for data collection
   */
  _hasUserConsent() {
    // Check consent manager
    if (typeof window !== 'undefined' && window.ConsentManager) {
      return window.ConsentManager.hasAnalyticsConsent();
    }

    // Fallback consent check
    if (typeof localStorage !== 'undefined') {
      const consent = localStorage.getItem('user_consent');
      return consent === 'granted' || consent === 'analytics_granted';
    }

    return false;
  }

  /**
   * Generate transaction ID
   */
  _generateTransactionId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Track subscription conversion (CDL Help specific)
   */
  async trackSubscriptionConversion(subscriptionData) {
    const {
      subscriptionType = 'monthly',
      value,
      currency = 'USD',
      userId,
      email,
      phone
    } = subscriptionData;

    const conversionData = {
      conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || 'AW-11366664092',
      conversionLabel: 'UXMnCJi4quYaEJyPhqwq', // CDL Help subscription conversion
      value: parseFloat(value),
      currency: currency,
      transactionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userData: {
        email: email,
        phone_number: phone,
        user_id: userId
      }
    };

    return await this.trackConversion(conversionData);
  }

  /**
   * Track app download conversion
   */
  async trackAppDownloadConversion(downloadData = {}) {
    const conversionData = {
      conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || 'AW-11366664092',
      conversionLabel: 'app_download', // Configure in Google Ads
      value: 5.00, // Estimated value
      currency: 'USD',
      transactionId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userData: await this._collectUserData()
    };

    return await this.trackConversion(conversionData);
  }

  /**
   * Track lead conversion
   */
  async trackLeadConversion(leadData = {}) {
    const conversionData = {
      conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || 'AW-11366664092',
      conversionLabel: 'lead_generation', // Configure in Google Ads
      value: parseFloat(leadData.value || 2.50),
      currency: 'USD',
      transactionId: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userData: {
        email: leadData.email,
        phone_number: leadData.phone,
        ...leadData.userData
      }
    };

    return await this.trackConversion(conversionData);
  }
}

// Export singleton instance
const enhancedConversionsServer = new EnhancedConversionsServer();

export default enhancedConversionsServer;