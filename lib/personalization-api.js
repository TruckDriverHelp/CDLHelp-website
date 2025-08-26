/**
 * Real-time Content Personalization API for CDL Help Website
 * Provides dynamic content personalization based on analytics data
 */

import { unifiedIdentity } from './unified-identity.js';

class PersonalizationAPI {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.defaultCacheDuration = 15 * 60 * 1000; // 15 minutes
    this.requestQueue = new Map();
  }

  /**
   * Handle HTTP response with proper error handling for UniqueViolation
   */
  async _handleResponse(response) {
    if (response.ok) {
      return await response.json();
    }

    if (response.status === 400) {
      try {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Bad Request';
        
        if (errorMessage.toLowerCase().includes('unique') || 
            errorMessage.toLowerCase().includes('duplicate') ||
            errorData.error_type === 'unique_violation') {
          console.warn('UniqueViolation detected:', errorMessage);
          throw new Error(`UniqueViolation: ${errorMessage}`);
        } else {
          throw new Error(`Validation error: ${errorMessage}`);
        }
      } catch (parseError) {
        throw new Error(`HTTP 400: Bad Request`);
      }
    }

    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  /**
   * Get comprehensive personalization for current user
   */
  async getComprehensivePersonalization() {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultPersonalization();
      }

      // Check cache first
      const cacheKey = `comprehensive_${userId}`;
      if (this._isValidCache(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Avoid duplicate requests
      if (this.requestQueue.has(cacheKey)) {
        return await this.requestQueue.get(cacheKey);
      }

      const requestPromise = this._fetchComprehensivePersonalization(userId);
      this.requestQueue.set(cacheKey, requestPromise);

      try {
        const result = await requestPromise;
        this._setCache(cacheKey, result);
        return result;
      } finally {
        this.requestQueue.delete(cacheKey);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting comprehensive personalization:', error);
      }
      return this._getDefaultPersonalization();
    }
  }

  /**
   * Get content recommendations for current user
   */
  async getContentRecommendations(contentType = null, limit = 10) {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultContentRecommendations(contentType, limit);
      }

      const cacheKey = `content_${userId}_${contentType}_${limit}`;
      if (this._isValidCache(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(
        `${this.baseUrl}/api/v2/personalization/content/recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this._getAuthToken()}`,
          },
          body: JSON.stringify({
            unified_user_id: userId,
            platform: 'website',
            content_type: contentType,
            limit: limit,
          }),
        }
      );

      const data = await this._handleResponse(response);
      const recommendations = data.recommendation;

      this._setCache(cacheKey, recommendations);
      return recommendations;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting content recommendations:', error);
      }
      return this._getDefaultContentRecommendations(contentType, limit);
    }
  }

  /**
   * Get personalized learning path
   */
  async getLearningPathRecommendation() {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultLearningPath();
      }

      const cacheKey = `learning_path_${userId}`;
      if (this._isValidCache(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(`${this.baseUrl}/api/v2/personalization/learning-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this._getAuthToken()}`,
        },
        body: JSON.stringify({
          unified_user_id: userId,
          platform: 'website',
        }),
      });

      const data = await this._handleResponse(response);
      const learningPath = data.recommendation;

      this._setCache(cacheKey, learningPath, 60 * 60 * 1000); // Cache for 1 hour
      return learningPath;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting learning path recommendation:', error);
      }
      return this._getDefaultLearningPath();
    }
  }

  /**
   * Get quiz difficulty recommendation
   */
  async getQuizDifficultyRecommendation(quizCategory) {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultQuizDifficulty();
      }

      const cacheKey = `quiz_difficulty_${userId}_${quizCategory}`;
      if (this._isValidCache(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(`${this.baseUrl}/api/v2/personalization/quiz/difficulty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this._getAuthToken()}`,
        },
        body: JSON.stringify({
          unified_user_id: userId,
          quiz_category: quizCategory,
          platform: 'website',
        }),
      });

      const data = await this._handleResponse(response);
      const difficulty = data.recommendation;

      this._setCache(cacheKey, difficulty, 2 * 60 * 60 * 1000); // Cache for 2 hours
      return difficulty;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting quiz difficulty recommendation:', error);
      }
      return this._getDefaultQuizDifficulty();
    }
  }

  /**
   * Get feature promotion recommendations
   */
  async getFeaturePromotions() {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultFeaturePromotions();
      }

      const cacheKey = `feature_promotions_${userId}`;
      if (this._isValidCache(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(
        `${this.baseUrl}/api/v2/personalization/features/recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await this._getAuthToken()}`,
          },
          body: JSON.stringify({
            unified_user_id: userId,
            platform: 'website',
          }),
        }
      );

      const data = await this._handleResponse(response);
      const features = data.recommendation;

      this._setCache(cacheKey, features, 24 * 60 * 60 * 1000); // Cache for 24 hours
      return features;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting feature promotions:', error);
      }
      return this._getDefaultFeaturePromotions();
    }
  }

  /**
   * Get personalized notification timing
   */
  async getNotificationTiming() {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultNotificationTiming();
      }

      const cacheKey = `notification_timing_${userId}`;
      if (this._isValidCache(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(`${this.baseUrl}/api/v2/personalization/notifications/timing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this._getAuthToken()}`,
        },
        body: JSON.stringify({
          unified_user_id: userId,
          platform: 'website',
        }),
      });

      const data = await this._handleResponse(response);
      const timing = data.recommendation;

      this._setCache(cacheKey, timing, 7 * 24 * 60 * 60 * 1000); // Cache for 7 days
      return timing;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting notification timing:', error);
      }
      return this._getDefaultNotificationTiming();
    }
  }

  /**
   * Get personalized pricing strategy
   */
  async getPersonalizedPricing() {
    try {
      const userId = unifiedIdentity.getUnifiedUserId();
      if (!userId) {
        return this._getDefaultPricing();
      }

      // Get user's LTV prediction for pricing personalization
      const response = await fetch(`${this.baseUrl}/api/v2/analytics/predictive/ltv/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this._getAuthToken()}`,
        },
        body: JSON.stringify({
          unified_user_id: userId,
        }),
      });

      const data = await this._handleResponse(response);
      const prediction = data.prediction;

      return this._generatePricingStrategy(prediction);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting personalized pricing:', error);
      }
      return this._getDefaultPricing();
    }
  }

  /**
   * Apply personalization to content elements
   */
  async personalizeContent(contentElements) {
    try {
      const personalization = await this.getComprehensivePersonalization();

      const personalizedElements = {};

      for (const [elementId, element] of Object.entries(contentElements)) {
        personalizedElements[elementId] = await this._personalizeElement(element, personalization);
      }

      return personalizedElements;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error personalizing content:', error);
      }
      return contentElements; // Return original if personalization fails
    }
  }

  /**
   * Track personalization interaction
   */
  trackPersonalizationInteraction(recommendationId, action, elementData = {}) {
    try {
      // Track interaction for improving personalization
      const interactionData = {
        recommendation_id: recommendationId,
        action: action, // 'view', 'click', 'dismiss', 'convert'
        element_data: elementData,
        timestamp: Date.now(),
        user_id: unifiedIdentity.getUnifiedUserId(),
        session_id: unifiedIdentity.getSessionId(),
        page_url: window.location.href,
      };

      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'personalization_interaction', {
          custom_parameter_1: recommendationId,
          custom_parameter_2: action,
          custom_parameter_3: JSON.stringify(elementData),
        });
      }

      // Store for batch sending
      this._queueInteraction(interactionData);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error tracking personalization interaction:', error);
      }
    }
  }

  /**
   * Preload personalization data
   */
  async preloadPersonalization() {
    try {
      // Preload common personalization data in background
      const preloadPromises = [
        this.getContentRecommendations('quiz', 5),
        this.getContentRecommendations('lesson', 5),
        this.getLearningPathRecommendation(),
        this.getFeaturePromotions(),
      ];

      await Promise.allSettled(preloadPromises);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error preloading personalization:', error);
      }
    }
  }

  // Private helper methods
  async _fetchComprehensivePersonalization(userId) {
    const response = await fetch(`${this.baseUrl}/api/v2/personalization/comprehensive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this._getAuthToken()}`,
      },
      body: JSON.stringify({
        unified_user_id: userId,
        platform: 'website',
      }),
    });

    const data = await this._handleResponse(response);
    return data.recommendations;
  }

  async _personalizeElement(element, personalization) {
    const personalizedElement = { ...element };

    // Apply content recommendations
    if (element.type === 'content_list' && personalization.content) {
      const recommendations = personalization.content.content.recommendations || [];
      personalizedElement.items = recommendations.slice(0, element.limit || 10);
    }

    // Apply feature promotions
    if (element.type === 'feature_promotion' && personalization.features) {
      const features = personalization.features.content.recommended_features || [];
      personalizedElement.features = features;
      personalizedElement.promotion_strategy = personalization.features.content.promotion_strategy;
    }

    // Apply learning path
    if (element.type === 'learning_path' && personalization.learning_path) {
      personalizedElement.path = personalization.learning_path.content.learning_path;
      personalizedElement.difficulty = personalization.learning_path.content.difficulty_level;
    }

    // Apply personalization metadata
    personalizedElement.personalization_applied = true;
    personalizedElement.personalization_timestamp = Date.now();

    return personalizedElement;
  }

  _generatePricingStrategy(prediction) {
    const userSegment = prediction.user_segment;
    const predictedLTV = prediction.predicted_ltv;

    let strategy = {
      show_discount: false,
      discount_percentage: 0,
      urgency_messaging: false,
      trial_extension: false,
      payment_options: ['monthly', 'annual'],
    };

    switch (userSegment) {
      case 'high_value':
        strategy = {
          show_discount: false,
          discount_percentage: 0,
          urgency_messaging: false,
          trial_extension: true,
          payment_options: ['monthly', 'annual', 'lifetime'],
          messaging: 'Premium features designed for serious learners',
        };
        break;

      case 'medium_value':
        strategy = {
          show_discount: true,
          discount_percentage: 15,
          urgency_messaging: true,
          trial_extension: false,
          payment_options: ['monthly', 'annual'],
          messaging: 'Limited time offer - Save 15% on your subscription',
        };
        break;

      case 'low_value':
        strategy = {
          show_discount: true,
          discount_percentage: 25,
          urgency_messaging: true,
          trial_extension: true,
          payment_options: ['monthly'],
          messaging: 'Special offer just for you - 25% off your first month',
        };
        break;

      default:
        strategy = {
          show_discount: true,
          discount_percentage: 10,
          urgency_messaging: false,
          trial_extension: true,
          payment_options: ['monthly', 'annual'],
          messaging: 'Start your CDL journey today',
        };
    }

    return strategy;
  }

  _isValidCache(key) {
    const expiry = this.cacheExpiry.get(key);
    return expiry && Date.now() < expiry;
  }

  _setCache(key, value, duration = this.defaultCacheDuration) {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + duration);
  }

  _queueInteraction(interactionData) {
    const interactions = JSON.parse(
      localStorage.getItem('cdlhelp_personalization_interactions') || '[]'
    );
    interactions.push(interactionData);

    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }

    localStorage.setItem('cdlhelp_personalization_interactions', JSON.stringify(interactions));

    // Send batch if queue is full
    if (interactions.length >= 10) {
      this._sendInteractionBatch();
    }
  }

  async _sendInteractionBatch() {
    try {
      const interactions = JSON.parse(
        localStorage.getItem('cdlhelp_personalization_interactions') || '[]'
      );

      if (interactions.length === 0) return;

      await fetch(`${this.baseUrl}/api/v2/analytics/interactions/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this._getAuthToken()}`,
        },
        body: JSON.stringify({ interactions }),
      });

      // Clear sent interactions
      localStorage.removeItem('cdlhelp_personalization_interactions');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending interaction batch:', error);
      }
    }
  }

  async _getAuthToken() {
    // In a real implementation, this would get the current auth token
    return 'dummy-token';
  }

  // Default fallback methods
  _getDefaultPersonalization() {
    return {
      content: {
        recommendations: this._getDefaultContentRecommendations('quiz', 5),
      },
      learning_path: this._getDefaultLearningPath(),
      features: this._getDefaultFeaturePromotions(),
      notifications: this._getDefaultNotificationTiming(),
    };
  }

  _getDefaultContentRecommendations(contentType, limit) {
    const defaultContent = {
      quiz: [
        {
          id: 'quiz_001',
          title: 'Basic Traffic Laws',
          difficulty: 'easy',
          category: 'traffic_laws',
        },
        {
          id: 'quiz_002',
          title: 'Vehicle Inspection',
          difficulty: 'medium',
          category: 'inspection',
        },
        { id: 'quiz_003', title: 'Safety Regulations', difficulty: 'easy', category: 'safety' },
      ],
      lesson: [
        { id: 'lesson_001', title: 'Introduction to CDL', difficulty: 'easy', category: 'basics' },
        {
          id: 'lesson_002',
          title: 'Pre-Trip Inspection',
          difficulty: 'medium',
          category: 'inspection',
        },
        { id: 'lesson_003', title: 'Road Safety', difficulty: 'easy', category: 'safety' },
      ],
    };

    const content = defaultContent[contentType] || defaultContent.quiz;
    return {
      recommendations: content.slice(0, limit),
      confidence_score: 0.5,
      reasoning: ['Default recommendations - user data not available'],
    };
  }

  _getDefaultLearningPath() {
    return {
      content: {
        learning_path: {
          name: 'Standard CDL Path',
          description: 'Comprehensive CDL preparation program',
          duration_weeks: 4,
          difficulty: 'medium',
          modules: ['basics', 'inspection', 'safety', 'testing'],
        },
      },
      confidence_score: 0.5,
      reasoning: ['Default learning path for new users'],
    };
  }

  _getDefaultQuizDifficulty() {
    return {
      content: {
        difficulty: 'medium',
        expected_score_range: { min: 60, max: 80 },
        preparation_suggestions: [
          'Review category basics',
          'Practice with mixed difficulty questions',
        ],
      },
      confidence_score: 0.5,
      reasoning: ['Default medium difficulty for balanced challenge'],
    };
  }

  _getDefaultFeaturePromotions() {
    return {
      content: {
        recommended_features: ['progress_tracking', 'study_reminders', 'practice_tests'],
        promotion_strategy: 'gradual_introduction',
        feature_descriptions: {
          progress_tracking: 'Track your learning progress across all topics',
          study_reminders: 'Get personalized reminders to keep you on track',
          practice_tests: 'Take comprehensive practice exams',
        },
      },
      confidence_score: 0.5,
      reasoning: ['Default features for new users'],
    };
  }

  _getDefaultNotificationTiming() {
    return {
      content: {
        optimal_hours: [19, 20],
        optimal_days: ['monday', 'tuesday', 'wednesday', 'thursday'],
        frequency: 'every_other_day',
        tone: 'encouraging',
      },
      confidence_score: 0.3,
      reasoning: ['Default notification schedule'],
    };
  }

  _getDefaultPricing() {
    return {
      show_discount: false,
      discount_percentage: 0,
      urgency_messaging: false,
      trial_extension: false,
      payment_options: ['monthly', 'annual'],
      messaging: 'Choose the plan that works for you',
    };
  }
}

// Create singleton instance
export const personalizationAPI = new PersonalizationAPI();

// Auto-preload personalization data when user is identified
if (typeof window !== 'undefined') {
  window.addEventListener('unified_identity_ready', () => {
    personalizationAPI.preloadPersonalization();
  });
}
