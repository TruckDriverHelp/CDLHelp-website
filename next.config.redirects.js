/**
 * Redirect configuration for fixing 404 errors
 * These redirects handle URLs that should not exist or have moved
 */

module.exports = async () => {
  const redirects = [];

  // Redirect non-English pre-trip inspection sections to the guide
  const nonEnglishLocales = ['ar', 'ko', 'pt', 'ru', 'tr', 'uk', 'zh'];
  const preTripSections = [
    '1-tractor-front',
    '2-tractor-side',
    '3-engine-driver-side',
    '4-engine-passenger-side',
    '5-front-suspension',
    '6-front-brakes',
    '7-tractor-coupling',
    '8-front-of-trailer',
    '9-rear-wheels',
    '10-drive-axle-suspension',
    '11-drive-brakes',
    '12-coupling-system',
    '13-side-of-trailer',
    '14-trailer-suspension',
    '15-trailer-brakes',
    '16-trailer-wheels',
    '17-rear-of-trailer',
    '18-in-cab-inspection',
    '19-brakes',
  ];

  // Redirect all non-English pre-trip sections to the guide
  nonEnglishLocales.forEach(locale => {
    preTripSections.forEach(section => {
      redirects.push({
        source: `/${locale}/pre-trip-inspection/${section}`,
        destination: `/${locale}/pre-trip-inspection/guide`,
        permanent: true,
      });
    });
  });

  // Also redirect English pre-trip sections without locale prefix
  preTripSections.forEach(section => {
    redirects.push({
      source: `/pre-trip-inspection/${section}`,
      destination: `/pre-trip-inspection/guide`,
      permanent: true, // Changed to permanent - these pages don't exist and redirect to guide
    });
  });

  // Redirect /school/[state] to /schools page
  // The school state pages exist but may have build issues, redirect for now
  const states = [
    'alabama',
    'alaska',
    'arizona',
    'arkansas',
    'california',
    'colorado',
    'connecticut',
    'delaware',
    'florida',
    'georgia',
    'hawaii',
    'idaho',
    'illinois',
    'indiana',
    'iowa',
    'kansas',
    'kentucky',
    'louisiana',
    'maine',
    'maryland',
    'massachusetts',
    'michigan',
    'minnesota',
    'mississippi',
    'missouri',
    'montana',
    'nebraska',
    'nevada',
    'new-hampshire',
    'new-jersey',
    'new-mexico',
    'new-york',
    'north-carolina',
    'north-dakota',
    'ohio',
    'oklahoma',
    'oregon',
    'pennsylvania',
    'rhode-island',
    'south-carolina',
    'south-dakota',
    'tennessee',
    'texas',
    'utah',
    'vermont',
    'virginia',
    'washington',
    'west-virginia',
    'wisconsin',
    'wyoming',
  ];

  states.forEach(state => {
    redirects.push({
      source: `/school/${state}`,
      destination: '/schools',
      permanent: true, // Changed to permanent - these old URLs should use /schools/[state] pattern
    });
  });

  // Redirect non-existent Russian blog articles
  const nonExistentRuArticles = [
    'skolko-zarabatyvayut-dalnoboyshchiki-v-ssha',
    'chto-takoye-eldt-i-pochemu-bez-etogo-ne-poluchit-cdl',
    'kak-dalnoboyshchiku-zarabotat-bolshe-dopuski-v-cdl',
    'avtomat-ili-mekhanika-chto-luchshe-dlya-dalnoboyshchika',
  ];

  nonExistentRuArticles.forEach(slug => {
    redirects.push({
      source: `/ru/${slug}`,
      destination: '/ru/blog',
      permanent: false,
    });
  });

  // Redirect New York City pages that don't exist
  // These are causing hreflang non-200 errors
  const allLocales = ['', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  allLocales.forEach(locale => {
    const prefix = locale ? `/${locale}` : '';
    redirects.push({
      source: `${prefix}/schools/new-york/new-york`,
      destination: `${prefix}/schools/new-york`,
      permanent: true, // Changed to permanent - NYC doesn't have a separate schools page
    });
  });

  return redirects;
};
