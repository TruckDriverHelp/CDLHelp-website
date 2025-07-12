/**
 * Standardized Event Schema for CDL Help Cross-Platform Analytics
 *
 * This schema ensures consistent event parameter structures across:
 * - Website (Next.js)
 * - Mobile App (Flutter)
 * - Backend (Python)
 *
 * Version: 2.1.0
 */

export const STANDARD_EVENT_SCHEMA = {
  // Core event identification
  event_name: 'string',
  event_id: 'string', // UUID v4
  timestamp: 'number', // Unix timestamp in milliseconds
  platform: 'string', // 'website', 'mobile', 'backend'

  // User identification (unified across platforms)
  user_data: {
    unified_user_id: 'string', // cdlh_uuid format
    session_id: 'string', // sess_uuid format
    device_fingerprint: 'string',
    email_hash: 'string', // SHA256 hashed (optional)
    phone_hash: 'string', // SHA256 hashed (optional)
    user_id: 'string', // Internal user ID (optional)
    external_id: 'string', // Third-party ID (optional)
  },

  // Attribution data (preserved across platforms)
  attribution: {
    utm_source: 'string',
    utm_medium: 'string',
    utm_campaign: 'string',
    utm_term: 'string',
    utm_content: 'string',
    gclid: 'string', // Google Click ID
    fbclid: 'string', // Facebook Click ID
    ttclid: 'string', // TikTok Click ID
    msclkid: 'string', // Microsoft Click ID
    referrer: 'string',
    landing_page: 'string',
  },

  // Device and session context
  context: {
    device_type: 'string', // 'mobile', 'desktop', 'tablet'
    platform_version: 'string', // OS version or browser
    app_version: 'string', // App version
    locale: 'string', // 'en', 'es', 'ru'
    timezone: 'string',
    screen_resolution: 'string', // 'width_x_height'
    connection_type: 'string', // 'wifi', '4g', '5g', 'ethernet'
    page_url: 'string',
    page_title: 'string',
  },

  // Event-specific custom data
  custom_data: 'object', // Flexible object for event-specific properties

  // Revenue/conversion data (when applicable)
  value_data: {
    value: 'number', // Monetary value
    currency: 'string', // ISO currency code
    content_type: 'string', // 'subscription', 'course', 'quiz'
    content_ids: 'array', // Array of product/content IDs
    content_name: 'string',
    content_category: 'string',
    num_items: 'number',
  },

  // Deduplication and tracking metadata
  tracking_meta: {
    event_hash: 'string', // SHA256 for deduplication
    skip_deduplication: 'boolean',
    source_platform: 'string', // Original platform that generated event
    tracking_version: 'string', // Version of tracking implementation
    batch_id: 'string', // For batched events
    retry_count: 'number', // For failed event retries
  },
};

/**
 * Standard Event Templates
 */
