import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import attribution from '../lib/attribution';

const TestAttributionPage = () => {
  const router = useRouter();
  const [attributionUrl, setAttributionUrl] = useState({ ios: '', android: '' });
  const [urlParams, setUrlParams] = useState({});

  useEffect(() => {
    // Get current URL parameters
    const params = attribution.getUrlParams();
    setUrlParams(params);

    // Generate attribution URLs for both platforms
    const iosUrl = attribution.generateAttributionLink('ios');
    const androidUrl = attribution.generateAttributionLink('android');
    
    setAttributionUrl({
      ios: iosUrl,
      android: androidUrl
    });
  }, [router.query]);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Attribution Test Page</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <h2>Current URL Parameters:</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
          {JSON.stringify(urlParams, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Generated Attribution URLs:</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>iOS OneLink URL:</h3>
          <code style={{ 
            display: 'block', 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px',
            wordBreak: 'break-all'
          }}>
            {attributionUrl.ios}
          </code>
          <button 
            onClick={() => window.open(attributionUrl.ios, '_blank')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: '#007AFF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Test iOS Link
          </button>
        </div>

        <div>
          <h3>Android OneLink URL:</h3>
          <code style={{ 
            display: 'block', 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px',
            wordBreak: 'break-all'
          }}>
            {attributionUrl.android}
          </code>
          <button 
            onClick={() => window.open(attributionUrl.android, '_blank')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: '#3DDC84',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Test Android Link
          </button>
        </div>
      </div>

      <div style={{ marginTop: '40px', background: '#e8f4f8', padding: '20px', borderRadius: '5px' }}>
        <h3>Test with UTM Parameters:</h3>
        <p>Try adding these parameters to the URL:</p>
        <code>
          ?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale
        </code>
        <button 
          onClick={() => {
            router.push('/test-attribution?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale');
          }}
          style={{
            display: 'block',
            marginTop: '10px',
            padding: '10px 20px',
            background: '#5a5886',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add Test Parameters
        </button>
      </div>
    </div>
  );
};

export default TestAttributionPage;