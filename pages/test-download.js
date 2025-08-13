import React from 'react';
import Head from 'next/head';

const TestDownloadPage = () => {
  return (
    <>
      <Head>
        <title>Test Download Buttons - CDL Help</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Test Download Page</h1>
        <p>Testing download button functionality</p>

        <h2>Direct Links (No JavaScript)</h2>
        <div style={{ marginBottom: '30px' }}>
          <a
            href="https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginRight: '15px',
            }}
          >
            Download from Google Play (Direct)
          </a>
          <a
            href="https://apps.apple.com/us/app/cdl-help/id6444388755"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#007AFF',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Download from App Store (Direct)
          </a>
        </div>

        <h2>OneLink Universal</h2>
        <div style={{ marginBottom: '30px' }}>
          <a
            href="https://cdlhelp.onelink.me/mHbW/mgvvp96d"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#FF6B6B',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Universal Download Link (OneLink)
          </a>
        </div>

        <h2>JavaScript Test</h2>
        <div>
          <button
            onClick={() => {
              console.log('Button clicked - redirecting to Play Store');
              window.location.href =
                'https://play.google.com/store/apps/details?id=help.truckdriver.cdlhelp';
            }}
            style={{
              padding: '15px 30px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '15px',
            }}
          >
            Test JS Redirect (Android)
          </button>
          <button
            onClick={() => {
              console.log('Button clicked - redirecting to App Store');
              window.location.href = 'https://apps.apple.com/us/app/cdl-help/id6444388755';
            }}
            style={{
              padding: '15px 30px',
              backgroundColor: '#E91E63',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Test JS Redirect (iOS)
          </button>
        </div>

        <div
          style={{
            marginTop: '50px',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
          }}
        >
          <h3>Debug Info:</h3>
          <p>
            User Agent: <code>{typeof window !== 'undefined' ? navigator.userAgent : 'SSR'}</code>
          </p>
          <p>
            Platform: <code>{typeof window !== 'undefined' ? navigator.platform : 'SSR'}</code>
          </p>
          <p>
            Current URL: <code>{typeof window !== 'undefined' ? window.location.href : 'SSR'}</code>
          </p>
        </div>
      </div>
    </>
  );
};

export default TestDownloadPage;
