/**
 * Server-Side Tagging Configuration
 * Implements Google Tag Manager Server Container for resilient tracking
 */

class ServerSideTagging {
  constructor() {
    this.serverEndpoint = process.env.NEXT_PUBLIC_GTM_SERVER_URL || null;
    this.serverContainerId = process.env.NEXT_PUBLIC_GTM_SERVER_CONTAINER_ID || null;
    this.clientId = this.getOrCreateClientId();
    this.sessionId = this.getOrCreateSessionId();
    this.enabled = false;
    this.debug = process.env.NODE_ENV === 'development';
    this.transportMethod = 'beacon'; // 'beacon', 'fetch', or 'image'
    this.queue = [];
    this.isOnline = navigator.onLine;
    
    // Set up online/offline handlers
    this.setupConnectivityHandlers();
  }
  
  /**
   * Initialize server-side tagging
   */
  init() {
    // Check if server-side tagging is configured
    if (!this.serverEndpoint) {
      console.warn('Server-side tagging not configured. Set NEXT_PUBLIC_GTM_SERVER_URL');
      return false;
    }
    
    this.enabled = true;
    
    // Process any queued events
    this.processQueue();
    
    if (this.debug) {
      console.log('Server-side tagging initialized:', {
        endpoint: this.serverEndpoint,
        containerId: this.serverContainerId,
        clientId: this.clientId,
        sessionId: this.sessionId
      });
    }
    
    return true;
  }
  
  /**
   * Send event to server-side GTM container
   * @param {string} eventName - Name of the event
   * @param {Object} parameters - Event parameters
   */
  sendEvent(eventName, parameters = {}) {
    if (!this.enabled) {
      if (this.debug) {
        console.warn('Server-side tagging not enabled');
      }
      return;
    }
    
    // Build event payload
    const payload = this.buildPayload(eventName, parameters);
    
    // If offline, queue the event
    if (!this.isOnline) {
      this.queueEvent(payload);
      return;
    }
    
    // Send based on transport method
    switch (this.transportMethod) {
      case 'beacon':
        this.sendViaBeacon(payload);
        break;
      case 'fetch':
        this.sendViaFetch(payload);
        break;
      case 'image':
        this.sendViaImage(payload);
        break;
      default:
        this.sendViaBeacon(payload);
    }
  }
  
  /**
   * Build event payload for server-side processing
   * @param {string} eventName - Event name
   * @param {Object} parameters - Event parameters
   * @returns {Object} Formatted payload
   */
  buildPayload(eventName, parameters) {
    // Get page data
    const pageData = this.getPageData();
    
    // Get user data (hashed for privacy)
    const userData = this.getUserData();
    
    // Get device data
    const deviceData = this.getDeviceData();
    
    // Build complete payload
    const payload = {
      // Event data
      event: eventName,
      event_timestamp: Date.now(),
      event_id: this.generateEventId(),
      
      // Session data
      client_id: this.clientId,
      session_id: this.sessionId,
      
      // Page data
      page_location: pageData.url,
      page_title: pageData.title,
      page_referrer: pageData.referrer,
      
      // User data (hashed)
      user_data: userData,
      
      // Device data
      device: deviceData,
      
      // Custom parameters
      custom_data: parameters,
      
      // Consent state
      consent_state: this.getConsentState(),
      
      // Debug flag
      debug_mode: this.debug
    };
    
    // Add GCLID if available
    const gclid = this.getGclid();
    if (gclid) {
      payload.gclid = gclid;
    }
    
    // Add Facebook click ID if available
    const fbclid = this.getFbclid();
    if (fbclid) {
      payload.fbclid = fbclid;
    }
    
    return payload;
  }
  