export const EVENT_TEMPLATES = {
  // Quiz events
  quiz_started: {
    event_name: 'quiz_started',
    custom_data: {
      quiz_name: 'string',
      quiz_category: 'string', // 'general_knowledge', 'road_signs', etc.
      quiz_type: 'string', // 'practice', 'mock_test', 'review'
      total_questions: 'number',
      difficulty: 'string', // 'easy', 'medium', 'hard'
    },
  },

  quiz_completed: {
    event_name: 'quiz_completed',
    custom_data: {
      quiz_name: 'string',
      quiz_category: 'string',
      quiz_type: 'string',
      total_questions: 'number',
      correct_answers: 'number',
      incorrect_answers: 'number',
      skipped_questions: 'number',
      score_percentage: 'number',
      passed: 'boolean',
      time_spent_seconds: 'number',
      completion_rate: 'number', // percentage
      performance_level: 'string', // 'excellent', 'good', 'average', 'poor'
      session_quiz_number: 'number',
    },
  },

  question_attempted: {
    event_name: 'question_attempted',
    custom_data: {
      question_id: 'string',
      question_index: 'number',
      question_category: 'string',
      selected_answer: 'string',
      correct_answer: 'string',
      is_correct: 'boolean',
      time_spent_seconds: 'number',
      answer_changes: 'number',
      was_skipped: 'boolean',
      used_hint: 'boolean',
      confidence_level: 'number', // 0.0 to 1.0
    },
  },

  // App download and installation
  download_intent: {
    event_name: 'download_intent',
    custom_data: {
      target_platform: 'string', // 'ios', 'android'
      source_element: 'string', // 'hero_button', 'pricing_page', 'quiz_completion'
      is_app_capable: 'boolean',
      store_redirect_url: 'string',
    },
  },

  app_install: {
    event_name: 'app_install',
    custom_data: {
      install_source: 'string', // 'app_store', 'play_store', 'direct'
      install_time_seconds: 'number', // Time from click to install
      came_from_website: 'boolean',
    },
  },

  // Subscription events
  subscription_started: {
    event_name: 'subscription_started',
    custom_data: {
      subscription_type: 'string', // 'monthly', 'yearly', 'lifetime'
      plan_name: 'string', // 'premium', 'basic', 'pro'
      trial_days: 'number',
      payment_method: 'string', // 'credit_card', 'paypal', 'apple_pay'
      promo_code: 'string',
    },
    value_data: {
      content_type: 'subscription',
    },
  },

  subscription_renewed: {
    event_name: 'subscription_renewed',
    custom_data: {
      subscription_type: 'string',
      plan_name: 'string',
      renewal_count: 'number',
      days_since_start: 'number',
    },
    value_data: {
      content_type: 'subscription',
    },
  },

  subscription_cancelled: {
    event_name: 'subscription_cancelled',
    custom_data: {
      subscription_type: 'string',
      plan_name: 'string',
      cancellation_reason: 'string',
      days_active: 'number',
      will_expire_at: 'string', // ISO timestamp
    },
  },

  // User engagement
  page_view: {
    event_name: 'page_view',
    custom_data: {
      page_type: 'string', // 'home', 'quiz', 'pricing', 'about'
      section: 'string', // Page section if applicable
      time_on_page_seconds: 'number',
    },
  },

  form_submitted: {
    event_name: 'form_submitted',
    custom_data: {
      form_type: 'string', // 'contact', 'newsletter', 'feedback'
      form_name: 'string',
      fields_completed: 'number',
      total_fields: 'number',
      submission_status: 'string', // 'success', 'failed', 'validation_error'
      error_message: 'string',
    },
  },

  // Cross-platform handoff
  cross_platform_handoff: {
    event_name: 'cross_platform_handoff',
    custom_data: {
      source_platform: 'string', // 'website', 'mobile'
      target_platform: 'string', // 'mobile', 'website'
      handoff_type: 'string', // 'deep_link', 'session_restore', 'download_intent'
      handoff_data: 'object', // Additional handoff context
      success: 'boolean',
    },
  },
};

/**
 * Platform-specific mappers for external services
 */
export const PLATFORM_MAPPERS = {
  // Meta CAPI mapping
  meta_capi: {
    user_data_fields: {
      'user_data.email_hash': 'em',
      'user_data.phone_hash': 'ph',
      'user_data.unified_user_id': 'external_id',
      'context.device_type': 'client_user_agent',
      'attribution.fbclid': 'fbc',
      'user_data.device_fingerprint': 'fbp',
    },
    custom_data_fields: {
      'value_data.value': 'value',
      'value_data.currency': 'currency',
      'value_data.content_type': 'content_type',
      'value_data.content_ids': 'content_ids',
      'value_data.content_name': 'content_name',
      'value_data.content_category': 'content_category',
      'value_data.num_items': 'num_items',
    },
  },

  // AppsFlyer mapping
  appsflyer: {
    revenue_fields: {
      'value_data.value': 'af_revenue',
      'value_data.currency': 'af_currency',
      'value_data.content_ids[0]': 'af_content_id',
      'value_data.content_type': 'af_content_type',
      'custom_data.subscription_type': 'af_subscription_type',
    },
    attribution_fields: {
      'attribution.utm_source': 'af_channel',
      'attribution.utm_medium': 'af_media_source',
      'attribution.utm_campaign': 'af_campaign',
    },
  },

  // Google Analytics 4 mapping
  ga4: {
    standard_fields: {
      event_name: 'event_name',
      'value_data.value': 'value',
      'value_data.currency': 'currency',
      custom_data: 'custom_parameters',
    },
    user_properties: {
      'user_data.unified_user_id': 'user_id',
      'context.locale': 'language',
      'context.device_type': 'device_category',
    },
  },
};

