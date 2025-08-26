/**
 * Meta Event Match Quality (EMQ) Optimizer
 * Improves EMQ score from 6.5 to 8.0+ by sending comprehensive user data
 */

import CryptoJS from 'crypto-js';

class MetaEMQOptimizer {
  constructor() {
    this.userData = {};
    this.sessionData = {};
    this.isInitialized = false;
    this.debug = process.env.NODE_ENV === 'development';
    this.emqScore = 6.5; // Current baseline
    this.targetScore = 8.0;
    
    // Advanced Matching parameters for high EMQ
    this.advancedMatchingParams = {
      // Automatic parameters (collected automatically)
      automatic: ['fbp', 'fbc', 'client_ip_address', 'client_user_agent'],
      
      // Essential parameters (biggest EMQ impact)
      essential: ['em', 'ph'], // email, phone
      
      // Additional parameters (moderate EMQ impact)
      additional: ['fn', 'ln', 'ct', 'st', 'zp', 'country'],
      
      // Premium parameters (for 9.0+ EMQ)
      premium: ['ge', 'db', 'external_id']
    };
    
    // Initialize on load
    if (typeof window !== 'undefined') {
      this.init();
    }
  }
  
  /**
   * Initialize EMQ Optimizer
   */
  init() {
    if (this.isInitialized) return;
    
    // Collect automatic parameters
    this.collectAutomaticData();
    
    // Load stored user data
    this.loadStoredUserData();
    
    // Set up form listeners for data collection
    this.setupFormListeners();
    
    // Set up Facebook Login detection
    this.setupFacebookLoginDetection();
    
    // Initialize Advanced Matching
    this.initializeAdvancedMatching();
    
    this.isInitialized = true;
    
    if (this.debug) {
      console.log('Meta EMQ Optimizer initialized');
      this.calculateCurrentEMQ();
    }
  }
  
  /**
   * Initialize Facebook Advanced Matching
   */
  initializeAdvancedMatching() {
    if (typeof window === 'undefined' || !window.fbq) return;
    
    // Get current user data for Advanced Matching
    const matchData = this.getAdvancedMatchingData();
    
    // Re-initialize pixel with Advanced Matching
    if (Object.keys(matchData).length > 0) {
      // Initialize with manual Advanced Matching
      window.fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID, matchData);
      
      if (this.debug) {
        console.log('Advanced Matching initialized with:', Object.keys(matchData));
      }
    }
    
    // Enable Automatic Advanced Matching
    window.fbq('set', 'autoConfig', 'true', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
  }
  
  /**
   * Collect automatic data (fbp, fbc, IP, UA)
   */
  collectAutomaticData() {
    // Get Facebook browser ID (fbp)
    this.sessionData.fbp = this.getFBP();
    
    // Get Facebook click ID (fbc)
    this.sessionData.fbc = this.getFBC();
    
    // Get user agent
    this.sessionData.client_user_agent = navigator.userAgent;
    
    // IP will be collected server-side
    
    // Get browser language for better matching
    this.sessionData.browser_language = navigator.language || navigator.userLanguage;
    
    // Store in localStorage for persistence
    this.persistSessionData();
  }
  
  /**
   * Get or create Facebook browser ID (_fbp cookie)
   */
  getFBP() {
    let fbp = this.getCookie('_fbp');
    
    if (!fbp) {
      // Create fbp if it doesn't exist
      const version = 'fb';
      const subdomainIndex = '1';
      const creationTime = Date.now();
      const randomNumber = Math.random().toString(36).substring(2, 15);
      
      fbp = `${version}.${subdomainIndex}.${creationTime}.${randomNumber}`;
      this.setCookie('_fbp', fbp, 90); // 90 days
    }
    
    return fbp;
  }
  
  /**
   * Get Facebook click ID from URL or cookie
   */
  getFBC() {
    // Check URL for fbclid parameter
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (fbclid) {
      // Create fbc from fbclid
      const version = 'fb';
      const subdomainIndex = '1';
      const creationTime = Date.now();
      
      const fbc = `${version}.${subdomainIndex}.${creationTime}.${fbclid}`;
      this.setCookie('_fbc', fbc, 90);
      return fbc;
    }
    
    // Return existing fbc cookie
    return this.getCookie('_fbc');
  }
  
