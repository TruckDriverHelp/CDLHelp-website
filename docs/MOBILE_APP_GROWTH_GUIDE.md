# Mobile App Growth Optimization Guide

## Overview

This guide documents the mobile app growth optimization implementation for CDLHelp, including unified tracking, attribution, and conversion optimization strategies.

## Key Features Implemented

### 1. Unified Analytics Module (`/lib/analytics.js`)

A centralized analytics system that integrates:

- **Google Analytics 4** - Enhanced ecommerce and custom events
- **Meta/Facebook Pixel** - Standard and custom conversion events
- **AppsFlyer** - Mobile attribution and deep linking

Key tracking capabilities:

- Page views with enhanced parameters
- Download intent tracking with attribution
- Quiz completions and engagement metrics
- Video engagement tracking
- User property management

### 2. Attribution System (`/lib/attribution.js`)

Advanced attribution handling with:

- **AppsFlyer OneLink** integration for seamless app store redirects
- **UTM parameter** capture and persistence
- **Device detection** for optimized user flows
- **Deep linking** support for better onboarding
- **Cross-page attribution** using session storage

### 3. Smart App Banner (`/components/_App/SmartAppBanner.js`)

Mobile-optimized banner that:

- Detects iOS/Android devices automatically
- Shows native-like app install prompt
- Tracks impressions, clicks, and dismissals
- Preserves attribution through install flow
- Remembers user dismissal preference

### 4. Enhanced Download Page

Improved download page with:

- Attribution-aware download buttons
- Enhanced tracking for conversion optimization
- Dynamic app store links based on locale
- Comprehensive event tracking

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Google Analytics (required)
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX

# AppsFlyer Configuration (required for attribution)
NEXT_PUBLIC_APPSFLYER_DEV_KEY=your_dev_key_here
NEXT_PUBLIC_APPSFLYER_APP_ID=help.truckdriver.cdlhelp
NEXT_PUBLIC_APPSFLYER_ONELINK_ID=mgvvp96d
NEXT_PUBLIC_APPSFLYER_ONELINK_URL=https://cdlhelp.onelink.me/mHbW/mgvvp96d

# Deep Linking Configuration
NEXT_PUBLIC_IOS_TEAM_ID=your_ios_team_id
NEXT_PUBLIC_ANDROID_SHA256_CERT=your_android_sha256_cert
```

### 2. Update App Association Files

#### iOS (apple-app-site-association)

Update `/public/.well-known/apple-app-site-association`:

- Replace `TEAM_ID` with your Apple Developer Team ID

#### Android (assetlinks.json)

Update `/public/.well-known/assetlinks.json`:

- Replace `SHA256_CERT_FINGERPRINT` with your app's SHA256 certificate fingerprint

### 3. Configure AppsFlyer

1. Create an AppsFlyer account and add your app
2. Generate a OneLink URL for unified attribution
3. Configure postback URLs for server-to-server tracking
4. Set up conversion events in AppsFlyer dashboard

## Tracking Implementation

### Page Views

Automatically tracked on route changes with enhanced parameters:

```javascript
analytics.trackPageView(url, title);
```

### Download Intent

Track when users show intent to download:

```javascript
analytics.trackDownloadIntent(platform, source, campaign);
```

### Quiz Completions

Track quiz completions for engagement optimization:

```javascript
analytics.trackQuizCompletion(score, totalQuestions, locale);
```

### Custom Events

Track any custom engagement:

```javascript
analytics.trackFeatureEngagement(feature, action, value);
```

## Attribution Flow

1. **User lands on website** → UTM parameters captured
2. **User clicks download** → Attribution data preserved
3. **Redirect to app store** → Parameters passed via OneLink
4. **App install** → Attribution connected in AppsFlyer
5. **User opens app** → Deep link to specific content

## Conversion Optimization Best Practices

### 1. Landing Page Optimization

- Show Smart App Banner on mobile devices
- Track scroll depth and engagement time
- A/B test different CTAs and layouts

### 2. Attribution Windows

- Default: 7-day click, 1-day view
- Adjust based on your user journey data
- Consider longer windows for educational apps

### 3. Campaign Tracking

Always use UTM parameters:

- `utm_source` - Traffic source (google, facebook)
- `utm_medium` - Medium (cpc, social, email)
- `utm_campaign` - Campaign name
- `utm_term` - Keywords (for paid search)
- `utm_content` - Ad/content variant

### 4. Deep Linking Strategy

Configure deep links for:

- Onboarding flows
- Specific quiz categories
- Premium feature trials
- Re-engagement campaigns

## Testing Your Implementation

### 1. Attribution Testing

```bash
# Test with UTM parameters
https://cdlhelp.com/download?utm_source=test&utm_medium=test&utm_campaign=test

# Verify in browser console
localStorage.getItem('attribution_params')
```

### 2. Analytics Testing

Open browser console and look for `[Analytics]` logs when:

- Navigating between pages
- Clicking download buttons
- Completing quizzes

### 3. Deep Link Testing

- iOS: Use Safari on device, navigate to deep link URL
- Android: Use Chrome on device, navigate to deep link URL

## Performance Monitoring

### Key Metrics to Track

1. **Acquisition Metrics**
   - Install attribution by source
   - Cost per install (CPI) by channel
   - Organic vs paid install ratio

2. **Engagement Metrics**
   - Quiz completion rates
   - Time to first purchase
   - Feature adoption rates

3. **Retention Metrics**
   - Day 1, 7, 30 retention
   - Cohort retention curves
   - Churn prediction signals

### Dashboard Setup

1. **Google Analytics 4**
   - Create custom dashboard for app metrics
   - Set up conversion events
   - Configure audiences for remarketing

2. **Meta Ads Manager**
   - Link AppsFlyer for mobile app installs
   - Create custom conversions
   - Set up dynamic ads for app installs

3. **AppsFlyer Dashboard**
   - Configure attribution settings
   - Set up fraud prevention rules
   - Create cohort reports

## Troubleshooting

### Common Issues

1. **Tracking not working**
   - Check browser console for errors
   - Verify environment variables are set
   - Ensure ad blockers are disabled for testing

2. **Attribution not connecting**
   - Verify AppsFlyer SDK integration in app
   - Check OneLink configuration
   - Test with AppsFlyer testing tools

3. **Deep links not working**
   - Verify app association files are served
   - Check app URL scheme configuration
   - Test with AppsFlyer OneLink simulator

## Next Steps

1. **Implement A/B Testing**
   - Test different download page layouts
   - Experiment with Smart Banner designs
   - Try various CTA copy

2. **Add Predictive Analytics**
   - Implement user scoring
   - Predict churn probability
   - Optimize for high-value users

3. **Enhance Personalization**
   - Show relevant content based on source
   - Customize onboarding by campaign
   - Dynamic pricing based on attribution

## Support

For questions or issues:

1. Check AppsFlyer documentation
2. Review Google Analytics 4 guides
3. Consult Meta Business Help Center
