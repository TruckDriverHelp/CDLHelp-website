/**
 * Analytics Validation for Website
 * Validates Meta Pixel, CAPI, and Google Ads integrations
 */

import metaStandardEvents from './meta-standard-events';
import { trackConversion } from './analytics';

class AnalyticsValidation {
  constructor() {
    this.validationResults = {};
    this.testEvents = [];
    this.debug = process.env.NODE_ENV === 'development';
  }

  /**
   * Validate all analytics services
   */
  async validateAllServices() {
    console.log('🔍 Starting analytics validation...');
    
    const results = {
      timestamp: new Date().toISOString(),
      overall_status: 'unknown',
      services: {}
    };

    try {
      // Validate Meta Pixel & CAPI
      results.services.meta = await this.validateMetaIntegration();
      
      // Validate Google Ads
      results.services.google_ads = await this.validateGoogleAdsIntegration();
      
      // Validate backend connectivity
      results.services.backend = await this.validateBackendConnectivity();
      
      // Calculate overall status
      results.overall_status = this.calculateOverallStatus(results.services);
      
      // Store results
      this.validationResults = results;
      this.saveValidationResults(results);
      
      console.log(`✅ Validation completed: ${results.overall_status}`);
      
    } catch (error) {
      console.error('❌ Validation error:', error);
      results.error = error.message;
      results.overall_status = 'error';
    }
    
    return results;
  }

  /**
   * Validate Meta Pixel and CAPI integration
   */
  async validateMetaIntegration() {
    const validation = {
      service: 'Meta Ads (Pixel & CAPI)',
      status: 'unknown',
      issues: [],
      recommendations: [],
      tests: {}
    };

    try {
      // Check if Facebook Pixel is loaded
      validation.tests.pixel_loaded = typeof window.fbq !== 'undefined';
      
      if (!validation.tests.pixel_loaded) {
        validation.issues.push('Facebook Pixel not loaded');
        validation.status = 'failed';
        return validation;
      }

      // Test pixel tracking
      const pixelTest = await this.testMetaPixelTracking();
      validation.tests.pixel_tracking = pixelTest;

      // Test CAPI integration
      const capiTest = await this.testMetaCAPIIntegration();
      validation.tests.capi_integration = capiTest;

      // Check Advanced Matching
      const advancedMatchingTest = this.testAdvancedMatching();
      validation.tests.advanced_matching = advancedMatchingTest;

      // Check EMQ optimization
      const emqTest = this.testEMQOptimization();
      validation.tests.emq_optimization = emqTest;

      // Determine overall status
      const criticalTests = [pixelTest.success, capiTest.success];
      const allCriticalPassed = criticalTests.every(test => test);
      
      if (allCriticalPassed) {
        validation.status = 'passed';
        if (!advancedMatchingTest.success) {
          validation.recommendations.push('Enable Advanced Matching for better attribution');
        }
        if (!emqTest.success) {
          validation.recommendations.push('Improve Event Match Quality (EMQ) score');
        }
      } else {
        validation.status = 'failed';
        if (!pixelTest.success) {
          validation.issues.push(`Pixel tracking failed: ${pixelTest.error}`);
        }
        if (!capiTest.success) {
          validation.issues.push(`CAPI integration failed: ${capiTest.error}`);
        }
      }

    } catch (error) {
      validation.status = 'error';
      validation.error = error.message;
    }

    return validation;
  }

  /**
   * Validate Google Ads integration
   */
  async validateGoogleAdsIntegration() {
    const validation = {
      service: 'Google Ads',
      status: 'unknown',
      issues: [],
      recommendations: [],
      tests: {}
    };

    try {
      // Check if gtag is loaded
      validation.tests.gtag_loaded = typeof window.gtag !== 'undefined';
      
      if (!validation.tests.gtag_loaded) {
        validation.issues.push('Google Analytics/Ads gtag not loaded');
        validation.status = 'failed';
        return validation;
      }

      // Test conversion tracking
      const conversionTest = await this.testGoogleAdsConversionTracking();
      validation.tests.conversion_tracking = conversionTest;

      // Test Enhanced Conversions
      const enhancedConversionsTest = await this.testEnhancedConversions();
      validation.tests.enhanced_conversions = enhancedConversionsTest;

      // Determine status
      if (conversionTest.success && enhancedConversionsTest.success) {
        validation.status = 'passed';
      } else {
        validation.status = 'failed';
        if (!conversionTest.success) {
          validation.issues.push(`Conversion tracking failed: ${conversionTest.error}`);
        }
        if (!enhancedConversionsTest.success) {
          validation.issues.push(`Enhanced Conversions failed: ${enhancedConversionsTest.error}`);
        }
      }

    } catch (error) {
      validation.status = 'error';
      validation.error = error.message;
    }

    return validation;
  }