  /**
   * Set user data for EMQ improvement
   * @param {Object} data - User data object
   */
  setUserData(data) {
    // Process and hash each field appropriately
    if (data.email) {
      this.userData.em = this.hashEmail(data.email);
      this.userData.email_plain = data.email; // Store for server-side
    }
    
    if (data.phone) {
      this.userData.ph = this.hashPhone(data.phone);
      this.userData.phone_plain = data.phone; // Store for server-side
    }
    
    if (data.firstName || data.first_name) {
      this.userData.fn = this.hashValue(data.firstName || data.first_name);
    }
    
    if (data.lastName || data.last_name) {
      this.userData.ln = this.hashValue(data.lastName || data.last_name);
    }
    
    if (data.city) {
      this.userData.ct = this.hashValue(data.city);
    }
    
    if (data.state) {
      this.userData.st = this.hashValue(data.state);
    }
    
    if (data.zip || data.postalCode) {
      this.userData.zp = this.hashValue(data.zip || data.postalCode);
    }
    
    if (data.country) {
      this.userData.country = data.country.toLowerCase();
    }
    
    if (data.gender) {
      this.userData.ge = this.normalizeGender(data.gender);
    }
    
    if (data.birthDate || data.dateOfBirth) {
      this.userData.db = this.normalizeDateOfBirth(data.birthDate || data.dateOfBirth);
    }
    
    if (data.userId || data.external_id) {
      this.userData.external_id = this.hashValue(data.userId || data.external_id);
    }
    
    // Persist user data
    this.persistUserData();
    
    // Update Advanced Matching
    this.updateAdvancedMatching();
    
    // Calculate new EMQ score
    this.calculateCurrentEMQ();
  }
  
  /**
   * Hash email according to Meta requirements
   */
  hashEmail(email) {
    if (!email) return null;
    
    // Normalize: lowercase, trim, remove dots from gmail
    let normalized = email.toLowerCase().trim();
    
    // Remove dots from gmail addresses
    if (normalized.includes('@gmail.com')) {
      const [localPart, domain] = normalized.split('@');
      normalized = localPart.replace(/\./g, '') + '@' + domain;
    }
    
    // Hash with SHA-256
    return CryptoJS.SHA256(normalized).toString();
  }
  
  /**
   * Hash phone number according to Meta requirements
   */
  hashPhone(phone) {
    if (!phone) return null;
    
    // Remove all non-numeric characters
    let normalized = phone.replace(/\D/g, '');
    
    // Add country code if missing (assuming US)
    if (normalized.length === 10) {
      normalized = '1' + normalized;
    }
    
    // Hash with SHA-256
    return CryptoJS.SHA256(normalized).toString();
  }
  
  /**
   * Hash generic value
   */
  hashValue(value) {
    if (!value) return null;
    
    // Normalize: lowercase and trim
    const normalized = value.toLowerCase().trim();
    
    // Hash with SHA-256
    return CryptoJS.SHA256(normalized).toString();
  }
  
  /**
   * Normalize gender value
   */
  normalizeGender(gender) {
    if (!gender) return null;
    
    const normalized = gender.toLowerCase().trim();
    
    if (normalized.startsWith('m')) return CryptoJS.SHA256('m').toString();
    if (normalized.startsWith('f')) return CryptoJS.SHA256('f').toString();
    
    return null;
  }
  
