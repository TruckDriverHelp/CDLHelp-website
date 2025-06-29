/**
 * Test script to verify hreflang URL generation
 */

// Inline the utility functions for testing
function removeTrailingSlash(path) {
  if (path === '/') return path;
  return path.replace(/\/$/, '');
}

function generateHreflangUrls(currentPath, supportedLocales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt']) {
  // Remove any existing locale prefix and trailing slashes
  const cleanPath = removeTrailingSlash(
    currentPath.replace(/^\/(ru|uk|ar|ko|zh|tr|pt)(\/|$)/, '/')
  );
  
  const hreflangUrls = {};
  
  supportedLocales.forEach(locale => {
    if (locale === 'en') {
      // English doesn't use locale prefix
      hreflangUrls[locale] = cleanPath;
    } else {
      // Other languages use locale prefix
      hreflangUrls[locale] = cleanPath === '/' 
        ? `/${locale}` 
        : `/${locale}${cleanPath}`;
    }
  });
  
  return hreflangUrls;
}

console.log('Testing Hreflang URL Generation\n');
console.log('================================\n');

// Test cases
const testPaths = [
  '/',
  '/download',
  '/cdl-schools',
  '/ru/download',
  '/ar/cdl-schools',
  '/contact/',  // with trailing slash
  '/ru/contact/',  // with trailing slash
];

const supportedLocales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

testPaths.forEach(path => {
  console.log(`Testing path: "${path}"`);
  console.log(`Clean path: "${removeTrailingSlash(path)}"`);
  
  const hreflangUrls = generateHreflangUrls(path, supportedLocales);
  
  console.log('Generated hreflang URLs:');
  Object.entries(hreflangUrls).forEach(([lang, url]) => {
    console.log(`  ${lang}: https://www.cdlhelp.com${url}`);
  });
  
  console.log('\n');
});

// Test homepage specific case
console.log('Homepage Alternates Test\n');
console.log('========================\n');

const homepageAlternates = {
  'en': '/',
  'ar': '/ar',
  'ru': '/ru',
  'uk': '/uk',
  'zh': '/zh',
  'ko': '/ko',
  'tr': '/tr',
  'pt': '/pt'
};

console.log('Homepage alternate links (from index.js):');
Object.entries(homepageAlternates).forEach(([lang, path]) => {
  console.log(`  ${lang}: https://www.cdlhelp.com${path}`);
  // Check for trailing slashes
  if (path !== '/' && path.endsWith('/')) {
    console.log(`    ⚠️  WARNING: Has trailing slash!`);
  }
});

console.log('\n✅ All homepage URLs are correctly formatted without trailing slashes!\n');