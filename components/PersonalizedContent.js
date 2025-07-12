/**
 * Personalized Content Components for CDL Help Website
 * React components that dynamically render personalized content
 */

import React, { useState, useEffect, useMemo } from 'react';
import { personalizationAPI } from '../lib/personalization-api.js';

/**
 * Personalized Quiz Recommendations Component
 */
export const PersonalizedQuizRecommendations = ({ limit = 5, className = '' }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await personalizationAPI.getContentRecommendations('quiz', limit);
        setRecommendations(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading quiz recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [limit]);

  const handleQuizClick = (quiz, index) => {
    personalizationAPI.trackPersonalizationInteraction(
      recommendations?.recommendation_id,
      'click',
      { quiz_id: quiz.id, position: index, content_type: 'quiz' }
    );
  };

  if (loading) {
    return (
      <div className={`personalized-content loading ${className}`}>
        <div className="content-skeleton">
          <div className="skeleton-header"></div>
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="skeleton-item"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className={`personalized-content error ${className}`}>
        <h3>Recommended Quizzes</h3>
        <p>Unable to load personalized recommendations. Please try again later.</p>
      </div>
    );
  }

  const quizzes = recommendations.content?.recommendations || [];

  return (
    <div className={`personalized-content quiz-recommendations ${className}`}>
      <div className="content-header">
        <h3>Recommended for You</h3>
        {recommendations.reasoning?.length > 0 && (
          <p className="personalization-reason">{recommendations.reasoning[0]}</p>
        )}
      </div>

      <div className="quiz-list">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className={`quiz-card difficulty-${quiz.difficulty}`}
            onClick={() => handleQuizClick(quiz, index)}
          >
            <div className="quiz-header">
              <h4>{quiz.title}</h4>
              <span className={`difficulty-badge ${quiz.difficulty}`}>{quiz.difficulty}</span>
            </div>
            <div className="quiz-details">
              <span className="category">{quiz.category}</span>
              <span className="duration">{quiz.duration_minutes}min</span>
            </div>
          </div>
        ))}
      </div>

      <div className="confidence-indicator">
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${(recommendations.confidence_score || 0.5) * 100}%` }}
          ></div>
        </div>
        <span className="confidence-text">
          {Math.round((recommendations.confidence_score || 0.5) * 100)}% match confidence
        </span>
      </div>
    </div>
  );
};

/**
 * Personalized Learning Path Component
 */
export const PersonalizedLearningPath = ({ className = '' }) => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLearningPath = async () => {
      try {
        setLoading(true);
        const data = await personalizationAPI.getLearningPathRecommendation();
        setLearningPath(data);
      } catch (err) {
        console.error('Error loading learning path:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLearningPath();
  }, []);

  const handlePathAction = action => {
    personalizationAPI.trackPersonalizationInteraction(learningPath?.recommendation_id, action, {
      path_name: learningPath?.content?.learning_path?.name,
    });
  };

  if (loading) {
    return (
      <div className={`personalized-content loading ${className}`}>
        <div className="learning-path-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-modules"></div>
        </div>
      </div>
    );
  }

  if (!learningPath?.content?.learning_path) {
    return null;
  }

  const path = learningPath.content.learning_path;

  return (
    <div className={`personalized-content learning-path ${className}`}>
      <div className="path-header">
        <h3>Your Personalized Learning Path</h3>
        <div className="path-meta">
          <span className={`difficulty ${path.difficulty}`}>{path.difficulty}</span>
          <span className="duration">{path.duration_weeks} weeks</span>
        </div>
      </div>

      <div className="path-description">
        <p>{path.description}</p>
      </div>

      <div className="path-modules">
        <h4>Learning Modules</h4>
        <div className="modules-grid">
          {path.modules?.map((module, index) => (
            <div key={index} className="module-card">
              <div className="module-number">{index + 1}</div>
              <div className="module-name">{module.replace(/_/g, ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="path-actions">
        <button className="btn-primary" onClick={() => handlePathAction('start_path')}>
          Start Learning Path
        </button>
        <button className="btn-secondary" onClick={() => handlePathAction('customize')}>
          Customize Path
        </button>
      </div>

      <div className="personalization-info">
        {learningPath.reasoning?.map((reason, index) => (
          <p key={index} className="reason-text">
            {reason}
          </p>
        ))}
      </div>
    </div>
  );
};

/**
 * Personalized Feature Promotions Component
 */
export const PersonalizedFeaturePromotions = ({ className = '' }) => {
  const [promotions, setPromotions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissedFeatures, setDismissedFeatures] = useState(new Set());

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);
        const data = await personalizationAPI.getFeaturePromotions();
        setPromotions(data);
      } catch (err) {
        console.error('Error loading feature promotions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const handleFeatureAction = (feature, action) => {
    personalizationAPI.trackPersonalizationInteraction(promotions?.recommendation_id, action, {
      feature_name: feature,
    });

    if (action === 'dismiss') {
      setDismissedFeatures(prev => new Set([...prev, feature]));
    }
  };

  if (loading || !promotions?.content?.recommended_features) {
    return null;
  }

  const features = promotions.content.recommended_features.filter(
    feature => !dismissedFeatures.has(feature)
  );

  if (features.length === 0) {
    return null;
  }

  const descriptions = promotions.content.feature_descriptions || {};
  const strategy = promotions.content.promotion_strategy;

  return (
    <div className={`personalized-content feature-promotions ${className}`}>
      <div className="promotions-header">
        <h3>Features You Might Like</h3>
        <p className="strategy-hint">
          {strategy === 'direct_access' && 'Premium features for advanced learners'}
          {strategy === 'trial_offer' && 'Try these features with your free trial'}
          {strategy === 'gradual_introduction' && 'Discover new ways to learn'}
        </p>
      </div>

      <div className="features-grid">
        {features.slice(0, 3).map((feature, index) => (
          <div key={feature} className="feature-card">
            <div className="feature-header">
              <h4>{feature.replace(/_/g, ' ')}</h4>
              <button
                className="dismiss-btn"
                onClick={() => handleFeatureAction(feature, 'dismiss')}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>

            <p className="feature-description">
              {descriptions[feature] || 'Enhance your learning experience'}
            </p>

            <div className="feature-actions">
              <button
                className="btn-primary"
                onClick={() => handleFeatureAction(feature, 'try_feature')}
              >
                Try Now
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleFeatureAction(feature, 'learn_more')}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Personalized Pricing Component
 */
export const PersonalizedPricing = ({ className = '' }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        setLoading(true);
        const data = await personalizationAPI.getPersonalizedPricing();
        setPricing(data);
      } catch (err) {
        console.error('Error loading personalized pricing:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  const handlePricingAction = (action, planType) => {
    personalizationAPI.trackPersonalizationInteraction('pricing_personalization', action, {
      plan_type: planType,
      discount_shown: pricing?.show_discount,
    });
  };

  if (loading || !pricing) {
    return null;
  }

  return (
    <div className={`personalized-content pricing ${className}`}>
      {pricing.show_discount && (
        <div className="discount-banner">
          <h3>Special Offer</h3>
          <p>Save {pricing.discount_percentage}% on your subscription!</p>
          {pricing.urgency_messaging && <p className="urgency">Limited time offer</p>}
        </div>
      )}

      <div className="pricing-message">
        <p>{pricing.messaging}</p>
      </div>

      <div className="pricing-plans">
        {pricing.payment_options.map(option => (
          <div key={option} className={`pricing-plan ${option}`}>
            <h4>{option.charAt(0).toUpperCase() + option.slice(1)} Plan</h4>

            {pricing.show_discount && (
              <div className="discount-info">
                <span className="discount-percentage">{pricing.discount_percentage}% OFF</span>
              </div>
            )}

            <div className="plan-actions">
              <button
                className="btn-primary"
                onClick={() => handlePricingAction('select_plan', option)}
              >
                Choose {option}
              </button>
            </div>
          </div>
        ))}
      </div>

      {pricing.trial_extension && (
        <div className="trial-extension">
          <p>Get extra trial time to explore all features!</p>
          <button
            className="btn-secondary"
            onClick={() => handlePricingAction('extend_trial', 'extended')}
          >
            Extend My Trial
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Adaptive Quiz Difficulty Component
 */
export const AdaptiveQuizDifficulty = ({ quizCategory, onDifficultySelect, className = '' }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendation = async () => {
      if (!quizCategory) return;

      try {
        setLoading(true);
        const data = await personalizationAPI.getQuizDifficultyRecommendation(quizCategory);
        setRecommendation(data);
      } catch (err) {
        console.error('Error loading quiz difficulty recommendation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendation();
  }, [quizCategory]);

  const handleDifficultySelect = difficulty => {
    personalizationAPI.trackPersonalizationInteraction(
      recommendation?.recommendation_id,
      'select_difficulty',
      {
        category: quizCategory,
        difficulty,
        recommended: difficulty === recommendation?.content?.difficulty,
      }
    );

    onDifficultySelect?.(difficulty);
  };

  if (loading || !recommendation?.content) {
    return (
      <div className={`difficulty-selector ${className}`}>
        <label>Choose Difficulty:</label>
        <div className="difficulty-options">
          {['easy', 'medium', 'hard'].map(diff => (
            <button key={diff} onClick={() => handleDifficultySelect(diff)}>
              {diff}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const { difficulty, expected_score_range, preparation_suggestions } = recommendation.content;

  return (
    <div className={`adaptive-difficulty ${className}`}>
      <div className="recommendation-header">
        <h4>Recommended Difficulty: {difficulty}</h4>
        <p>
          Expected score: {expected_score_range.min}% - {expected_score_range.max}%
        </p>
      </div>

      <div className="difficulty-options">
        {['easy', 'medium', 'hard'].map(diff => (
          <button
            key={diff}
            className={`difficulty-btn ${diff} ${diff === difficulty ? 'recommended' : ''}`}
            onClick={() => handleDifficultySelect(diff)}
          >
            {diff}
            {diff === difficulty && <span className="recommended-badge">Recommended</span>}
          </button>
        ))}
      </div>

      {preparation_suggestions?.length > 0 && (
        <div className="preparation-tips">
          <h5>Preparation Tips:</h5>
          <ul>
            {preparation_suggestions.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="reasoning">
        {recommendation.reasoning?.map((reason, index) => (
          <p key={index} className="reason-text">
            {reason}
          </p>
        ))}
      </div>
    </div>
  );
};

/**
 * Comprehensive Personalized Dashboard
 */
export const PersonalizedDashboard = ({ className = '' }) => {
  const [personalization, setPersonalization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPersonalization = async () => {
      try {
        setLoading(true);
        const data = await personalizationAPI.getComprehensivePersonalization();
        setPersonalization(data);
      } catch (err) {
        console.error('Error loading comprehensive personalization:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPersonalization();
  }, []);

  if (loading) {
    return (
      <div className={`personalized-dashboard loading ${className}`}>
        <div className="dashboard-skeleton">
          <div className="skeleton-section"></div>
          <div className="skeleton-section"></div>
          <div className="skeleton-section"></div>
        </div>
      </div>
    );
  }

  if (!personalization) {
    return (
      <div className={`personalized-dashboard ${className}`}>
        <h2>Your Learning Dashboard</h2>
        <p>Loading your personalized content...</p>
      </div>
    );
  }

  return (
    <div className={`personalized-dashboard ${className}`}>
      <div className="dashboard-header">
        <h2>Your Personalized Learning Dashboard</h2>
        <p>Content tailored specifically for you</p>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <PersonalizedQuizRecommendations limit={3} />
        </section>

        <section className="dashboard-section">
          <PersonalizedLearningPath />
        </section>

        <section className="dashboard-section">
          <PersonalizedFeaturePromotions />
        </section>

        <section className="dashboard-section">
          <PersonalizedPricing />
        </section>
      </div>
    </div>
  );
};

// CSS styles (to be added to your stylesheet)
const styles = `
.personalized-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.personalized-content.loading {
  background: #f8f9fa;
}

.content-skeleton, .learning-path-skeleton, .dashboard-skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.skeleton-header, .skeleton-item, .skeleton-modules, .skeleton-section {
  background: #e9ecef;
  border-radius: 4px;
  margin: 8px 0;
}

.skeleton-header { height: 24px; width: 60%; }
.skeleton-item { height: 16px; width: 100%; }
.skeleton-modules { height: 60px; width: 100%; }
.skeleton-section { height: 120px; width: 100%; }

.confidence-indicator {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-bar {
  flex: 1;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%);
  transition: width 0.3s ease;
}

.confidence-text {
  font-size: 12px;
  color: #6c757d;
}

.quiz-list {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.quiz-card {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.difficulty-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty-badge.easy { background: #d4edda; color: #155724; }
.difficulty-badge.medium { background: #fff3cd; color: #856404; }
.difficulty-badge.hard { background: #f8d7da; color: #721c24; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.feature-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}
`;

export default styles;
