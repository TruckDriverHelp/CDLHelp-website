/**
 * Environment Variable Validation for CDL Help Website
 * Ensures all required API keys are properly configured
 */

const requiredPublicEnvVars = {
  NEXT_PUBLIC_GOOGLE_ANALYTICS: 'Google Analytics tracking ID',
  NEXT_PUBLIC_GOOGLE_ADS_ID: 'Google Ads conversion ID',
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID: 'Facebook Pixel ID',
  NEXT_PUBLIC_APPSFLYER_DEV_KEY: 'AppsFlyer dev key',
  NEXT_PUBLIC_APPSFLYER_APP_ID: 'AppsFlyer app ID',
  NEXT_PUBLIC_SMARTLOOK_PROJECT_KEY: 'Smartlook project key',
  NEXT_PUBLIC_AMPLITUDE_API_KEY: 'Amplitude API key',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'Google Maps API key',
};

const requiredServerEnvVars = {
  STRAPI_API_KEY: 'Strapi CMS API key',
  SENDGRID_API_KEY: 'SendGrid email API key',
  GOOGLE_MAPS_API_KEY: 'Google Maps server API key',
};

export function validatePublicEnvVars() {
  const missing = [];
  Object.entries(requiredPublicEnvVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`);
    }
  });

  if (missing.length > 0) {
  }

  return missing.length === 0;
}

export function validateServerEnvVars() {
  const missing = [];
  Object.entries(requiredServerEnvVars).forEach(([key, description]) => {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`);
    }
  });

  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Missing server environment variables:', missing);
    }
  }

  return missing.length === 0;
}
