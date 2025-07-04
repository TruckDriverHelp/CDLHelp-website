# Google Tag Manager Implementation

## Overview

Google Tag Manager (GTM) has been implemented in the CDLHelp website to provide a centralized way to manage marketing and analytics tags.

## Implementation Details

### 1. Files Modified

#### `/pages/_app.js`

Added the GTM script that loads after the page becomes interactive:

```javascript
{
  /* Google Tag Manager - Load after page becomes interactive */
}
{
  process.env.NEXT_PUBLIC_GTM_ID && (
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
      `,
      }}
    />
  );
}
```

#### `/pages/_document.js`

Added the GTM noscript fallback for users with JavaScript disabled:

```javascript
{
  /* Google Tag Manager (noscript) */
}
{
  process.env.NEXT_PUBLIC_GTM_ID && (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
```

### 2. Environment Variable

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Replace `GTM-XXXXXXX` with your actual Google Tag Manager container ID.

### 3. Features

- **Conditional Loading**: GTM only loads if the environment variable is set
- **Performance Optimized**: Uses Next.js Script component with `afterInteractive` strategy
- **Noscript Support**: Includes fallback for users with JavaScript disabled
- **Works Alongside GA**: Existing Google Analytics implementation remains intact

## Setup Instructions

1. Create a Google Tag Manager account at https://tagmanager.google.com
2. Create a new container for your website
3. Copy the container ID (format: GTM-XXXXXXX)
4. Add the container ID to your `.env.local` file
5. Deploy the changes

## Benefits

- **Centralized Tag Management**: Manage all marketing and analytics tags from one place
- **No Code Deployments**: Add/modify tags without changing website code
- **Version Control**: GTM provides its own version control for tag configurations
- **Debug Mode**: Test tags before publishing them live
- **User Permissions**: Control who can modify tags

## Notes

- The existing Google Analytics implementation via gtag.js is still in place
- You can migrate Google Analytics to GTM if desired
- GTM can manage multiple types of tags: Analytics, Ads, Pixels, etc.
