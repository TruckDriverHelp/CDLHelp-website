import React from 'react';

const FacebookPixel = () => (
  <>
    <script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2600309206821382');
          fbq('track', 'PageView');
          `,
      }}
    />
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=2600309206821382&ev=PageView&noscript=1"
      />`,
      }}
    />
    <meta name="facebook-domain-verification" content="i9vf84c1q1m8d0i0oqf1w5d5t0yl5w" />
  </>
);

export default FacebookPixel;
