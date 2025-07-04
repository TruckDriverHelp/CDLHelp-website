import React from 'react';
import ArticleBanner from './ArticleBanner';

// Example icon component
const StarIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const ArticleBannerExamples = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-8">Article Banner Examples</h2>

      {/* Example 1: Call-to-Action Banner */}
      <ArticleBanner
        title="Ready to Get Started?"
        subtitle="Take Action Now"
        description="Join thousands of users who have already improved their workflow with our platform. Start your free trial today and see the difference."
        buttonText="Start Free Trial"
        buttonLink="/signup"
        backgroundColor="gradient"
        alignment="center"
        padding="large"
      />

      {/* Example 2: Information Banner */}
      <ArticleBanner
        title="Pro Tip"
        subtitle="Expert Advice"
        description="Did you know that using keyboard shortcuts can increase your productivity by up to 40%? Learn the most effective shortcuts for your daily tasks."
        backgroundColor="light"
        textColor="dark"
        alignment="left"
        padding="medium"
      />

      {/* Example 3: Download Banner with Icon */}
      <ArticleBanner
        title="Download Our Mobile App"
        subtitle="Available Now"
        description="Get instant access to all features on the go. Download our mobile app for iOS and Android devices."
        buttonText="Download Now"
        buttonLink="/download"
        backgroundColor="blue"
        showIcon={true}
        icon={<DownloadIcon />}
        alignment="center"
        padding="medium"
      />

      {/* Example 4: Newsletter Signup */}
      <ArticleBanner
        title="Stay Updated"
        subtitle="Newsletter"
        description="Get the latest tips, tutorials, and industry insights delivered directly to your inbox. No spam, just valuable content."
        buttonText="Subscribe"
        buttonLink="/newsletter"
        backgroundColor="purple"
        buttonVariant="outline"
        alignment="center"
        padding="medium"
      />

      {/* Example 5: Feature Highlight */}
      <ArticleBanner
        title="Premium Features"
        subtitle="Unlock More"
        description="Upgrade to our premium plan and unlock advanced analytics, priority support, and exclusive integrations."
        buttonText="Upgrade Now"
        buttonLink="/pricing"
        backgroundColor="orange"
        showIcon={true}
        icon={<StarIcon />}
        alignment="center"
        padding="large"
      />

      {/* Example 6: Success Story */}
      <ArticleBanner
        title="Customer Success Story"
        subtitle="Real Results"
        description="Sarah from TechCorp increased her team's efficiency by 60% using our platform. Read her complete journey and learn how you can achieve similar results."
        buttonText="Read Case Study"
        buttonLink="/case-studies/sarah-techcorp"
        backgroundColor="green"
        alignment="left"
        padding="medium"
      />

      {/* Example 7: Alert/Notice Banner */}
      <ArticleBanner
        title="Important Update"
        subtitle="System Maintenance"
        description="We'll be performing scheduled maintenance on Sunday, March 15th from 2:00 AM to 6:00 AM EST. Some features may be temporarily unavailable."
        backgroundColor="solid"
        alignment="center"
        padding="small"
      />

      {/* Example 8: Custom Content Banner */}
      <ArticleBanner
        title="Custom Content Example"
        backgroundColor="gradient"
        alignment="center"
        padding="medium"
      >
        <div className="text-white">
          <p className="mb-4">This banner contains custom content passed as children.</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Option 1
            </button>
            <button className="border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-gray-800 transition-colors">
              Option 2
            </button>
          </div>
        </div>
      </ArticleBanner>
    </div>
  );
};

export default ArticleBannerExamples;