/**
 * Event validation function
 */
export function validateEvent(event) {
  const errors = [];

  // Required fields
  if (!event.event_name) errors.push('event_name is required');
  if (!event.timestamp) errors.push('timestamp is required');
  if (!event.platform) errors.push('platform is required');

  // User data validation
  if (!event.user_data?.unified_user_id) {
    errors.push('user_data.unified_user_id is required');
  }

  // Timestamp validation
  if (event.timestamp && typeof event.timestamp !== 'number') {
    errors.push('timestamp must be a Unix timestamp in milliseconds');
  }

  // Platform validation
  const validPlatforms = ['website', 'mobile', 'backend'];
  if (event.platform && !validPlatforms.includes(event.platform)) {
    errors.push(`platform must be one of: ${validPlatforms.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Event normalization function
 */
export function normalizeEvent(rawEvent, platform) {
  const normalizedEvent = {
    event_name: rawEvent.event_name || rawEvent.eventName,
    event_id: rawEvent.event_id || generateEventId(),
    timestamp: rawEvent.timestamp || Date.now(),
    platform: platform,

    user_data: {
      unified_user_id: rawEvent.unified_user_id || rawEvent.user_data?.unified_user_id,
      session_id: rawEvent.session_id || rawEvent.user_data?.session_id,
      device_fingerprint: rawEvent.device_fingerprint || rawEvent.user_data?.device_fingerprint,
      ...rawEvent.user_data,
    },

    attribution: {
      utm_source: rawEvent.utm_source || rawEvent.attribution?.utm_source,
      utm_medium: rawEvent.utm_medium || rawEvent.attribution?.utm_medium,
      utm_campaign: rawEvent.utm_campaign || rawEvent.attribution?.utm_campaign,
      ...rawEvent.attribution,
    },

    context: {
      device_type: rawEvent.device_type || rawEvent.context?.device_type,
      locale: rawEvent.locale || rawEvent.context?.locale,
      page_url: rawEvent.page_url || rawEvent.context?.page_url,
      ...rawEvent.context,
    },

    custom_data: rawEvent.custom_data || {},
    value_data: rawEvent.value_data || {},

    tracking_meta: {
      event_hash: generateEventHash(rawEvent),
      skip_deduplication: rawEvent.skip_deduplication || false,
      source_platform: platform,
      tracking_version: '2.1.0',
      ...rawEvent.tracking_meta,
    },
  };

  return normalizedEvent;
}

/**
 * Helper functions
 */
function generateEventId() {
  return 'evt_' + crypto.randomUUID();
}

function generateEventHash(event) {
  // Create a deterministic hash for deduplication
  const hashString = `${event.event_name}_${event.user_data?.unified_user_id}_${event.timestamp}_${JSON.stringify(event.custom_data)}`;

  // Simple hash function for browser compatibility
  let hash = 0;
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return 'hash_' + Math.abs(hash).toString(36);
}

export default {
  STANDARD_EVENT_SCHEMA,
  EVENT_TEMPLATES,
  PLATFORM_MAPPERS,
  validateEvent,
  normalizeEvent,
};
