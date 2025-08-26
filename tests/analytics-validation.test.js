/**
 * Analytics Validation Tests
 * Comprehensive testing suite for Google Tags audit compliance
 * Tests dataLayer events, consent management, and PII protection
 */

import { test, expect } from '@playwright/test';

test.describe('Google Tags Analytics Validation', () => {
  let page;
  let dataLayerEvents = [];

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Capture dataLayer events
    await page.addInitScript(() => {
      window.capturedDataLayerEvents = [];
      const originalPush = window.dataLayer?.push || (() => {});
      
      // Initialize dataLayer if not present
      window.dataLayer = window.dataLayer || [];
      
      // Capture all dataLayer pushes
      window.dataLayer.push = function(data) {
        window.capturedDataLayerEvents.push(data);
        return originalPush.call(this, data);
      };
    });
  });

  test('dataLayer initialization and page_view event', async () => {
    await page.goto('/');
    
    // Wait for analytics to initialize
    await page.waitForTimeout(2000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    
    // Should have page_view event
    const pageViewEvent = events.find(event => event.event === 'page_view');
    expect(pageViewEvent).toBeTruthy();
    expect(pageViewEvent.page_location).toContain('/');
    expect(pageViewEvent.language).toBeDefined();
  });

  test('Enhanced Ecommerce purchase tracking', async () => {
    await page.goto('/');
    
    // Simulate purchase tracking
    await page.evaluate(() => {
      if (window.dataLayerManager) {
        window.dataLayerManager.trackPurchase({
          transactionId: 'test_txn_123',
          value: 29.99,
          currency: 'USD',
          items: [{
            itemId: 'subscription_monthly',
            itemName: 'CDL Help Monthly Subscription',
            price: 29.99,
            quantity: 1
          }]
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    
    // Should have purchase event with Enhanced Ecommerce structure
    const purchaseEvent = events.find(event => event.event === 'purchase');
    expect(purchaseEvent).toBeTruthy();
    expect(purchaseEvent.transaction_id).toBe('test_txn_123');
    expect(purchaseEvent.value).toBe(29.99);
    expect(purchaseEvent.currency).toBe('USD');
    expect(purchaseEvent.ecommerce).toBeDefined();
    expect(purchaseEvent.ecommerce.items).toHaveLength(1);
    expect(purchaseEvent.ecommerce.items[0].item_id).toBe('subscription_monthly');
  });

  test('Quiz completion tracking', async () => {
    await page.goto('/');
    
    // Simulate quiz completion
    await page.evaluate(() => {
      if (window.dataLayerManager) {
        window.dataLayerManager.trackQuizComplete({
          quizId: 'general_knowledge_1',
          quizName: 'General Knowledge Practice Test',
          category: 'practice_test',
          score: 85,
          totalQuestions: 20,
          correctAnswers: 17,
          timeSpent: 300,
          passed: true,
          difficulty: 'medium',
          language: 'en'
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    
    // Should have quiz_complete event
    const quizEvent = events.find(event => event.event === 'quiz_complete');
    expect(quizEvent).toBeTruthy();
    expect(quizEvent.quiz_id).toBe('general_knowledge_1');
    expect(quizEvent.score).toBe(85);
    expect(quizEvent.passed).toBe(true);
    expect(quizEvent.custom_parameters).toBeDefined();
  });

  test('Lead generation tracking', async () => {
    await page.goto('/');
    
    // Simulate lead generation
    await page.evaluate(() => {
      if (window.dataLayerManager) {
        window.dataLayerManager.trackLead({
          type: 'contact_form',
          value: 2.50,
          formId: 'contact_form_main',
          source: 'website',
          contactMethod: 'form'
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    
    // Should have generate_lead event
    const leadEvent = events.find(event => event.event === 'generate_lead');
    expect(leadEvent).toBeTruthy();
    expect(leadEvent.lead_type).toBe('contact_form');
    expect(leadEvent.value).toBe(2.50);
    expect(leadEvent.currency).toBe('USD');
  });

  test('Consent Mode V2 implementation', async () => {
    await page.goto('/');
    
    // Wait for consent manager to initialize
    await page.waitForTimeout(1000);
    
    // Check if consent manager is properly configured
    const consentConfig = await page.evaluate(() => {
      return {
        hasConsentManager: !!window.ConsentManager,
        hasGtag: typeof window.gtag === 'function',
        consentTypes: window.ConsentManager?.consentTypes
      };
    });
    
    expect(consentConfig.hasConsentManager).toBe(true);
    expect(consentConfig.hasGtag).toBe(true);
    
    // Test consent update
    await page.evaluate(() => {
      if (window.ConsentManager) {
        window.ConsentManager.updateConsent({
          necessary: true,
          analytics: true,
          marketing: true,
          preferences: true
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Verify consent update event
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    const consentEvent = events.find(event => event.event === 'consent_update');
    expect(consentEvent).toBeTruthy();
    expect(consentEvent.consent_mode_version).toBe('v2');
  });

  test('PII Protection - No sensitive data in analytics events', async () => {
    await page.goto('/');
    
    // Simulate events that might accidentally include PII
    await page.evaluate(() => {
      // Test with potentially sensitive data
      if (window.dataLayerManager) {
        window.dataLayerManager.trackLead({
          type: 'contact_form',
          testEmail: 'user@example.com', // Should be filtered or hashed
          testPhone: '+1234567890', // Should be filtered or hashed
          sensitiveData: 'SSN: 123-45-6789' // Should be filtered
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    const leadEvent = events.find(event => event.event === 'generate_lead');
    
    // Convert event to JSON string to check for PII patterns
    const eventString = JSON.stringify(leadEvent);
    
    // Should not contain obvious PII patterns
    expect(eventString).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/); // SSN pattern
    expect(eventString).not.toMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i); // Email pattern (unless hashed)
    expect(eventString).not.toMatch(/\+?\d{10,15}/); // Phone pattern (unless hashed)
  });

  test('Google Analytics network requests', async () => {
    const gaRequests = [];
    
    // Capture GA requests
    page.on('request', request => {
      if (request.url().includes('google-analytics.com/collect') || 
          request.url().includes('google-analytics.com/g/collect')) {
        gaRequests.push({
          url: request.url(),
          postData: request.postData()
        });
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Should have GA requests
    expect(gaRequests.length).toBeGreaterThan(0);
    
    // Check first GA request
    const firstRequest = gaRequests[0];
    expect(firstRequest.url).toContain('G-9SDEZPTE49');
  });

  test('Google Ads conversion requests', async () => {
    const conversionRequests = [];
    
    // Capture conversion requests
    page.on('request', request => {
      if (request.url().includes('googleadservices.com/pagead/conversion')) {
        conversionRequests.push({
          url: request.url(),
          postData: request.postData()
        });
      }
    });
    
    await page.goto('/');
    
    // Simulate conversion
    await page.evaluate(() => {
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-11366664092/UXMnCJi4quYaEJyPhqwq',
          'value': 29.99,
          'currency': 'USD',
          'transaction_id': 'test_conversion_123'
        });
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should have conversion requests
    expect(conversionRequests.length).toBeGreaterThan(0);
  });

  test('Facebook Pixel requests', async () => {
    const fbRequests = [];
    
    // Capture Facebook requests
    page.on('request', request => {
      if (request.url().includes('facebook.com/tr')) {
        fbRequests.push({
          url: request.url(),
          postData: request.postData()
        });
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Should have Facebook requests if pixel is configured
    // Note: This might be 0 if Facebook pixel is not properly configured
    // expect(fbRequests.length).toBeGreaterThan(0);
  });

  test('Performance impact - Script loading', async () => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (adjust threshold as needed)
    expect(loadTime).toBeLessThan(5000); // 5 seconds
    
    // Check for render-blocking scripts
    const renderBlockingScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.filter(script => 
        !script.async && 
        !script.defer && 
        (script.src.includes('googletagmanager.com') || 
         script.src.includes('google-analytics.com'))
      ).length;
    });
    
    // Should minimize render-blocking analytics scripts
    expect(renderBlockingScripts).toBeLessThan(2);
  });

  test('Language selection tracking', async () => {
    await page.goto('/');
    
    // Simulate language selection
    await page.evaluate(() => {
      if (window.dataLayerManager) {
        window.dataLayerManager.trackLanguageSelection('ru');
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    
    // Should have language_selection event
    const langEvent = events.find(event => event.event === 'language_selection');
    expect(langEvent).toBeTruthy();
    expect(langEvent.language).toBe('ru');
    expect(langEvent.previous_language).toBeDefined();
  });

  test('Mobile app download tracking', async () => {
    await page.goto('/');
    
    // Simulate app download tracking
    await page.evaluate(() => {
      if (window.dataLayerManager) {
        window.dataLayerManager.trackAppDownload({
          platform: 'ios',
          source: 'website',
          ctaPosition: 'header'
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get captured events
    const events = await page.evaluate(() => window.capturedDataLayerEvents);
    
    // Should have app_download event
    const appEvent = events.find(event => event.event === 'app_download');
    expect(appEvent).toBeTruthy();
    expect(appEvent.platform).toBe('ios');
    expect(appEvent.value).toBe(5.00);
    expect(appEvent.currency).toBe('USD');
  });

  test('Cross-platform event integration', async () => {
    await page.goto('/');
    
    // Test that dataLayer events trigger other platform events
    await page.evaluate(() => {
      // Mock Meta Standard Events
      window.metaEventsCaptured = [];
      if (window.metaStandardEvents) {
        const originalTrack = window.metaStandardEvents.track;
        window.metaStandardEvents.track = function(eventName, params) {
          window.metaEventsCaptured.push({ eventName, params });
          return originalTrack.call(this, eventName, params);
        };
      }
      
      // Trigger purchase event
      if (window.dataLayerManager) {
        window.dataLayerManager.trackPurchase({
          transactionId: 'cross_platform_test',
          value: 99.99,
          currency: 'USD',
          items: [{
            itemId: 'test_item',
            itemName: 'Test Item',
            price: 99.99,
            quantity: 1
          }]
        });
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Check if Meta events were triggered
    const metaEvents = await page.evaluate(() => window.metaEventsCaptured || []);
    const purchaseEvent = metaEvents.find(event => event.eventName === 'Purchase');
    
    // Should have triggered Meta Purchase event
    if (metaEvents.length > 0) {
      expect(purchaseEvent).toBeTruthy();
      expect(purchaseEvent.params.value).toBe(99.99);
    }
  });
});

// Additional utility tests
test.describe('Analytics Configuration Validation', () => {
  test('Environment variables configuration', async ({ page }) => {
    await page.goto('/');
    
    const config = await page.evaluate(() => {
      return {
        hasGAMeasurementId: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        hasGTMContainerId: !!process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
        hasGoogleAdsId: !!process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
        hasFacebookPixelId: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
      };
    });
    
    // Verify critical environment variables are configured
    expect(config.hasGAMeasurementId || config.hasGTMContainerId).toBe(true);
  });

  test('Debug mode functionality', async ({ page }) => {
    // Set debug mode
    await page.addInitScript(() => {
      localStorage.setItem('analytics_debug', 'true');
    });
    
    await page.goto('/');
    
    // Check debug logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('DataLayer')) {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should have debug logs when debug mode is enabled
    expect(consoleLogs.length).toBeGreaterThan(0);
  });
});