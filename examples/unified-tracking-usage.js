/**
 * Unified Cross-Platform Tracking Usage Examples
 * Demonstrates how to use the enhanced analytics and session continuity services
 */

import enhancedAnalytics from '../lib/analytics-enhanced';
import sessionContinuity from '../lib/session-continuity';
import unifiedIdentity from '../lib/unified-identity';

// Example 1: Enhanced App Download with Session Continuity
export async function handleAppDownloadButton(platform) {
  try {
    // This handles the complete download flow with session continuity
    const downloadData = await sessionContinuity.handleAppDownload(platform, 'hero_button');

    console.log('Download prepared:', downloadData);

    // Redirect to app store with unified tracking
    window.location.href = downloadData.appStoreUrl;
  } catch (error) {
    console.error('Download flow error:', error);

    // Fallback to simple redirect
    const fallbackUrls = {
      ios: 'https://apps.apple.com/app/cdl-help/id6444388755',
      android: 'https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp',
    };
    window.location.href = fallbackUrls[platform];
  }
}

// Example 2: Track Quiz Completion with Enhanced Context
export async function trackQuizCompletion(score, totalQuestions, subject) {
  try {
    await enhancedAnalytics.trackEvent('quiz_completed', {
      score,
      total_questions: totalQuestions,
      subject,
      completion_rate: (score / totalQuestions) * 100,
      passed: score >= totalQuestions * 0.8,
      quiz_type: 'practice',
      time_spent: getQuizTimeSpent(), // Your quiz timer function
    });

    console.log('Quiz completion tracked with unified identity');
  } catch (error) {
    console.error('Error tracking quiz completion:', error);
  }
}