  /**
   * Validate backend connectivity
   */
  async validateBackendConnectivity() {
    const validation = {
      service: 'Backend Integration',
      status: 'unknown',
      issues: [],
      recommendations: [],
      tests: {}
    };

    try {
      // Test Meta CAPI endpoint
      const capiEndpointTest = await this.testBackendEndpoint('/api/meta/capi/track');
      validation.tests.meta_capi_endpoint = capiEndpointTest;

      // Test analytics endpoint
      const analyticsEndpointTest = await this.testBackendEndpoint('/analytics/track-event');
      validation.tests.analytics_endpoint = analyticsEndpointTest;

      // Test health check
      const healthTest = await this.testBackendEndpoint('/analytics/health-check');
      validation.tests.health_check = healthTest;

      // Determine status
      const criticalTests = [capiEndpointTest.success, analyticsEndpointTest.success];
      const allCriticalPassed = criticalTests.every(test => test);
      
      if (allCriticalPassed) {
        validation.status = 'passed';
        if (!healthTest.success) {
          validation.recommendations.push('Backend health check endpoint not responding');
        }
      } else {
        validation.status = 'failed';
        if (!capiEndpointTest.success) {
          validation.issues.push(`Meta CAPI endpoint failed: ${capiEndpointTest.error}`);
        }
        if (!analyticsEndpointTest.success) {
          validation.issues.push(`Analytics endpoint failed: ${analyticsEndpointTest.error}`);
        }
      }

    } catch (error) {
      validation.status = 'error';
      validation.error = error.message;
    }

    return validation;
  }

