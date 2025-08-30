import React from 'react';
import { useTranslation } from 'next-i18next';

export const DownloadPageSEOContent = ({ locale }) => {
  const { t } = useTranslation('download-seo');

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Why Choose CDL Help App */}
      <section style={{ marginBottom: '50px' }}>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '24px',
            color: '#1a1a1a',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {t('whyChooseTitle', {
            defaultValue: 'Why Choose CDL Help App for Your CDL Test Preparation',
          })}
        </h2>
        <p
          style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '20px', fontSize: '1.1rem' }}
        >
          {t('whyChooseContent1', {
            defaultValue: `CDL Help is the most comprehensive and trusted CDL practice test app, used by over 500,000 aspiring truck drivers to pass their Commercial Driver's License exam on the first attempt. Our app combines cutting-edge learning technology with expertly crafted content that mirrors the actual CDL test format and difficulty. With a 97% first-time pass rate among users who complete our full practice program, CDL Help has become the go-to resource for serious CDL candidates nationwide.`,
          })}
        </p>
        <p style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '1.1rem' }}>
          {t('whyChooseContent2', {
            defaultValue: `What sets CDL Help apart is our commitment to accuracy and continuous updates. Our team of CDL instructors and industry experts regularly review and update all questions to reflect the latest Federal Motor Carrier Safety Administration (FMCSA) regulations and state-specific requirements. The app features intelligent progress tracking that identifies your weak areas and provides targeted practice, ensuring efficient study time and maximum retention of critical information.`,
          })}
        </p>
      </section>

      {/* Comprehensive Features */}
      <section style={{ marginBottom: '50px' }}>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '24px',
            color: '#1a1a1a',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {t('featuresTitle', { defaultValue: 'Comprehensive CDL Test Preparation Features' })}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('feature1Title', { defaultValue: 'Complete Question Bank' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('feature1Content', {
                defaultValue: `Access over 2,000 practice questions covering all CDL topics including General Knowledge, Air Brakes, Combination Vehicles, Pre-Trip Inspection, and all endorsements (Hazmat, Tanker, Doubles/Triples, Passenger, School Bus). Each question includes detailed explanations to help you understand not just the correct answer, but the reasoning behind it.`,
              })}
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('feature2Title', { defaultValue: 'State-Specific Content' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('feature2Content', {
                defaultValue: `Practice with questions tailored to your state's specific CDL requirements and regulations. Our app covers all 50 states plus Washington D.C., ensuring you're studying the exact material that will appear on your local DMV test. State-specific topics include local traffic laws, weather conditions, and regional trucking regulations.`,
              })}
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('feature3Title', { defaultValue: 'Smart Learning System' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('feature3Content', {
                defaultValue: `Our adaptive learning algorithm tracks your performance and automatically adjusts the difficulty and frequency of questions based on your progress. Questions you struggle with appear more frequently until mastered, while topics you've mastered are reviewed periodically to ensure retention.`,
              })}
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('feature4Title', { defaultValue: 'Realistic Test Simulation' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('feature4Content', {
                defaultValue: `Experience the actual CDL test environment with our exam simulator that replicates the format, timing, and pressure of the real test. Practice with timed tests that match your state's requirements, building confidence and reducing test anxiety before your actual exam day.`,
              })}
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('feature5Title', { defaultValue: 'Offline Mode Available' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('feature5Content', {
                defaultValue: `Study anywhere, anytime without internet connection. Download all practice tests and study materials for offline access, perfect for studying during breaks at work, while traveling, or in areas with limited connectivity. Your progress syncs automatically when you reconnect.`,
              })}
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('feature6Title', { defaultValue: 'Multi-Language Support' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('feature6Content', {
                defaultValue: `Study in your preferred language with full translations available in Spanish, Russian, Chinese, Arabic, and more. Perfect for ESL students and international drivers pursuing their CDL in the United States. Switch languages instantly while maintaining your progress and scores.`,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section
        style={{
          marginBottom: '50px',
          backgroundColor: '#f0f9ff',
          padding: '40px',
          borderRadius: '16px',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '24px',
            color: '#1a1a1a',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {t('successTitle', { defaultValue: 'Join Thousands of Successful CDL Drivers' })}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '30px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#3c3d78',
                marginBottom: '8px',
              }}
            >
              97%
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {t('stat1', { defaultValue: 'First-Time Pass Rate' })}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#3c3d78',
                marginBottom: '8px',
              }}
            >
              500K+
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {t('stat2', { defaultValue: 'Active Users' })}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#3c3d78',
                marginBottom: '8px',
              }}
            >
              4.8★
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {t('stat3', { defaultValue: 'App Store Rating' })}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#3c3d78',
                marginBottom: '8px',
              }}
            >
              50
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {t('stat4', { defaultValue: 'States Covered' })}
            </p>
          </div>
        </div>
        <p style={{ color: '#4b5563', lineHeight: '1.8', textAlign: 'center', fontSize: '1.1rem' }}>
          {t('successContent', {
            defaultValue: `Our users consistently report feeling more confident and prepared for their CDL exam after using CDL Help. Many pass on their first attempt, saving hundreds of dollars in retesting fees and weeks of additional study time. Join the community of professional drivers who started their careers with CDL Help.`,
          })}
        </p>
      </section>

      {/* Study Tips */}
      <section style={{ marginBottom: '50px' }}>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '24px',
            color: '#1a1a1a',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {t('studyTipsTitle', { defaultValue: 'Maximize Your CDL Test Success' })}
        </h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('tipTitle1', { defaultValue: 'Create a Study Schedule' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('tipContent1', {
                defaultValue: `Dedicate at least 30-60 minutes daily to CDL study using the app. Consistent daily practice is more effective than cramming. Use the app's progress tracking to identify weak areas and allocate extra time to challenging topics. Most successful candidates study for 2-4 weeks before taking their CDL test.`,
              })}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('tipTitle2', { defaultValue: 'Master One Section at a Time' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('tipContent2', {
                defaultValue: `Focus on mastering General Knowledge first, as it forms the foundation for all other sections. Once you consistently score above 80%, move to Air Brakes and Combination Vehicles. Save endorsements for last unless required immediately. This systematic approach builds confidence and ensures thorough understanding.`,
              })}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('tipTitle3', { defaultValue: 'Use All Learning Modes' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('tipContent3', {
                defaultValue: `Alternate between practice tests, marathon mode, and missed questions review. Each mode serves a different purpose: practice tests build familiarity with the format, marathon mode builds endurance and comprehensive knowledge, while missed questions review ensures you learn from mistakes.`,
              })}
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                marginBottom: '12px',
                color: '#374151',
                fontWeight: '600',
              }}
            >
              {t('tipTitle4', { defaultValue: 'Simulate Test Conditions' })}
            </h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {t('tipContent4', {
                defaultValue: `Take full-length practice exams under timed conditions at least three times before your actual test. Sit in a quiet environment without distractions, just like the testing center. This preparation reduces anxiety and improves time management skills crucial for test success.`,
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section style={{ marginBottom: '50px' }}>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '24px',
            color: '#1a1a1a',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {t('compatibilityTitle', { defaultValue: 'Available on All Your Devices' })}
        </h2>
        <p
          style={{
            color: '#4b5563',
            lineHeight: '1.8',
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '1.1rem',
          }}
        >
          {t('compatibilityContent', {
            defaultValue: `CDL Help is optimized for all mobile devices, ensuring a seamless study experience whether you're using an iPhone, iPad, Android phone, or tablet. The app automatically adjusts to your screen size and orientation, making it comfortable to study for extended periods. Your progress syncs across all devices logged into your account, allowing you to switch between devices without losing your place.`,
          })}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📱</div>
            <h4 style={{ color: '#374151', marginBottom: '8px' }}>
              {t('ios', { defaultValue: 'iOS 12+' })}
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {t('iosDevices', { defaultValue: 'iPhone & iPad' })}
            </p>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤖</div>
            <h4 style={{ color: '#374151', marginBottom: '8px' }}>
              {t('android', { defaultValue: 'Android 5.0+' })}
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {t('androidDevices', { defaultValue: 'Phones & Tablets' })}
            </p>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💾</div>
            <h4 style={{ color: '#374151', marginBottom: '8px' }}>
              {t('storage', { defaultValue: 'Light Storage' })}
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {t('storageSize', { defaultValue: 'Under 100MB' })}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#3c3d78',
          borderRadius: '16px',
          color: 'white',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', fontWeight: '600' }}>
          {t('ctaTitle', { defaultValue: 'Start Your CDL Journey Today' })}
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '24px', opacity: 0.95 }}>
          {t('ctaContent', {
            defaultValue: `Download CDL Help now and join thousands of successful truck drivers who passed their CDL test with confidence. Free to download with no hidden fees or subscriptions required.`,
          })}
        </p>
        <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          {t('ctaFeatures', {
            defaultValue:
              '✓ Free Download ✓ No Registration Required ✓ Instant Access to Practice Tests',
          })}
        </div>
      </section>
    </div>
  );
};
