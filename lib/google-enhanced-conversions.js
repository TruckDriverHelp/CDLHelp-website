/**
 * Google Ads Enhanced Conversions Implementation
 * Provides privacy-safe conversion improvement by sending hashed first-party data
 * Expected improvement: 10-15% increase in measured conversions
 */

import crypto from 'crypto';

class GoogleEnhancedConversions {
  constructor() {
    this.isInitialized = false;
    this.userData = {};
    this.conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    this.conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
    this.enhancedConversionsEnabled = false;
  }

  /**
   * Initialize Enhanced Conversions
   * Must be called after Google Ads script is loaded
   */
  initialize() {
    if (typeof window === 'undefined' || !window.gtag) {
      console.warn('Google Ads Enhanced Conversions: gtag not available');
      return false;
    }

    // Enable Enhanced Conversions for the conversion account
    window.gtag('config', this.conversionId, {
      'allow_enhanced_conversions': true
    });

    // Enable for Google Analytics as well if available
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        'allow_enhanced_conversions': true
      });
    }

    this.enhancedConversionsEnabled = true;
    this.isInitialized = true;
    console.log('Google Enhanced Conversions initialized');
    return true;
  }

  /**
   * Hash a value using SHA256 (Google's requirement)
   * @param {string} value - The value to hash
   * @returns {string|Promise<string>} - Hashed value in hex format
   */
  hashValue(value) {
    if (!value) return null;
    
    // Normalize the value (lowercase and trim)
    const normalized = value.toLowerCase().trim();
    
    // For client-side hashing (if crypto-js is available)
    if (typeof window !== 'undefined' && window.CryptoJS) {
      return window.CryptoJS.SHA256(normalized).toString();
    }
    
    // For server-side Node.js
    if (typeof window === 'undefined' && crypto.createHash) {
      return crypto.createHash('sha256').update(normalized).digest('hex');
    }
    
    // For modern browsers - use Web Crypto API (async)
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Note: This returns a Promise - handle accordingly
      const encoder = new TextEncoder();
      const data = encoder.encode(normalized);
      return window.crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
    }
    
    console.error('Enhanced Conversions: No SHA-256 implementation available. CryptoJS library not loaded.');
    return null;
  }

  /**
   * Helper to convert buffer to hex string
   */
  bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Format phone number for hashing
   * @param {string} phone - Phone number to format
   * @returns {string} - E.164 formatted phone number
   */
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if not present (assuming US)
    if (cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }
    
    // Add + prefix for E.164 format
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Set user data for Enhanced Conversions
   * @param {Object} data - User data object
   * @returns {Promise<Object>} - Promise resolving to enhanced data
   */
  async setUserData(data) {
    const enhancedData = {};

    // Helper function to handle async/sync hashing
    const hashAsync = async (value) => {
      const result = this.hashValue(value);
      return result instanceof Promise ? await result : result;
    };

    // Email
    if (data.email) {
      enhancedData.email = await hashAsync(data.email);
    }

    // Phone number
    if (data.phone || data.phoneNumber) {
      const phone = this.formatPhoneNumber(data.phone || data.phoneNumber);
      if (phone) {
        enhancedData.phone_number = await hashAsync(phone);
      }
    }

    // Name
    if (data.firstName || data.first_name) {
      enhancedData.first_name = await hashAsync(data.firstName || data.first_name);
    }
    if (data.lastName || data.last_name) {
      enhancedData.last_name = await hashAsync(data.lastName || data.last_name);
    }

    // Address
    const address = {};
    if (data.street || data.address1) {
      address.street = data.street || data.address1;
    }
    if (data.city) {
      address.city = await hashAsync(data.city);
    }
    if (data.region || data.state) {
      address.region = await hashAsync(data.region || data.state);
    }
    if (data.postalCode || data.postal_code || data.zip) {
      address.postal_code = await hashAsync(data.postalCode || data.postal_code || data.zip);
    }
    if (data.country) {
      // Country should be 2-letter code, not hashed
      address.country = data.country.toUpperCase().substring(0, 2);
    }

    if (Object.keys(address).length > 0) {
      enhancedData.address = address;
    }

    // Store for later use
    this.userData = enhancedData;

    // Send to Google immediately if gtag is available
    if (typeof window !== 'undefined' && window.gtag && this.enhancedConversionsEnabled) {
      window.gtag('set', 'user_data', enhancedData);
      console.log('Enhanced Conversions user data set:', Object.keys(enhancedData));
    }

    return enhancedData;
  }

  /**
   * Track a conversion with enhanced data
   * @param {string} conversionLabel - Optional conversion label
   * @param {number} value - Conversion value
   * @param {string} currency - Currency code
   * @param {Object} additionalData - Additional conversion parameters
   */
  trackEnhancedConversion(conversionLabel, value, currency = 'USD', additionalData = {}) {
    if (!window.gtag) {
      console.warn('gtag not available for enhanced conversion tracking');
      return;
    }

    const conversionData = {
      'send_to': conversionLabel ? 
        `${this.conversionId}/${conversionLabel}` : 
        `${this.conversionId}/${this.conversionLabel}`,
      'value': value,
      'currency': currency,
      ...additionalData
    };

    // Include user data if available
    if (Object.keys(this.userData).length > 0) {
      conversionData.user_data = this.userData;
    }

    // Track the conversion
    window.gtag('event', 'conversion', conversionData);
    
    console.log('Enhanced conversion tracked:', {
      label: conversionLabel || this.conversionLabel,
      value,
      currency,
      hasUserData: Object.keys(this.userData).length > 0
    });
  }

  /**
   * Track a purchase conversion with enhanced data
   * @param {Object} purchaseData - Purchase information
   */
  trackPurchase(purchaseData) {
    const {
      transactionId,
      value,
      currency = 'USD',
      items = [],
      userData = {}
    } = purchaseData;

    // Set user data if provided
    if (userData && Object.keys(userData).length > 0) {
      this.setUserData(userData);
    }

    // Track enhanced conversion
    this.trackEnhancedConversion(
      'purchase',
      value,
      currency,
      {
        'transaction_id': transactionId,
        'items': items
      }
    );
  }

  /**
   * Track a lead conversion with enhanced data
   * @param {Object} leadData - Lead information
   */
  trackLead(leadData) {
    const {
      value = 0,
      currency = 'USD',
      userData = {}
    } = leadData;

    // Set user data - this is crucial for lead tracking
    if (userData && Object.keys(userData).length > 0) {
      this.setUserData(userData);
    }

    // Track enhanced conversion
    this.trackEnhancedConversion(
      'lead',
      value,
      currency
    );
  }

  /**
   * Track sign-up conversion with enhanced data
   * @param {Object} signupData - Signup information
   */
  trackSignup(signupData) {
    const {
      method = 'email',
      value = 0,
      userData = {}
    } = signupData;

    // Set user data
    if (userData && Object.keys(userData).length > 0) {
      this.setUserData(userData);
    }

    // Track enhanced conversion
    this.trackEnhancedConversion(
      'sign_up',
      value,
      'USD',
      {
        'method': method
      }
    );
  }

  /**
   * Automatically collect user data from form fields
   * @param {HTMLFormElement} form - Form element to collect data from
   */
  collectFromForm(form) {
    if (!form) return null;

    const userData = {};

    // Email fields
    const emailFields = form.querySelectorAll(
      'input[type="email"], input[name*="email"], input[id*="email"]'
    );
    if (emailFields.length > 0) {
      userData.email = emailFields[0].value;
    }

    // Phone fields
    const phoneFields = form.querySelectorAll(
      'input[type="tel"], input[name*="phone"], input[id*="phone"], input[name*="mobile"]'
    );
    if (phoneFields.length > 0) {
      userData.phone = phoneFields[0].value;
    }

    // Name fields
    const firstNameFields = form.querySelectorAll(
      'input[name*="first"], input[id*="first"], input[name="fname"]'
    );
    if (firstNameFields.length > 0) {
      userData.firstName = firstNameFields[0].value;
    }

    const lastNameFields = form.querySelectorAll(
      'input[name*="last"], input[id*="last"], input[name="lname"]'
    );
    if (lastNameFields.length > 0) {
      userData.lastName = lastNameFields[0].value;
    }

    // Address fields
    const streetFields = form.querySelectorAll(
      'input[name*="address"], input[name*="street"], input[id*="address"]'
    );
    if (streetFields.length > 0) {
      userData.street = streetFields[0].value;
    }

    const cityFields = form.querySelectorAll(
      'input[name*="city"], input[id*="city"]'
    );
    if (cityFields.length > 0) {
      userData.city = cityFields[0].value;
    }

    const stateFields = form.querySelectorAll(
      'input[name*="state"], input[name*="region"], select[name*="state"]'
    );
    if (stateFields.length > 0) {
      userData.state = stateFields[0].value;
    }

    const zipFields = form.querySelectorAll(
      'input[name*="zip"], input[name*="postal"], input[id*="zip"]'
    );
    if (zipFields.length > 0) {
      userData.postalCode = zipFields[0].value;
    }

    const countryFields = form.querySelectorAll(
      'input[name*="country"], select[name*="country"]'
    );
    if (countryFields.length > 0) {
      userData.country = countryFields[0].value;
    }

    return this.setUserData(userData);
  }

  /**
   * Attach automatic collection to forms
   * @param {string} formSelector - CSS selector for forms
   */
  attachToForms(formSelector = 'form') {
    if (typeof window === 'undefined') return;

    const forms = document.querySelectorAll(formSelector);
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        // Collect and set user data when form is submitted
        this.collectFromForm(form);
      });
    });

    console.log(`Enhanced Conversions attached to ${forms.length} forms`);
  }

  /**
   * Get current user data (for debugging)
   */
  getUserData() {
    return this.userData;
  }

  /**
   * Clear user data
   */
  clearUserData() {
    this.userData = {};
    if (window.gtag) {
      window.gtag('set', 'user_data', {});
    }
  }
}

// Create singleton instance
const enhancedConversions = new GoogleEnhancedConversions();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enhancedConversions.initialize();
      // Auto-attach to forms after a short delay
      setTimeout(() => {
        enhancedConversions.attachToForms();
      }, 1000);
    });
  } else {
    // DOM already loaded
    enhancedConversions.initialize();
    enhancedConversions.attachToForms();
  }
}

export default enhancedConversions;