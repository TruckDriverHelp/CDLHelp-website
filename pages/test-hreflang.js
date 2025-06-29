import React from 'react';
import { useRouter } from 'next/router';
import { SEOHead } from '../src/shared/ui/SEO';
import { generateHreflangUrls } from '../lib/urlUtils';

const TestHreflangPage = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  const currentLocale = router.locale || 'en';
  
  // Generate hreflang URLs
  const hreflangUrls = generateHreflangUrls(currentPath);
  
  // Example of custom alternate links for a page with different slugs
  const customAlternateLinks = {
    'en': '/frequently-asked-questions',
    'ru': '/ru/chasto-zadavaemye-voprosy',
    'uk': '/uk/chasti-zapytannya',
    'ar': '/ar/alas-ila-alshaeia-musaedat-cdl',
    'ko': '/ko/jaju-mudneun-jilmun-cdl-doum',
    'zh': '/zh/changjian-wenti-cdl-bangzhu',
    'tr': '/tr/sikca-sorulan-sorular',
    'pt': '/pt/perguntas-frequentes'
  };

  return (
    <>
      <SEOHead
        title="Hreflang Test Page"
        description="Testing hreflang implementation for CDLHelp"
      />
      
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Hreflang Implementation Test</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Current Page Info:</h2>
          <ul>
            <li><strong>Path:</strong> {currentPath}</li>
            <li><strong>Locale:</strong> {currentLocale}</li>
            <li><strong>Full URL:</strong> https://www.cdlhelp.com{currentPath}</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Generated Hreflang URLs:</h2>
          <p>These URLs are automatically generated based on the current path:</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Language</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>hrefLang</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>URL</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>Default</td>
                <td style={{ padding: '10px' }}><code>x-default</code></td>
                <td style={{ padding: '10px' }}>
                  <code>https://www.cdlhelp.com{hreflangUrls['en']}</code>
                </td>
              </tr>
              {Object.entries(hreflangUrls).map(([lang, path]) => (
                <tr key={lang} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{lang.toUpperCase()}</td>
                  <td style={{ padding: '10px' }}><code>{lang}</code></td>
                  <td style={{ padding: '10px' }}>
                    <code>https://www.cdlhelp.com{path}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Test Different Pages:</h2>
          <p>Click to test hreflang generation for different pages:</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/test-hreflang')}>
              English Version
            </button>
            <button onClick={() => router.push('/ru/test-hreflang')}>
              Russian Version
            </button>
            <button onClick={() => router.push('/download')}>
              Download Page
            </button>
            <button onClick={() => router.push('/cdl-schools')}>
              CDL Schools
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Custom Alternate Links Example:</h2>
          <p>For pages with different slugs across languages:</p>
          <pre style={{ background: '#f5f5f5', padding: '15px', overflow: 'auto' }}>
{`const alternateLinks = ${JSON.stringify(customAlternateLinks, null, 2)}

<SEOHead
  title={title}
  description={description}
  alternateLinks={alternateLinks}
/>`}
          </pre>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#e8f4f8', borderRadius: '5px' }}>
          <h3>How to Check Hreflang Tags:</h3>
          <ol>
            <li>Right-click and select "View Page Source"</li>
            <li>Search for <code>hrefLang</code></li>
            <li>Verify all language versions are listed</li>
            <li>Check that <code>x-default</code> is included</li>
            <li>Ensure all URLs are absolute (include https://www.cdlhelp.com)</li>
            <li>Verify no URLs have trailing slashes (except homepage)</li>
          </ol>
        </div>

        <style jsx>{`
          button {
            padding: 10px 20px;
            background: #5a5886;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background: #4a4876;
          }
        `}</style>
      </div>
    </>
  );
};

export default TestHreflangPage;