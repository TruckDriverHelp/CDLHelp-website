# AppsFlyer Postback Configuration Guide

This guide helps you set up postbacks to send conversion data from AppsFlyer back to your advertising platforms (Meta Ads, Google Ads, TikTok, etc.).

## Why Postbacks Matter

Postbacks allow you to:

- **Optimize campaigns** based on actual app installs and in-app events
- **Create lookalike audiences** from high-value users
- **Improve bidding** with conversion data
- **Calculate true ROI** including in-app purchases

## Meta (Facebook) Ads Setup

### Prerequisites

- Facebook Business Manager account
- Mobile app registered in Facebook
- Admin access to both AppsFlyer and Facebook

### Step-by-Step Configuration

#### 1. Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create or select your app
3. Go to **Settings** → **Basic**
4. Note your **App ID**

#### 2. Generate System User Token

1. In Business Manager, go to **Business Settings**
2. Navigate to **Users** → **System Users**
3. Create a new system user with **Admin** access
4. Generate token with these permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`

#### 3. AppsFlyer Configuration

1. In AppsFlyer: **Configuration** → **Integrated Partners** → **Meta ads**
2. Enter:
   ```
   App ID: [Your Facebook App ID]
   Business ID: [Your Business ID]
   System User Token: [Generated token]
   ```

#### 4. Event Mapping

Map these essential events:

| AppsFlyer Event            | Facebook Standard Event | Use Case            |
| -------------------------- | ----------------------- | ------------------- |
| `install`                  | `Install`               | New app installs    |
| `af_complete_registration` | `CompleteRegistration`  | User sign-ups       |
| `af_subscribe`             | `Subscribe`             | Subscription starts |
| `af_purchase`              | `Purchase`              | In-app purchases    |
| `af_start_trial`           | `StartTrial`            | Free trial starts   |
| `af_level_achieved`        | `AchievementUnlocked`   | User milestones     |

#### 5. Advanced Settings

- **Send SKAN Postback**: ON (for iOS 14.5+)
- **Value Optimization**: Enable for purchase events
- **Send Zero Value Events**: OFF (to reduce noise)

## Google Ads Setup

### Prerequisites

- Google Ads account with app campaigns
- Google Play Console or App Store Connect access
- Conversion tracking enabled

### Configuration Steps

#### 1. Create App Conversions in Google Ads

1. Google Ads → **Tools & Settings** → **Conversions**
2. Click **+** → **App**
3. Select **App installs from ads**
4. Choose your app platform
5. Configure:
   ```
   Conversion name: App Install - AppsFlyer
   Category: App Install
   Value: Use different values (optional)
   Count: One per click
   Attribution: Data-driven
   ```

#### 2. Get Conversion Details

Note these for each conversion:

- **Conversion ID**: Found in conversion settings
- **Label**: Unique identifier for the conversion

#### 3. AppsFlyer Setup

1. In AppsFlyer: **Configuration** → **Integrated Partners** → **Google Ads**
2. Configure:
   ```
   Link ID: [Your Google Ads Customer ID]
   Dev Key: [Auto-populated]
   App ID:
     - Android: help.truckdriver.cdlhelp
     - iOS: id6444388755
   ```

#### 4. Add Conversion Mappings

For each conversion type:

| Event        | Conversion ID | Label        | Window  |
| ------------ | ------------- | ------------ | ------- |
| Install      | 123456789     | ABC123def456 | 30 days |
| Registration | 987654321     | XYZ789ghi012 | 30 days |
| Trial Start  | 456789012     | MNO345jkl678 | 30 days |
| Purchase     | 789012345     | PQR901stu234 | 30 days |

## TikTok Ads Setup

### Quick Setup

1. TikTok Ads Manager → **Assets** → **Events**
2. Create **App Events** source
3. Get **App ID** from TikTok
4. In AppsFlyer → **TikTok Ads** integration
5. Enter App ID and configure events

## Testing Postbacks

### 1. Test Mode

Most platforms offer test modes:

- **Meta**: Use Test Events in Events Manager
- **Google**: Use Tag Assistant or Preview mode
- **TikTok**: Use Debug Mode

### 2. Verification Steps

1. Install app through a test campaign
2. Trigger in-app events
3. Check partner dashboard (3-24 hour delay)
4. Verify in AppsFlyer raw data reports

### 3. Common Issues

#### Events Not Showing

- Check attribution window settings
- Verify partner permissions
- Ensure events are mapped correctly
- Check for data processing delays

#### Wrong Attribution

- Verify click IDs are passed correctly
- Check attribution window overlap
- Review partner hierarchy settings

## Best Practices

### 1. Event Priority

Focus on events that matter:

1. **Install** - Always track
2. **Registration** - Key for user quality
3. **Trial/Subscribe** - Revenue indicators
4. **First Purchase** - LTV signal

### 2. Attribution Windows

Recommended settings:

- **Install**: 7-day click, 1-day view
- **Re-engagement**: 7-day click
- **In-app events**: 30-day post-install

### 3. Privacy Compliance

- Enable **Limited Data Use** for Meta
- Configure **Consent Mode** for Google
- Implement **ATT** for iOS properly
- Use **SKAN** for iOS 14.5+

### 4. Data Accuracy

- Use server-to-server where possible
- Implement AppsFlyer SDK correctly
- Validate with QA before launch
- Monitor discrepancies regularly

## Monitoring & Optimization

### Weekly Checks

1. **Postback Success Rate**: Should be >95%
2. **Event Volume**: Compare with AppsFlyer
3. **Cost Data**: Verify accuracy
4. **ROAS Calculation**: Check formulas

### Monthly Reviews

1. **Attribution Window Performance**
2. **Event Mapping Accuracy**
3. **Partner Discrepancies**
4. **Privacy Threshold Impact**

## Troubleshooting

### Meta Ads Issues

```
Error: "Invalid Access Token"
→ Solution: Regenerate system user token

Error: "Event Not Received"
→ Solution: Check event mapping and delays

Error: "Missing Parameters"
→ Solution: Ensure all required fields are sent
```

### Google Ads Issues

```
Error: "Conversion Not Found"
→ Solution: Verify conversion ID and label

Error: "Duplicate Conversions"
→ Solution: Check deduplication settings

Error: "No Data"
→ Solution: Wait 24 hours, check attribution
```

## Support Resources

### AppsFlyer

- [Help Center](https://support.appsflyer.com/)
- [Integration Guides](https://support.appsflyer.com/hc/en-us/categories/201114756-Integrations)
- Email: support@appsflyer.com

### Partner Resources

- [Meta Business Help](https://www.facebook.com/business/help)
- [Google Ads Help](https://support.google.com/google-ads)
- [TikTok Business Center](https://ads.tiktok.com/help/)

## Checklist

Before going live, ensure:

- [ ] All conversions created in partner platforms
- [ ] Postbacks configured in AppsFlyer
- [ ] Events properly mapped
- [ ] Attribution windows set
- [ ] Test events successful
- [ ] Cost data importing (if needed)
- [ ] Privacy settings configured
- [ ] QA testing completed

Remember: Postback configuration directly impacts your ability to optimize campaigns. Take time to set it up correctly!