  /**
   * Send via Beacon API (most reliable)
   * @param {Object} payload - Event payload
   */
  sendViaBeacon(payload) {
    if (!navigator.sendBeacon) {
      // Fallback to fetch if beacon not available
      this.sendViaFetch(payload);
      return;
    }
    
    const url = this.buildServerUrl();
    const data = JSON.stringify(payload);
    
    try {
      const sent = navigator.sendBeacon(url, data);
      
      if (sent) {
        if (this.debug) {
          console.log('Event sent via beacon:', payload.event);
        }
      } else {
        // Beacon failed, try fetch
        this.sendViaFetch(payload);
      }
    } catch (error) {
      console.error('Beacon send failed:', error);
      this.queueEvent(payload);
    }
  }
  
  /**
   * Send via Fetch API
   * @param {Object} payload - Event payload
   */
  async sendViaFetch(payload) {
    const url = this.buildServerUrl();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true // Important for page unload events
      });
      
      if (response.ok) {
        if (this.debug) {
          console.log('Event sent via fetch:', payload.event);
        }
      } else {
        console.error('Server returned error:', response.status);
        this.queueEvent(payload);
      }
    } catch (error) {
      console.error('Fetch send failed:', error);
      this.queueEvent(payload);
    }
  }
  
  /**
   * Send via Image pixel (fallback)
   * @param {Object} payload - Event payload
   */
  sendViaImage(payload) {
    const url = this.buildServerUrl();
    const params = new URLSearchParams({
      data: btoa(JSON.stringify(payload)) // Base64 encode for URL safety
    });
    
    const img = new Image();
    img.src = `${url}?${params.toString()}`;
    
    img.onload = () => {
      if (this.debug) {
        console.log('Event sent via image:', payload.event);
      }
    };
    
    img.onerror = () => {
      console.error('Image send failed');
      this.queueEvent(payload);
    };
  }
  
  /**
   * Build server URL
   * @returns {string} Server endpoint URL
   */
  buildServerUrl() {
    let url = this.serverEndpoint;
    
    // Ensure HTTPS
    if (!url.startsWith('https://')) {
      url = url.replace('http://', 'https://');
    }
    
    // Add container ID if specified
    if (this.serverContainerId) {
      url += `?container_id=${this.serverContainerId}`;
    }
    
    return url;
  }
  
  /**
   * Get or create client ID
   * @returns {string} Client ID
   */
  getOrCreateClientId() {
    const key = '_ga_client_id';
    let clientId = localStorage.getItem(key);
    
    if (!clientId) {
      // Try to get from GA cookie
      const gaCookie = document.cookie.match(/_ga=(.+?);/);
      if (gaCookie) {
        clientId = gaCookie[1].split('.').slice(-2).join('.');
      } else {
        // Generate new client ID
        clientId = `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
      }
      localStorage.setItem(key, clientId);
    }
    
    return clientId;
  }
  
  /**
   * Get or create session ID
   * @returns {string} Session ID
   */
  getOrCreateSessionId() {
    const key = '_ga_session_id';
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    let session = JSON.parse(sessionStorage.getItem(key) || '{}');
    const now = Date.now();
    
    if (!session.id || (now - session.lastActivity) > sessionTimeout) {
      // New session
      session = {
        id: `${now}.${Math.random().toString(36).substring(2, 15)}`,
        startTime: now,
        lastActivity: now
      };
    } else {
      // Update last activity
      session.lastActivity = now;
    }
    
    sessionStorage.setItem(key, JSON.stringify(session));
    return session.id;
  }
  
  /**
   * Generate unique event ID
   * @returns {string} Event ID
   */
  generateEventId() {
    return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Get page data
   * @returns {Object} Page information
   */
  getPageData() {
    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash
    };
  }
  
  /**
   * Get user data (hashed for privacy)
   * @returns {Object} User data
   */
  getUserData() {
    const userData = {};
    
    // Get from localStorage if available
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Hash PII data
        if (parsed.email) {
          userData.hashed_email = this.hashValue(parsed.email);
        }
        if (parsed.phone) {
          userData.hashed_phone = this.hashValue(parsed.phone);
        }
      } catch (e) {
        // Invalid JSON
      }
    }
    
    return userData;
  }
  
  /**
   * Get device data
   * @returns {Object} Device information
   */
  getDeviceData() {
    return {
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
  
  /**
   * Get consent state
   * @returns {Object} Consent state
   */
  getConsentState() {
    // Try to get from consent manager
    if (typeof window !== 'undefined' && window.consentManager) {
      return window.consentManager.consentTypes;
    }
    
    // Default to denied
    return {
      analytics: false,
      marketing: false,
      preferences: false
    };
  }
  
  /**
   * Get GCLID from URL or storage
   * @returns {string|null} GCLID
   */
  getGclid() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get('gclid');
    
    if (gclid) {
      // Store for later use
      sessionStorage.setItem('_gclid', gclid);
      return gclid;
    }
    
    // Check storage
    return sessionStorage.getItem('_gclid');
  }
  
  /**
   * Get Facebook Click ID
   * @returns {string|null} FBCLID
   */
  getFbclid() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (fbclid) {
      // Store for later use
      sessionStorage.setItem('_fbclid', fbclid);
      return fbclid;
    }
    
    // Check storage
    return sessionStorage.getItem('_fbclid');
  }
  
  /**
   * Hash value using SHA-256
   * @param {string} value - Value to hash
   * @returns {string} Hashed value
   */
  hashValue(value) {
    if (!value) return null;
    
    // Normalize
    const normalized = value.toLowerCase().trim();
    
    // Simple hash function (should use CryptoJS in production)
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16);
  }
  
  /**
   * Queue event for later sending
   * @param {Object} payload - Event payload
   */
  queueEvent(payload) {
    this.queue.push(payload);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('_gtm_queue') || '[]';
    const queue = JSON.parse(stored);
    queue.push(payload);
    
    // Keep only last 100 events
    if (queue.length > 100) {
      queue.shift();
    }
    
    localStorage.setItem('_gtm_queue', JSON.stringify(queue));
    
    if (this.debug) {
      console.log('Event queued for later:', payload.event);
    }
  }
  
  /**
   * Process queued events
   */
  processQueue() {
    if (!this.isOnline || !this.enabled) return;
    
    // Get queued events from localStorage
    const stored = localStorage.getItem('_gtm_queue');
    if (!stored) return;
    
    try {
      const queue = JSON.parse(stored);
      
      if (queue.length > 0) {
        if (this.debug) {
          console.log(`Processing ${queue.length} queued events`);
        }
        
        // Send each event
        queue.forEach(payload => {
          // Update timestamp
          payload.event_timestamp = Date.now();
          payload.queued = true;
          
          // Send event
          this.sendViaBeacon(payload);
        });
        
        // Clear queue
        localStorage.removeItem('_gtm_queue');
      }
    } catch (error) {
      console.error('Failed to process queue:', error);
    }
  }
  
  /**
   * Set up connectivity handlers
   */
  setupConnectivityHandlers() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  /**
   * Track page view
   * @param {string} url - Page URL
   * @param {string} title - Page title
   */
  trackPageView(url, title) {
    this.sendEvent('page_view', {
      page_location: url,
      page_title: title
    });
  }
  
  /**
   * Track conversion
   * @param {string} conversionType - Type of conversion
   * @param {Object} conversionData - Conversion details
   */
  trackConversion(conversionType, conversionData) {
    this.sendEvent('conversion', {
      conversion_type: conversionType,
      ...conversionData
    });
  }
  
  /**
   * Track enhanced ecommerce event
   * @param {string} action - Ecommerce action
   * @param {Object} data - Ecommerce data
   */
  trackEcommerce(action, data) {
    this.sendEvent(`ecommerce_${action}`, data);
  }
  
  /**
   * Get debug information
   * @returns {Object} Debug info
   */
  getDebugInfo() {
    return {
      enabled: this.enabled,
      endpoint: this.serverEndpoint,
      clientId: this.clientId,
      sessionId: this.sessionId,
      queueLength: this.queue.length,
      isOnline: this.isOnline,
      transportMethod: this.transportMethod
    };
  }
}

// Create singleton instance
const serverSideTagging = new ServerSideTagging();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => serverSideTagging.init());
  } else {
    serverSideTagging.init();
  }
}

export default serverSideTagging;