  /**
   * Normalize date of birth (YYYYMMDD format)
   */
  normalizeDateOfBirth(date) {
    if (!date) return null;
    
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      const formatted = `${year}${month}${day}`;
      return CryptoJS.SHA256(formatted).toString();
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get Advanced Matching data for pixel events
   */
  getAdvancedMatchingData() {
    const matchData = {};
    
    // Add all available user data
    Object.keys(this.userData).forEach(key => {
      // Only include hashed values for Advanced Matching
      if (!key.includes('_plain') && this.userData[key]) {
        matchData[key] = this.userData[key];
      }
    });
    
    return matchData;
  }
  
  /**
   * Get all data for server-side CAPI
   */
  getServerData() {
    return {
      // User data (unhashed for server-side hashing)
      email: this.userData.email_plain,
      phone: this.userData.phone_plain,
      first_name: this.userData.fn ? undefined : this.userData.first_name_plain,
      last_name: this.userData.ln ? undefined : this.userData.last_name_plain,
      city: this.userData.ct ? undefined : this.userData.city_plain,
      state: this.userData.st ? undefined : this.userData.state_plain,
      zip: this.userData.zp ? undefined : this.userData.zip_plain,
      country: this.userData.country,
      gender: this.userData.ge ? undefined : this.userData.gender_plain,
      date_of_birth: this.userData.db ? undefined : this.userData.dob_plain,
      external_id: this.userData.external_id,
      
      // Session data
      fbp: this.sessionData.fbp,
      fbc: this.sessionData.fbc,
      client_user_agent: this.sessionData.client_user_agent,
      
      // Additional context
      browser_language: this.sessionData.browser_language,
      page_url: window.location.href,
      referrer_url: document.referrer
    };
  }
  
  /**
   * Update Advanced Matching with current data
   */
  updateAdvancedMatching() {
    if (typeof window === 'undefined' || !window.fbq) return;
    
    const matchData = this.getAdvancedMatchingData();
    
    if (Object.keys(matchData).length > 0) {
      // Update pixel with new Advanced Matching data
      window.fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID, matchData);
      
      if (this.debug) {
        console.log('Advanced Matching updated with', Object.keys(matchData).length, 'parameters');
      }
    }
  }
  
