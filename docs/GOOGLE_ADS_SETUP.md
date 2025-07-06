# Google Ads Integration Setup

## Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Google Ads Configuration
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX  # Your Google Ads Account ID
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=XXXXXXXXX  # Your Conversion ID
```

## How to Get Your IDs

1. **Google Ads Account ID (AW-XXXXXXXXX)**:
   - Log into Google Ads
   - Click on your account name in the top right
   - Your customer ID will be displayed (format: 123-456-7890)
   - Convert it to the format: AW-1234567890

2. **Conversion ID**:
   - Go to Tools & Settings > Conversions
   - Create a new conversion action for "App installs"
   - After creation, click on the conversion name
   - Click "Tag setup" and choose "Install the tag yourself"
   - Find the conversion ID in the tag (looks like: send_to: 'AW-XXXXXXXXX/YYYYYYYYYYY')
   - The part after the slash (YYYYYYYYYYY) is your conversion ID

## What Gets Tracked

The integration tracks the following events:

### 1. Download Intent Conversion

- Fires when users click download buttons
- Tracks as a conversion with $0 value
- Includes platform (iOS/Android) and source information
- Transaction ID format: `{timestamp}_{platform}_{source}`

### 2. Remarketing Events

- Page views with app information for dynamic remarketing
- App store redirect clicks

### 3. Attribution Data

- Google Click ID (gclid) for conversion attribution
- Campaign parameters (UTM tags)
- Device and platform information

## Consent Management

Google Ads tracking only fires when users grant "marketing" consent through the cookie banner.

## Testing Your Setup

1. Enable debug mode by setting `NODE_ENV=development`
2. Open browser console
3. Click a download button
4. Look for "Google Ads conversion tracked" in console
5. Check Google Ads account for test conversions

## Conversion Value Strategy

Currently set to $0 for all conversions. You can modify this in `analytics.js` if you want to assign values based on:

- User lifetime value predictions
- Platform-specific values
- Campaign-specific values

## Troubleshooting

1. **No conversions showing**:
   - Check that marketing consent is granted
   - Verify environment variables are set correctly
   - Conversions can take up to 3 hours to appear in Google Ads

2. **gtag is not defined errors**:
   - Ensure Google Ads script loads before analytics.js initializes
   - Check that ad blockers aren't preventing script loading

3. **Duplicate conversions**:
   - Each download intent has a unique transaction ID to prevent duplicates
   - Check that you're not firing conversions on both client and server side
