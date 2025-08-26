/**
 * Meta Aggregated Event Measurement (AEM) Configuration
 * Handles iOS 14.5+ tracking with privacy-preserving measurement
 */

class MetaAEMConfig {
  constructor() {
    this.debug = process.env.NODE_ENV === 'development';
    this.pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    this.isIOSSafari = this.detectIOSSafari();
    
    // AEM is now automatic in 2024-2025
    this.aemAutomatic = true;
    this.eventLimit = null; // No more 8-event limit
    
    // Domain verification status
    this.domainVerified = false;
    
    // iOS App configuration
    this.iosAppConfig = {
      appId: process.env.NEXT_PUBLIC_IOS_APP_ID,
      appStoreId: process.env.NEXT_PUBLIC_APP_STORE_ID,
      bundleId: 'com.cdlhelp.app'
    };
  }
  
  /**
   * Initialize AEM configuration
   */
  init() {
    if (!this.isIOSSafari) {
      if (this.debug) {
        console.log('AEM not needed - not iOS Safari');
      }
      return;
    }
    
    // AEM is now automatic, but we can still optimize configuration
    this.configureAEM();
    
    // Set up PCM (Private Click Measurement) for iOS 14.5+
    this.configurePCM();
    
    // Verify domain if needed
    this.checkDomainVerification();
    
    if (this.debug) {
      console.log('Meta AEM initialized (automatic mode)');
    }
  }
  
  /**
   * Configure AEM settings
   */
  configureAEM() {
    if (typeof window === 'undefined' || !window.fbq) return;
    
    // Enable AEM for iOS
    window.fbq('set', 'mobileBridge', {
      enabled: true,
      appId: this.iosAppConfig.appId
    });
    
    // Set data processing options for iOS
    if (this.isIOSSafari) {
      // Limited data use for iOS users
      window.fbq('dataProcessingOptions', ['LDU'], 0, 0);
    }
    
    // Configure conversion value mapping (for SKAdNetwork)
    this.configureConversionValues();
  }
  