  /**
   * Set up form listeners to automatically collect data
   */
  setupFormListeners() {
    // Listen for form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName !== 'FORM') return;
      
      // Extract data from form
      const formData = new FormData(form);
      const data = {};
      
      // Map common field names
      const fieldMap = {
        'email': 'email',
        'e-mail': 'email',
        'phone': 'phone',
        'tel': 'phone',
        'telephone': 'phone',
        'mobile': 'phone',
        'first_name': 'firstName',
        'firstname': 'firstName',
        'fname': 'firstName',
        'last_name': 'lastName',
        'lastname': 'lastName',
        'lname': 'lastName',
        'city': 'city',
        'state': 'state',
        'province': 'state',
        'zip': 'zip',
        'postal': 'zip',
        'postalcode': 'zip',
        'zipcode': 'zip',
        'country': 'country',
        'gender': 'gender',
        'birthday': 'birthDate',
        'dob': 'birthDate',
        'birthdate': 'birthDate'
      };
      
      formData.forEach((value, key) => {
        const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
        if (fieldMap[normalizedKey]) {
          data[fieldMap[normalizedKey]] = value;
        }
      });
      
      // Set user data if we found any
      if (Object.keys(data).length > 0) {
        this.setUserData(data);
      }
    });
    
    // Also listen for input changes on key fields
    const emailFields = document.querySelectorAll('input[type="email"], input[name*="email"]');
    const phoneFields = document.querySelectorAll('input[type="tel"], input[name*="phone"], input[name*="mobile"]');
    
    emailFields.forEach(field => {
      field.addEventListener('blur', (e) => {
        if (e.target.value) {
          this.setUserData({ email: e.target.value });
        }
      });
    });
    
    phoneFields.forEach(field => {
      field.addEventListener('blur', (e) => {
        if (e.target.value) {
          this.setUserData({ phone: e.target.value });
        }
      });
    });
  }
  
  /**
   * Set up Facebook Login detection
   */
  setupFacebookLoginDetection() {
    if (typeof window === 'undefined' || !window.FB) return;
    
    // Listen for Facebook login status
    window.FB.Event.subscribe('auth.statusChange', (response) => {
      if (response.status === 'connected') {
        // User logged in with Facebook
        this.handleFacebookLogin(response.authResponse);
      }
    });
  }
  
  /**
   * Handle Facebook login for maximum EMQ
   */
  handleFacebookLogin(authResponse) {
    if (!authResponse) return;
    
    // Store Facebook user ID (this gives maximum EMQ boost)
    this.userData.fb_login_id = authResponse.userID;
    
    // Get additional user info if permitted
    if (window.FB) {
      window.FB.api('/me', { fields: 'email,first_name,last_name,gender,birthday' }, (response) => {
        if (response) {
          this.setUserData({
            email: response.email,
            firstName: response.first_name,
            lastName: response.last_name,
            gender: response.gender,
            birthDate: response.birthday
          });
        }
      });
    }
    
    if (this.debug) {
      console.log('Facebook Login detected - EMQ will improve significantly');
    }
  }
  
  /**
   * Calculate current EMQ score based on available data
   */
  calculateCurrentEMQ() {
    let score = 0;
    let maxScore = 10;
    
    // Scoring weights
    const weights = {
      // Automatic (3 points)
      fbp: 0.5,
      fbc: 0.5,
      client_ip_address: 1,
      client_user_agent: 1,
      
      // Essential (4 points)
      em: 2,
      ph: 2,
      
      // Additional (2 points)
      fn: 0.3,
      ln: 0.3,
      ct: 0.3,
      st: 0.3,
      zp: 0.4,
      country: 0.4,
      
      // Premium (1 point)
      ge: 0.3,
      db: 0.3,
      external_id: 0.4,
      
      // Facebook Login (bonus)
      fb_login_id: 1
    };
    
    // Calculate score
    Object.keys(weights).forEach(param => {
      if (this.userData[param] || this.sessionData[param]) {
        score += weights[param];
      }
    });
    
    // Round to 1 decimal place
    this.emqScore = Math.min(Math.round(score * 10) / 10, maxScore);
    
    if (this.debug) {
      console.log(`Current EMQ Score: ${this.emqScore}/10`);
      console.log('Available parameters:', {
        automatic: Object.keys(this.sessionData),
        user: Object.keys(this.userData).filter(k => !k.includes('_plain'))
      });
      
      // Suggest improvements
      if (this.emqScore < this.targetScore) {
        const missing = [];
        if (!this.userData.em) missing.push('email');
        if (!this.userData.ph) missing.push('phone');
        if (!this.userData.fn) missing.push('first name');
        if (!this.userData.ln) missing.push('last name');
        if (!this.userData.external_id) missing.push('user ID');
        
        if (missing.length > 0) {
          console.log('To improve EMQ, collect:', missing.join(', '));
        }
      }
    }
    
    return this.emqScore;
  }
  
  /**
   * Load stored user data from localStorage
   */
  loadStoredUserData() {
    try {
      const stored = localStorage.getItem('meta_user_data');
      if (stored) {
        this.userData = JSON.parse(stored);
      }
      
      const storedSession = localStorage.getItem('meta_session_data');
      if (storedSession) {
        this.sessionData = { ...this.sessionData, ...JSON.parse(storedSession) };
      }
    } catch (e) {
      // Ignore errors
    }
  }
  
  /**
   * Persist user data to localStorage
   */
  persistUserData() {
    try {
      localStorage.setItem('meta_user_data', JSON.stringify(this.userData));
    } catch (e) {
      // Ignore errors
    }
  }
  
  /**
   * Persist session data to localStorage
   */
  persistSessionData() {
    try {
      localStorage.setItem('meta_session_data', JSON.stringify(this.sessionData));
    } catch (e) {
      // Ignore errors
    }
  }
  
  /**
   * Get cookie value
   */
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  /**
   * Set cookie value
   */
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
  
  /**
   * Get EMQ improvement suggestions
   */
  getImprovementSuggestions() {
    const suggestions = [];
    
    if (!this.userData.em) {
      suggestions.push({
        parameter: 'Email',
        impact: 'High',
        implementation: 'Collect email at signup/checkout'
      });
    }
    
    if (!this.userData.ph) {
      suggestions.push({
        parameter: 'Phone',
        impact: 'High',
        implementation: 'Add phone field to forms'
      });
    }
    
    if (!this.userData.fn || !this.userData.ln) {
      suggestions.push({
        parameter: 'Name',
        impact: 'Medium',
        implementation: 'Collect first and last name'
      });
    }
    
    if (!this.userData.external_id) {
      suggestions.push({
        parameter: 'User ID',
        impact: 'Medium',
        implementation: 'Send user ID after login'
      });
    }
    
    if (!this.userData.fb_login_id) {
      suggestions.push({
        parameter: 'Facebook Login',
        impact: 'Very High',
        implementation: 'Add Facebook Login option'
      });
    }
    
    return suggestions;
  }
}

// Create singleton instance
const metaEMQOptimizer = new MetaEMQOptimizer();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => metaEMQOptimizer.init());
  } else {
    metaEMQOptimizer.init();
  }
}

export default metaEMQOptimizer;