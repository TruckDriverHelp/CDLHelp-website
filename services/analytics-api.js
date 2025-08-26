import apiClient from './api-client';
import { v4 as uuidv4 } from 'uuid';

class AnalyticsAPI {
  constructor() {
    this.eventQueue = [];
    this.batchTimer = null;
    this.userId = null;
    this.analyticsId = null;
    this.sessionId = uuidv4();
  }
  
  // Identify user for analytics
  async identify(userId, properties = {}) {
    try {
      this.userId = userId;
      this.analyticsId = properties.analytics_id;
      
      const response = await apiClient.post('/api/analytics/identify', {
        user_id: userId,
        analytics_id: this.analyticsId,
        properties: {
          ...properties,
          platform: 'web',
          browser: this.getBrowserInfo(),
          screen_resolution: typeof window !== 'undefined' ? 
            `${window.screen.width}x${window.screen.height}` : 'unknown',
        }
      });
      
      // Store analytics ID if returned
      if (response?.analytics_id) {
        this.analyticsId = response.analytics_id;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('analytics_id', this.analyticsId);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }
  
  // Track event with deduplication
  async track(eventName, eventParams = {}) {
    try {
      const event = {
        event_name: eventName,
        event_params: eventParams,
        event_time: Date.now(),
        event_id: uuidv4(), // For deduplication
        user_id: this.userId,
        analytics_id: this.analyticsId,
        session_id: this.sessionId,
        page_location: typeof window !== 'undefined' ? window.location.href : '',
        page_title: typeof document !== 'undefined' ? document.title : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      };
      
      // Add to queue for batching
      this.eventQueue.push(event);
      
      // Start batch timer if not running
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => this.flush(), 5000);
      }
      
      // Send immediately for critical events
      if (this.isCriticalEvent(eventName)) {
        return this.sendEvent(event);
      }
      
      // Flush if queue is large
      if (this.eventQueue.length >= 20) {
        return this.flush();
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }
  
  // Track conversion with enhanced data
  async trackConversion(conversionType, value, currency = 'USD', customData = {}) {
    try {
      const conversionData = {
        conversion_type: conversionType,
        value: value,
        currency: currency,
        event_time: Math.floor(Date.now() / 1000),
        event_id: uuidv4(),
        user_data: {
          external_id: this.userId,
          analytics_id: this.analyticsId,
          client_ip_address: 'server-side', // Will be filled by backend
          client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
        custom_data: {
          ...customData,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          session_id: this.sessionId,
        },
        action_source: 'website',
      };
      
      return apiClient.post('/api/analytics/conversion', conversionData);
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }
  
  // Track revenue
  async trackRevenue(amount, currency, productId, orderId) {
    try {
      return apiClient.post('/api/analytics/revenue', {
        amount,
        currency,
        product_id: productId,
        order_id: orderId || uuidv4(),
        user_id: this.userId,
        analytics_id: this.analyticsId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track revenue:', error);
    }
  }
  
  // Track funnel event
  async trackFunnelEvent(funnelName, stepName, stepNumber, properties = {}) {
    try {
      return apiClient.post('/api/analytics/funnel/track', {
        funnel_name: funnelName,
        step_name: stepName,
        step_number: stepNumber,
        properties,
        user_id: this.userId,
        analytics_id: this.analyticsId,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track funnel event:', error);
    }
  }
  
  // Track paywall event
  async trackPaywallEvent(eventType, paywallId, productId, properties = {}) {
    try {
      return apiClient.post('/api/analytics/paywall/event', {
        event_type: eventType,
        paywall_id: paywallId,
        product_id: productId,
        properties,
        user_id: this.userId,
        analytics_id: this.analyticsId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track paywall event:', error);
    }
  }
  
  // Get predictive score
  async getPredictiveScore() {
    try {
      return apiClient.post('/api/analytics/predictive/score', {
        user_id: this.userId,
        analytics_id: this.analyticsId,
      });
    } catch (error) {
      console.error('Failed to get predictive score:', error);
      return null;
    }
  }
  
  // Send batch of events
  async flush() {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      await apiClient.post('/api/analytics/batch', {
        events: events,
        batch_id: uuidv4(),
      });
      
      console.log(`Flushed ${events.length} analytics events`);
    } catch (error) {
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
      console.error('Failed to flush analytics events:', error);
    }
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
  
  // Helper methods
  isCriticalEvent(eventName) {
    return [
      'purchase',
      'signup',
      'subscription_start',
      'trial_start',
      'payment_failed',
    ].includes(eventName.toLowerCase());
  }
  
  getBrowserInfo() {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }
  
  // Send event immediately
  async sendEvent(event) {
    try {
      return apiClient.post('/api/analytics/track', event);
    } catch (error) {
      console.error('Failed to send event:', error);
      // Add to queue for retry
      this.eventQueue.push(event);
    }
  }
  
  // Initialize from stored data
  async initialize() {
    if (typeof localStorage !== 'undefined') {
      this.userId = localStorage.getItem('user_id');
      this.analyticsId = localStorage.getItem('analytics_id');
    }
    
    // Track page view on initialization
    await this.track('page_view', {
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      page_title: typeof document !== 'undefined' ? document.title : '',
    });
  }
}

// Export singleton instance
const analyticsAPI = new AnalyticsAPI();
export default analyticsAPI;