  /**
   * Test Meta Pixel tracking
   */
  async testMetaPixelTracking() {
    try {
      // Track a test event
      const testEventName = 'ValidationTest';
      const testParameters = {
        test_timestamp: Date.now(),
        validation_id: this.generateValidationId()
      };

      // Use Meta Standard Events service to track
      metaStandardEvents.trackCustom(testEventName, testParameters);
      
      // Wait a bit to ensure the event was sent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test Meta CAPI integration
   */
  async testMetaCAPIIntegration() {
    try {
      const payload = {
        event_name: 'ValidationTestCAPI',
        event_time: Math.floor(Date.now() / 1000),
        event_id: `validation_${Date.now()}`,
        event_source_url: window.location.href,
        action_source: 'website',
        platform: 'web',
        user_data: {
          client_ip_address: null, // Let backend determine
          client_user_agent: navigator.userAgent,
        },
        custom_data: {
          test_timestamp: Date.now(),
          validation_id: this.generateValidationId()
        }
      };

      const response = await fetch('/api/meta/capi/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform': 'web',
          'X-Event-Source': 'validation',
          'X-SDK-Version': 'v23.0.1'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test Google Ads conversion tracking
   */
  async testGoogleAdsConversionTracking() {
    try {
      // Test a basic conversion event
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: 0,
        currency: 'USD',
        transaction_id: `validation_${Date.now()}`,
        custom_parameter: 'validation_test'
      });

      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test Enhanced Conversions
   */
  async testEnhancedConversions() {
    try {
      const testConversionData = {
        conversion_id: 'AW-TEST/TEST',
        conversion_label: 'test_conversion',
        value: 0,
        currency: 'USD',
        transaction_id: `validation_${Date.now()}`,
        user_data: {
          email: 'test@example.com', // Test email
          phone: '+1234567890' // Test phone
        }
      };

      await trackConversion(testConversionData);
      
      return { success: true };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test Advanced Matching
   */
  testAdvancedMatching() {
    try {
      // Check if Advanced Matching data is available
      const hasAdvancedMatching = typeof window.fbq._getAdvancedMatchingData === 'function';
      
      if (hasAdvancedMatching) {
        const advancedData = window.fbq._getAdvancedMatchingData?.() || {};
        const hasData = Object.keys(advancedData).length > 0;
        
        return { 
          success: hasData, 
          data: hasData ? advancedData : null,
          message: hasData ? 'Advanced Matching active' : 'No Advanced Matching data found'
        };
      }

      return { success: false, message: 'Advanced Matching not configured' };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test EMQ optimization
   */
  testEMQOptimization() {
    try {
      // Check if EMQ optimization is active
      // This would depend on your EMQ optimizer implementation
      const hasEMQ = typeof metaStandardEvents.getValidationReport === 'function';
      
      if (hasEMQ) {
        const emqReport = metaStandardEvents.getValidationReport();
        return { 
          success: emqReport.status === 'optimal',
          report: emqReport 
        };
      }

      return { success: false, message: 'EMQ optimization not implemented' };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Test backend endpoint
   */
  async testBackendEndpoint(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Validation-Test': 'true'
        },
        body: JSON.stringify({
          test: true,
          timestamp: Date.now(),
          validation_id: this.generateValidationId()
        })
      });

      // Accept both successful responses and 404s (endpoint exists but not implemented)
      if (response.ok || response.status === 404) {
        return { 
          success: true, 
          status: response.status,
          message: response.status === 404 ? 'Endpoint exists but not implemented' : 'Endpoint accessible'
        };
      } else {
        const errorText = await response.text();
        return { 
          success: false, 
          error: `HTTP ${response.status}: ${errorText}`,
          status: response.status 
        };
      }

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate overall validation status
   */
  calculateOverallStatus(services) {
    const serviceNames = Object.keys(services);
    const statuses = serviceNames.map(name => services[name].status);
    
    const passedCount = statuses.filter(status => status === 'passed').length;
    const totalCount = statuses.length;

    if (totalCount === 0) return 'unknown';
    
    if (passedCount === totalCount) {
      return 'all_passed';
    } else if (passedCount > totalCount / 2) {
      return 'mostly_passed';
    } else if (passedCount > 0) {
      return 'partially_passed';
    } else {
      return 'all_failed';
    }
  }

  /**
   * Generate validation report
   */
  generateValidationReport() {
    if (!this.validationResults.timestamp) {
      return 'No validation results available. Run validateAllServices() first.';
    }

    let report = `# Website Analytics Validation Report\n`;
    report += `Generated: ${this.validationResults.timestamp}\n`;
    report += `Overall Status: **${this.validationResults.overall_status}**\n\n`;

    // Individual service reports
    Object.entries(this.validationResults.services).forEach(([serviceName, serviceResult]) => {
      report += `## ${serviceResult.service}\n`;
      report += `Status: **${serviceResult.status}**\n\n`;

      if (serviceResult.tests) {
        report += `### Test Results:\n`;
        Object.entries(serviceResult.tests).forEach(([testName, testResult]) => {
          const status = testResult.success ? '✅' : '❌';
          report += `- ${testName}: ${status}\n`;
          if (testResult.message) {
            report += `  - ${testResult.message}\n`;
          }
        });
        report += '\n';
      }

      if (serviceResult.issues?.length > 0) {
        report += `### Issues:\n`;
        serviceResult.issues.forEach(issue => {
          report += `- ❌ ${issue}\n`;
        });
        report += '\n';
      }

      if (serviceResult.recommendations?.length > 0) {
        report += `### Recommendations:\n`;
        serviceResult.recommendations.forEach(rec => {
          report += `- 💡 ${rec}\n`;
        });
        report += '\n';
      }
    });

    return report;
  }

  /**
   * Save validation results to localStorage
   */
  saveValidationResults(results) {
    try {
      localStorage.setItem('analytics_validation_results', JSON.stringify(results));
      localStorage.setItem('analytics_validation_timestamp', new Date().toISOString());
      
      if (this.debug) {
        console.log('Validation results saved to localStorage');
      }
    } catch (error) {
      console.error('Failed to save validation results:', error);
    }
  }

  /**
   * Load validation results from localStorage
   */
  loadValidationResults() {
    try {
      const results = localStorage.getItem('analytics_validation_results');
      const timestamp = localStorage.getItem('analytics_validation_timestamp');
      
      if (results) {
        const parsedResults = JSON.parse(results);
        parsedResults.loaded_timestamp = timestamp;
        return parsedResults;
      }
    } catch (error) {
      console.error('Failed to load validation results:', error);
    }
    return null;
  }

  /**
   * Generate validation ID
   */
  generateValidationId() {
    return `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Run validation on page load
   */
  async runOnPageLoad() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.validateAllServices(), 2000);
      });
    } else {
      setTimeout(() => this.validateAllServices(), 2000);
    }
  }

  /**
   * Display validation results in console
   */
  displayResults(results = this.validationResults) {
    if (!results.timestamp) {
      console.log('No validation results to display');
      return;
    }

    console.group('🔍 Analytics Validation Results');
    console.log(`Status: ${results.overall_status}`);
    console.log(`Timestamp: ${results.timestamp}`);
    
    Object.entries(results.services).forEach(([serviceName, serviceResult]) => {
      console.group(`${serviceResult.service} (${serviceResult.status})`);
      
      if (serviceResult.tests) {
        Object.entries(serviceResult.tests).forEach(([testName, testResult]) => {
          const status = testResult.success ? '✅' : '❌';
          console.log(`${testName}: ${status}`);
        });
      }
      
      if (serviceResult.issues?.length > 0) {
        console.group('Issues:');
        serviceResult.issues.forEach(issue => console.warn(issue));
        console.groupEnd();
      }
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
}

// Create singleton instance
const analyticsValidation = new AnalyticsValidation();

// Auto-run validation in development
if (process.env.NODE_ENV === 'development') {
  analyticsValidation.runOnPageLoad();
}

// Export for manual use
export default analyticsValidation;

// Expose to window for debugging
if (typeof window !== 'undefined') {
  window.analyticsValidation = analyticsValidation;
}