// Example 3: Track Feature Usage with Cross-Platform Context
export async function trackFeatureUsage(featureName, action, value = null) {
  try {
    await enhancedAnalytics.trackEvent('feature_usage', {
      feature_name: featureName,
      action,
      value,
      page_context: window.location.pathname,
      user_type: getUserType(), // Your user classification function
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}

// Example 4: Subscription Event with Revenue Tracking
export async function trackSubscriptionEvent(eventType, productId, value, currency = 'USD') {
  try {
    await enhancedAnalytics.trackEvent(
      'subscription_event',
      {
        event_type: eventType, // 'started', 'converted', 'renewed', 'cancelled'
        product_id: productId,
        value,
        currency,
        subscription_source: 'website',
        conversion_step: getConversionStep(), // Your funnel tracking function
      },
      {
        // Send to conversion APIs for better attribution
        sendToConversionsApi: true,
      }
    );
  } catch (error) {
    console.error('Error tracking subscription event:', error);
  }
}

// Example 5: Page View with Enhanced Context
export async function trackEnhancedPageView(pagePath, pageTitle) {
  try {
    await enhancedAnalytics.trackPageView(pagePath, pageTitle);

    // Track additional page context
    await enhancedAnalytics.trackEvent('page_context', {
      page_category: getPageCategory(pagePath),
      content_language: getCurrentLanguage(),
      user_engagement_score: getUserEngagementScore(),
      page_load_time: getPageLoadTime(),
    });
  } catch (error) {
    console.error('Error tracking enhanced page view:', error);
  }
}

// Example 6: Cross-Platform User Journey Tracking
export async function trackUserJourney(journeyStep, journeyType = 'onboarding') {
  try {
    await enhancedAnalytics.trackEvent('user_journey_step', {
      journey_type: journeyType,
      step_name: journeyStep,
      step_number: getStepNumber(journeyStep),
      journey_progress: getJourneyProgress(),
      platform: 'web',
      session_duration: getSessionDuration(),
    });
  } catch (error) {
    console.error('Error tracking user journey:', error);
  }
}

// Example 7: Event with Custom Deduplication
export async function trackCustomEvent(eventName, properties, options = {}) {
  try {
    await enhancedAnalytics.trackEvent(eventName, properties, {
      // Disable batching for immediate sending
      batch: false,
      // Allow duplicates if needed
      allowDuplicates: options.allowDuplicates || false,
      // Skip specific platforms if needed
      skipFirebase: options.skipFirebase || false,
      skipFacebook: options.skipFacebook || false,
      skipAmplitude: options.skipAmplitude || false,
    });
  } catch (error) {
    console.error('Error tracking custom event:', error);
  }
}

// Example 8: Session Preparation for App Handoff
export async function prepareSessionForApp(targetUrl, additionalContext = {}) {
  try {
    const sessionData = await sessionContinuity.prepareAppHandoff(targetUrl, {
      handoff_reason: 'user_initiated',
      page_context: window.location.pathname,
      user_intent: additionalContext.intent || 'unknown',
      ...additionalContext,
    });

    console.log('Session prepared for app handoff:', sessionData);
    return sessionData;
  } catch (error) {
    console.error('Error preparing session for app:', error);
    return null;
  }
}

// Example 9: Get Unified User Identity for Custom Use
export function getUnifiedUserContext() {
  try {
    const identity = unifiedIdentity.getUserIdentity();
    const analyticsStatus = enhancedAnalytics.getStatus();
    const sessionStatus = sessionContinuity.getStatus();

    return {
      user_identity: identity,
      analytics_status: analyticsStatus,
      session_status: sessionStatus,
      tracking_enabled: identity && analyticsStatus.initialized,
    };
  } catch (error) {
    console.error('Error getting unified user context:', error);
    return null;
  }
}

// Example 10: Debug Cross-Platform Tracking
export function debugCrossPlatformTracking() {
  try {
    const context = getUnifiedUserContext();

    console.group('🔍 Cross-Platform Tracking Debug');
    console.log('Unified User ID:', context.user_identity?.unifiedUserId);
    console.log('Session ID:', context.user_identity?.sessionId);
    console.log(
      'Device Fingerprint:',
      context.user_identity?.deviceFingerprint?.slice(0, 8) + '...'
    );
    console.log('Attribution Data:', context.user_identity?.attribution);
    console.log('Visit Metrics:', context.user_identity?.visitMetrics);
    console.log('Analytics Status:', context.analytics_status);
    console.log('Session Status:', context.session_status);
    console.groupEnd();

    return context;
  } catch (error) {
    console.error('Error debugging cross-platform tracking:', error);
    return null;
  }
}

// Helper Functions (implement these based on your app's needs)
function getQuizTimeSpent() {
  // Return quiz duration in seconds
  return Math.round((Date.now() - (window.quizStartTime || Date.now())) / 1000);
}

function getUserType() {
  // Return user classification: 'new', 'returning', 'premium', etc.
  return localStorage.getItem('user_type') || 'unknown';
}

function getConversionStep() {
  // Return current step in conversion funnel
  const path = window.location.pathname;
  if (path.includes('pricing')) return 'pricing_view';
  if (path.includes('checkout')) return 'checkout';
  return 'unknown';
}

function getPageCategory(path) {
  // Categorize pages for analytics
  if (path.includes('quiz')) return 'learning';
  if (path.includes('pricing')) return 'conversion';
  if (path.includes('blog')) return 'content';
  if (path === '/') return 'homepage';
  return 'other';
}

function getCurrentLanguage() {
  // Get current language from URL or browser
  const path = window.location.pathname;
  const langMatch = path.match(/^\/([a-z]{2})\//);
  return langMatch ? langMatch[1] : navigator.language.split('-')[0];
}

function getUserEngagementScore() {
  // Calculate engagement score based on user activity
  const pageViews = parseInt(sessionStorage.getItem('page_views') || '1');
  const timeOnSite = Date.now() - parseInt(sessionStorage.getItem('session_start') || Date.now());
  return Math.min(100, pageViews * 10 + Math.round(timeOnSite / 60000));
}

function getPageLoadTime() {
  // Get page load time in milliseconds
  if (window.performance && window.performance.timing) {
    return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
  }
  return 0;
}

function getStepNumber(stepName) {
  // Map step names to numbers for funnel analysis
  const stepMapping = {
    landing: 1,
    signup_form: 2,
    email_verification: 3,
    profile_setup: 4,
    quiz_start: 5,
    quiz_complete: 6,
    subscription_offer: 7,
    payment: 8,
    completion: 9,
  };
  return stepMapping[stepName] || 0;
}

function getJourneyProgress() {
  // Calculate overall journey progress percentage
  const currentStep = getStepNumber(getCurrentJourneyStep());
  const totalSteps = 9; // Total steps in journey
  return Math.round((currentStep / totalSteps) * 100);
}

function getCurrentJourneyStep() {
  // Determine current step based on page/user state
  const path = window.location.pathname;
  if (path === '/') return 'landing';
  if (path.includes('signup')) return 'signup_form';
  if (path.includes('verify')) return 'email_verification';
  if (path.includes('profile')) return 'profile_setup';
  if (path.includes('quiz')) return 'quiz_start';
  if (path.includes('pricing')) return 'subscription_offer';
  if (path.includes('checkout')) return 'payment';
  return 'unknown';
}

function getSessionDuration() {
  // Get current session duration in seconds
  const sessionStart = parseInt(sessionStorage.getItem('session_start') || Date.now());
  return Math.round((Date.now() - sessionStart) / 1000);
}

// Export all examples
export default {
  handleAppDownloadButton,
  trackQuizCompletion,
  trackFeatureUsage,
  trackSubscriptionEvent,
  trackEnhancedPageView,
  trackUserJourney,
  trackCustomEvent,
  prepareSessionForApp,
  getUnifiedUserContext,
  debugCrossPlatformTracking,
};
