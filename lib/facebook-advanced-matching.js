/**
 * Facebook Advanced Matching Service
 * Manages user data for improved match rates
 * Implements Meta's 2024 best practices
 */

class FacebookAdvancedMatching {
  constructor() {
    this.pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    this.userData = {};
    this.isInitialized = false;
    this.hashCache = new Map();
  }

  /**
   * Initialize Advanced Matching
   */
  async initialize() {
    if (this.isInitialized) return;

    // Load existing user data
    this.userData = this.loadUserData();

    // Set up event listeners for data changes
    this.setupEventListeners();

    this.isInitialized = true;
    console.log('[FB Advanced Matching] Initialized');
  }

  /**
   * SHA-256 hash function with caching
   */
  async hashValue(value) {
    if (!value) return null;

    // Normalize
    const normalized = value.toString().toLowerCase().trim().replace(/\s+/g, '');

    // Check cache
    if (this.hashCache.has(normalized)) {
      return this.hashCache.get(normalized);
    }

    let hash = null;

    // Use Web Crypto API
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(normalized);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.error('[FB Advanced Matching] Hashing error:', e);
      }
    }

    // Cache the result
    if (hash) {
      this.hashCache.set(normalized, hash);
    }

    return hash;
  }

  /**
   * Update user data for Advanced Matching
   * @param {Object} data - User data to update
   */
  async updateUserData(data) {
    // Merge with existing data
    this.userData = { ...this.userData, ...data };

    // Store in localStorage for persistence
    this.saveUserData();

    // Update Facebook Pixel if initialized
    if (typeof window !== 'undefined' && window.fbq) {
      const advancedMatching = await this.buildAdvancedMatching();
      
      // Update pixel with new data
      window.fbq('init', this.pixelId, advancedMatching);
      
      console.log('[FB Advanced Matching] Updated with fields:', Object.keys(advancedMatching));
    }
  }

  /**
   * Build Advanced Matching object
   */
  async buildAdvancedMatching() {
    const am = {};

    // Email
    if (this.userData.email) {
      am.em = await this.hashValue(this.userData.email);
    }

    // Phone
    if (this.userData.phone) {
      const normalized = this.normalizePhone(this.userData.phone);
      am.ph = await this.hashValue(normalized);
    }

    // Names
    if (this.userData.firstName) {
      am.fn = await this.hashValue(this.userData.firstName);
    }
    if (this.userData.lastName) {
      am.ln = await this.hashValue(this.userData.lastName);
    }

    // Date of birth (YYYYMMDD format)
    if (this.userData.dateOfBirth) {
      const dob = this.userData.dateOfBirth.replace(/\D/g, '');
      am.db = await this.hashValue(dob);
    }

    // Gender (m/f)
    if (this.userData.gender) {
      const gender = this.userData.gender.toLowerCase().charAt(0);
      if (gender === 'm' || gender === 'f') {
        am.ge = await this.hashValue(gender);
      }
    }

    // Location
    if (this.userData.city) {
      am.ct = await this.hashValue(this.userData.city);
    }
    if (this.userData.state) {
      am.st = await this.hashValue(this.userData.state);
    }
    if (this.userData.zip) {
      am.zp = await this.hashValue(this.userData.zip);
    }
    if (this.userData.country) {
      am.country = await this.hashValue(this.userData.country.substring(0, 2).toLowerCase());
    }

    // External ID
    if (this.userData.userId || this.userData.externalId) {
      am.external_id = await this.hashValue(this.userData.userId || this.userData.externalId);
    }

    // Remove any null/undefined values
    Object.keys(am).forEach(key => {
      if (!am[key]) delete am[key];
    });

    return am;
  }

  /**
   * Normalize phone number to E.164 format
   */
  normalizePhone(phone) {
    if (!phone) return '';

    let normalized = phone.replace(/\D/g, '');

    // Add US country code if 10 digits
    if (normalized.length === 10) {
      normalized = '1' + normalized;
    }

    // Add + prefix
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }

    return normalized;
  }

  /**
   * Track conversion with Advanced Matching
   */
  async trackConversion(eventName, parameters = {}) {
    if (typeof window === 'undefined' || !window.fbq) return;

    // Build Advanced Matching data
    const advancedMatching = await this.buildAdvancedMatching();

    // Track with Advanced Matching
    window.fbq('trackSingle', this.pixelId, eventName, parameters, {
      eventID: this.generateEventId(),
      ...advancedMatching
    });

    console.log(`[FB Advanced Matching] Tracked ${eventName} with ${Object.keys(advancedMatching).length} match fields`);
  }

  /**
   * Track standard e-commerce events
   */
  async trackPurchase(value, currency = 'USD', items = []) {
    await this.trackConversion('Purchase', {
      value: value,
      currency: currency,
      contents: items,
      content_type: 'product'
    });
  }

  async trackAddToCart(value, currency = 'USD', contentId) {
    await this.trackConversion('AddToCart', {
      value: value,
      currency: currency,
      content_ids: [contentId],
      content_type: 'product'
    });
  }

  async trackInitiateCheckout(value, currency = 'USD', numItems = 1) {
    await this.trackConversion('InitiateCheckout', {
      value: value,
      currency: currency,
      num_items: numItems
    });
  }

  async trackCompleteRegistration(value = 0, currency = 'USD') {
    await this.trackConversion('CompleteRegistration', {
      value: value,
      currency: currency,
      status: 'completed'
    });
  }

  async trackLead(value = 0, currency = 'USD') {
    await this.trackConversion('Lead', {
      value: value,
      currency: currency
    });
  }

  /**
   * Generate unique event ID for deduplication
   */
  generateEventId() {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Load user data from storage
   */
  loadUserData() {
    if (typeof window === 'undefined') return {};

    const data = {};

    // Try localStorage
    try {
      const stored = localStorage.getItem('fb_advanced_matching');
      if (stored) {
        Object.assign(data, JSON.parse(stored));
      }
    } catch (e) {
      console.error('[FB Advanced Matching] Error loading stored data:', e);
    }

    // Check for user in dataLayer
    if (window.dataLayer) {
      const dlUser = window.dataLayer.find(item => item.user)?.user || {};
      Object.assign(data, dlUser);
    }

    return data;
  }

  /**
   * Save user data to storage
   */
  saveUserData() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('fb_advanced_matching', JSON.stringify(this.userData));
    } catch (e) {
      console.error('[FB Advanced Matching] Error saving data:', e);
    }
  }

  /**
   * Set up event listeners for form submissions
   */
  setupEventListeners() {
    if (typeof document === 'undefined') return;

    // Listen for form submissions
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (form.tagName !== 'FORM') return;

      // Extract user data from form
      const formData = this.extractFormData(form);
      if (Object.keys(formData).length > 0) {
        await this.updateUserData(formData);
      }
    });

    // Listen for custom events
    document.addEventListener('user_data_update', async (e) => {
      if (e.detail) {
        await this.updateUserData(e.detail);
      }
    });
  }

  /**
   * Extract user data from form fields
   */
  extractFormData(form) {
    const data = {};

    // Email fields
    const emailField = form.querySelector('input[type="email"], input[name*="email"]');
    if (emailField && emailField.value) {
      data.email = emailField.value;
    }

    // Phone fields
    const phoneField = form.querySelector('input[type="tel"], input[name*="phone"]');
    if (phoneField && phoneField.value) {
      data.phone = phoneField.value;
    }

    // Name fields
    const firstNameField = form.querySelector('input[name*="first"], input[name="fname"]');
    if (firstNameField && firstNameField.value) {
      data.firstName = firstNameField.value;
    }

    const lastNameField = form.querySelector('input[name*="last"], input[name="lname"]');
    if (lastNameField && lastNameField.value) {
      data.lastName = lastNameField.value;
    }

    // Location fields
    const cityField = form.querySelector('input[name*="city"]');
    if (cityField && cityField.value) {
      data.city = cityField.value;
    }

    const stateField = form.querySelector('input[name*="state"], select[name*="state"]');
    if (stateField && stateField.value) {
      data.state = stateField.value;
    }

    const zipField = form.querySelector('input[name*="zip"], input[name*="postal"]');
    if (zipField && zipField.value) {
      data.zip = zipField.value;
    }

    return data;
  }

  /**
   * Clear all user data (for privacy/logout)
   */
  clearUserData() {
    this.userData = {};
    this.hashCache.clear();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fb_advanced_matching');
    }

    console.log('[FB Advanced Matching] User data cleared');
  }

  /**
   * Get match quality score estimate
   */
  getMatchQuality() {
    const fields = Object.keys(this.userData).filter(key => this.userData[key]);
    
    // Scoring based on Meta's field importance
    let score = 0;
    if (this.userData.email) score += 30;
    if (this.userData.phone) score += 25;
    if (this.userData.firstName && this.userData.lastName) score += 15;
    if (this.userData.dateOfBirth) score += 10;
    if (this.userData.city && this.userData.state) score += 10;
    if (this.userData.zip) score += 5;
    if (this.userData.externalId) score += 5;

    return {
      score: Math.min(100, score),
      fields: fields.length,
      quality: score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'
    };
  }
}

// Create singleton instance
const fbAdvancedMatching = new FacebookAdvancedMatching();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fbAdvancedMatching.initialize();
    });
  } else {
    fbAdvancedMatching.initialize();
  }
}

export default fbAdvancedMatching;