  /**
   * Configure Private Click Measurement for iOS
   */
  configurePCM() {
    if (!this.isIOSSafari) return;
    
    // Add PCM support to all outbound links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !link.href) return;
      
      // Check if it's an app store link
      if (link.href.includes('apps.apple.com') || link.href.includes('itunes.apple.com')) {
        // Add PCM attributes
        link.setAttribute('attributionsourceid', this.pixelId);
        link.setAttribute('attributiondestination', 'https://cdlhelp.com');
        
        // Add attribution reporting
        if ('attributionReporting' in link) {
          link.attributionReporting = {
            sourceEventId: this.generateEventId(),
            sourcePriority: '1',
            sourceExpiry: 86400 * 30 // 30 days
          };
        }
      }
    });
  }
  
  /**
   * Configure conversion value mapping for SKAdNetwork
   */
  configureConversionValues() {
    // Define conversion value schema for your app
    // This maps conversion values (0-63) to user actions
    const conversionSchema = {
      // Value 0: Install only
      0: { event: 'Install', revenue: 0 },
      
      // Values 1-10: Onboarding events
      1: { event: 'Tutorial_Start', revenue: 0 },
      2: { event: 'Tutorial_Complete', revenue: 0 },
      3: { event: 'First_Quiz_Start', revenue: 0 },
      4: { event: 'First_Quiz_Complete', revenue: 0 },
      5: { event: 'Registration', revenue: 0 },
      
      // Values 11-30: Engagement events
      11: { event: 'Quiz_Passed', revenue: 0 },
      12: { event: 'Study_Session_Complete', revenue: 0 },
      13: { event: 'Practice_Test_Complete', revenue: 0 },
      15: { event: 'High_Engagement_User', revenue: 0 },
      
      // Values 31-50: Trial events
      31: { event: 'Trial_Started', revenue: 0 },
      32: { event: 'Trial_Day_3_Retained', revenue: 0 },
      33: { event: 'Trial_Day_7_Retained', revenue: 0 },
      
      // Values 51-63: Revenue events
      51: { event: 'Purchase_Under_10', revenue: 5 },
      52: { event: 'Purchase_10_to_50', revenue: 25 },
      53: { event: 'Purchase_50_to_100', revenue: 75 },
      54: { event: 'Purchase_Over_100', revenue: 150 },
      55: { event: 'Subscription_Monthly', revenue: 15 },
      56: { event: 'Subscription_Annual', revenue: 100 },
      60: { event: 'High_Value_Customer', revenue: 200 },
      63: { event: 'Max_Value_Customer', revenue: 500 }
    };
    
    // Store schema for reference
    this.conversionSchema = conversionSchema;
    
    // Send schema to Meta if possible
    if (window.fbq) {
      window.fbq('set', 'conversionValueSchema', conversionSchema);
    }
  }
  
  /**
   * Check domain verification status
   */
  async checkDomainVerification() {
    // Domain verification is optional for AEM but required for some features
    try {
      // Check for Meta domain verification meta tag
      const verificationTag = document.querySelector('meta[name="facebook-domain-verification"]');
      if (verificationTag) {
        this.domainVerified = true;
        if (this.debug) {
          console.log('Domain verified for Meta');
        }
      } else {
        if (this.debug) {
          console.log('Domain not verified - some features may be limited');
        }
      }
    } catch (e) {
      // Ignore errors
    }
  }
  
  /**
   * Detect if running on iOS Safari
   */
  detectIOSSafari() {
    if (typeof window === 'undefined') return false;
    
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
    
    return isIOS && isSafari;
  }
  
  /**
   * Generate unique event ID
   */
  generateEventId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Track AEM-compatible event
   * In 2024-2025, all events are automatically processed for AEM
   */
  trackEvent(eventName, parameters = {}) {
    if (!this.isIOSSafari) {
      // For non-iOS, track normally
      if (window.fbq) {
        window.fbq('track', eventName, parameters);
      }
      return;
    }
    
    // For iOS Safari, ensure AEM-compatible tracking
    if (window.fbq) {
      // Add AEM-specific parameters
      const aemParams = {
        ...parameters,
        _aem: true,
        _source: 'web',
        _platform: 'ios_safari'
      };
      
      // Track event
      window.fbq('track', eventName, aemParams);
      
      // Also track conversion value if applicable
      this.updateConversionValue(eventName, parameters);
    }
  }
  
  /**
   * Update conversion value based on event
   */
  updateConversionValue(eventName, parameters) {
    if (!this.conversionSchema) return;
    
    // Find matching conversion value
    let conversionValue = 0;
    let matchedSchema = null;
    
    // Check revenue-based events
    if (eventName === 'Purchase' && parameters.value) {
      const value = parameters.value;
      if (value < 10) conversionValue = 51;
      else if (value < 50) conversionValue = 52;
      else if (value < 100) conversionValue = 53;
      else conversionValue = 54;
    }
    // Check subscription events
    else if (eventName === 'Subscribe') {
      const type = parameters.content_name || '';
      if (type.includes('monthly')) conversionValue = 55;
      else if (type.includes('annual')) conversionValue = 56;
    }
    // Check engagement events
    else {
      // Find matching event in schema
      for (const [value, schema] of Object.entries(this.conversionSchema)) {
        if (schema.event === eventName) {
          conversionValue = parseInt(value);
          matchedSchema = schema;
          break;
        }
      }
    }
    
    // Update conversion value if found
    if (conversionValue > 0) {
      if (window.fbq) {
        window.fbq('set', 'conversionValue', conversionValue);
      }
      
      if (this.debug) {
        console.log(`AEM Conversion Value updated: ${conversionValue} for ${eventName}`);
      }
    }
  }
  
  /**
   * Get AEM status report
   */
  getStatus() {
    return {
      enabled: this.isIOSSafari,
      automatic: this.aemAutomatic,
      domainVerified: this.domainVerified,
      platform: this.isIOSSafari ? 'ios_safari' : 'other',
      conversionSchemaConfigured: !!this.conversionSchema,
      recommendations: this.getRecommendations()
    };
  }
  
  /**
   * Get recommendations for improving AEM
   */
  getRecommendations() {
    const recommendations = [];
    
    if (!this.domainVerified) {
      recommendations.push({
        issue: 'Domain not verified',
        impact: 'Some iOS optimization features unavailable',
        solution: 'Add facebook-domain-verification meta tag'
      });
    }
    
    if (!this.iosAppConfig.appId) {
      recommendations.push({
        issue: 'iOS App ID not configured',
        impact: 'Cannot track app conversions',
        solution: 'Set NEXT_PUBLIC_IOS_APP_ID environment variable'
      });
    }
    
    if (!window.fbq && this.isIOSSafari) {
      recommendations.push({
        issue: 'Facebook Pixel not loaded',
        impact: 'No tracking on iOS',
        solution: 'Ensure Facebook Pixel is installed'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Test AEM configuration
   */
  testConfiguration() {
    console.log('=== Meta AEM Configuration Test ===');
    console.log('Platform:', this.isIOSSafari ? 'iOS Safari' : 'Other');
    console.log('AEM Mode:', this.aemAutomatic ? 'Automatic (2024+)' : 'Manual');
    console.log('Domain Verified:', this.domainVerified);
    console.log('iOS App ID:', this.iosAppConfig.appId || 'Not configured');
    console.log('Conversion Schema:', this.conversionSchema ? 'Configured' : 'Not configured');
    
    // Test event tracking
    if (window.fbq) {
      console.log('Testing AEM event...');
      this.trackEvent('Test_AEM_Event', { test: true });
      console.log('Test event sent');
    } else {
      console.log('Facebook Pixel not available for testing');
    }
    
    // Show recommendations
    const recommendations = this.getRecommendations();
    if (recommendations.length > 0) {
      console.log('\nRecommendations:');
      recommendations.forEach(rec => {
        console.log(`- ${rec.issue}: ${rec.solution}`);
      });
    } else {
      console.log('\nNo issues found - AEM properly configured');
    }
    
    console.log('=== End AEM Test ===');
  }
}

// Create singleton instance
const metaAEMConfig = new MetaAEMConfig();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => metaAEMConfig.init());
  } else {
    metaAEMConfig.init();
  }
}

export default metaAEMConfig;